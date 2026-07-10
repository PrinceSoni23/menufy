import axios, { AxiosInstance, AxiosError, AxiosProgressEvent } from "axios";
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from "./constants";
import { ApiResponse, AuthResponse } from "./types";

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<void> | null = null;
  private csrfBootstrapPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async config => {
        // Handle FormData - remove default Content-Type so axios can set proper multipart boundary
        if (config.data instanceof FormData) {
          if (config.headers) {
            delete (config.headers as any)["Content-Type"];
            delete (config.headers as any)["content-type"];
          }
        }

        const csrfToken = this.getCsrfToken();
        const method = (config.method || "get").toUpperCase();
        const isRefreshRequest = (config.url || "").includes("/auth/refresh");

        if (
          !isRefreshRequest &&
          !csrfToken &&
          !["GET", "HEAD", "OPTIONS"].includes(method)
        ) {
          await this.bootstrapCsrfToken();
        }

        const currentCsrfToken = this.getCsrfToken();
        if (
          !isRefreshRequest &&
          currentCsrfToken &&
          !["GET", "HEAD", "OPTIONS"].includes(method)
        ) {
          config.headers["X-CSRF-Token"] = currentCsrfToken;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && originalRequest) {
          const reqAny = originalRequest as any;
          // If we've already retried this request once, don't attempt again
          if (reqAny._retry) {
            return Promise.reject(error);
          }
          reqAny._retry = true;

          // Prevent multiple token refresh requests
          if (!this.refreshTokenPromise) {
            this.refreshTokenPromise = this.refreshAccessToken().catch(err => {
              // Clear local auth state and redirect to login, then rethrow
              this.clearAuth();
              if (typeof window !== "undefined") {
                try {
                  const currentPath = window.location.pathname || "";
                  // Only navigate to /login if we're not already there to avoid reload loops
                  if (!currentPath.startsWith("/login")) {
                    window.location.href = "/login";
                  }
                } catch (e) {
                  // fallback: do nothing
                }
              }
              throw err;
            });
          }

          try {
            await this.refreshTokenPromise;
            this.refreshTokenPromise = null;

            if (originalRequest.headers) {
              const csrfToken = this.getCsrfToken();
              if (csrfToken) {
                originalRequest.headers["X-CSRF-Token"] = csrfToken;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.refreshTokenPromise = null;
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Auth Methods
  private getCsrfToken(): string | null {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
      return token && token !== "undefined" && token !== "null" ? token : null;
    }
    return null;
  }

  setCsrfToken(csrfToken?: string | null) {
    if (typeof window !== "undefined") {
      if (csrfToken) {
        localStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, csrfToken);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
      }
    }
  }

  private clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESTAURANT);
    }
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>(
        "/auth/refresh",
        {},
      );

      const payload = response.data?.data ?? response.data;
      const { csrfToken } = payload as { csrfToken?: string };

      if (!csrfToken) {
        throw new Error("Invalid refresh token response");
      }

      this.setCsrfToken(csrfToken);
    } catch (error) {
      console.error("[auth] refreshAccessToken failed", {
        error,
        url: `${this.client.defaults.baseURL}/auth/refresh`,
        method: "POST",
        withCredentials: this.client.defaults.withCredentials,
        storedCsrfToken: this.getCsrfToken(),
      });
      throw error;
    }
  }

  private async bootstrapCsrfToken(): Promise<void> {
    if (this.csrfBootstrapPromise) {
      await this.csrfBootstrapPromise;
      return;
    }

    this.csrfBootstrapPromise = this.client
      .get<ApiResponse<AuthResponse>>("/auth/csrf")
      .then(response => {
        const payload = response.data?.data ?? response.data;
        const { csrfToken } = payload as { csrfToken?: string };
        if (csrfToken) {
          this.setCsrfToken(csrfToken);
        }
      })
      .catch(error => {
        console.error("[auth] bootstrapCsrfToken failed", {
          error,
          url: `${this.client.defaults.baseURL}/auth/csrf`,
          method: "GET",
          withCredentials: this.client.defaults.withCredentials,
        });
        throw error;
      })
      .finally(() => {
        this.csrfBootstrapPromise = null;
      });

    await this.csrfBootstrapPromise;
  }

  // Public Methods
  async get<T>(url: string, config = {}) {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      this.logRequestError("GET", url, error);
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.post<ApiResponse<T>>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      this.logRequestError("POST", url, error);
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      this.logRequestError("PUT", url, error);
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.patch<ApiResponse<T>>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      this.logRequestError("PATCH", url, error);
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config = {}) {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      this.logRequestError("DELETE", url, error);
      throw this.handleError(error);
    }
  }

  // File Upload
  async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, any>,
    options?: {
      timeoutMs?: number;
      onUploadProgress?: (
        progressPercent: number,
        event: AxiosProgressEvent,
      ) => void;
    },
  ) {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      // Uploads can be large (3D models). Allow a longer timeout for file uploads
      // and keep headers empty so axios sets multipart boundaries automatically.
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {},
        // 5 minutes for large file uploads; override per-call later if needed
        timeout: options?.timeoutMs ?? 5 * 60 * 1000,
        onUploadProgress: event => {
          const total = event.total ?? file.size;
          const progressPercent =
            total > 0 ? Math.round((event.loaded * 100) / total) : 0;
          options?.onUploadProgress?.(progressPercent, event);
        },
      });

      return response.data;
    } catch (error) {
      this.logRequestError("UPLOAD", url, error);
      throw this.handleError(error);
    }
  }

  // Error Handling
  private logRequestError(method: string, url: string, error: any) {
    if (typeof window === "undefined") return;

    const fullUrl = `${this.client.defaults.baseURL}${url}`;
    const payload = {
      method,
      url: fullUrl,
      withCredentials: this.client.defaults.withCredentials,
      storedCsrfToken: this.getCsrfToken(),
      error,
      responseStatus: error?.response?.status,
      responseData: error?.response?.data,
      responseHeaders: error?.response?.headers,
      requestHeaders: error?.config?.headers,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    };

    console.error("[auth] request failed", payload);
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        const networkMessage = error.message || ERROR_MESSAGES.NETWORK_ERROR;
        const err = new Error(networkMessage);
        (err as any).response = undefined;
        (err as any).code = error.code;
        return err;
      }

      const status = error.response?.status;
      const message = error.response?.data?.message;

      let errMessage = message || ERROR_MESSAGES.UNKNOWN_ERROR;

      switch (status) {
        case 400:
          errMessage = message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          errMessage = message || ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 429:
          errMessage =
            message || "Too many requests. Please wait a moment and try again.";
          break;
        case 403:
          errMessage = message || ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          errMessage = message || ERROR_MESSAGES.NOT_FOUND;
          break;
        case 409:
          errMessage = message || ERROR_MESSAGES.CONFLICT;
          break;
        case 500:
          errMessage = message || ERROR_MESSAGES.SERVER_ERROR;
          break;
      }

      const err = new Error(errMessage);
      // Preserve axios response for callers to inspect details
      (err as any).response = error.response;
      return err;
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}

export const apiClient = new ApiClient();
