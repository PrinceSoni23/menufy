import axios, { AxiosInstance, AxiosError, AxiosProgressEvent } from "axios";
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from "./constants";
import { ApiResponse, AuthResponse } from "./types";

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Handle FormData - remove default Content-Type so axios can set proper multipart boundary
        if (config.data instanceof FormData) {
          if (config.headers) {
            delete (config.headers as any)["Content-Type"];
            delete (config.headers as any)["content-type"];
          }
        }

        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
          // Prevent multiple token refresh requests
          if (!this.refreshTokenPromise) {
            this.refreshTokenPromise = this.refreshAccessToken().catch(() => {
              this.clearAuth();
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              return "";
            });
          }

          try {
            const newToken = await this.refreshTokenPromise;
            this.refreshTokenPromise = null;

            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
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
  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  private clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESTAURANT);
    }
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.client.post<AuthResponse>(
      "/auth/refresh-token",
      {
        refreshToken,
      },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    this.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  // Public Methods
  async get<T>(url: string, config = {}) {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
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
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config = {}) {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
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
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config = {}) {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
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
      throw this.handleError(error);
    }
  }

  // Error Handling
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
