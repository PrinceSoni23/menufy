"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/lib/constants";
import { User, LoginRequest, RegisterRequest } from "@/lib/types";

let authRequestPromise: Promise<void> | null = null;
let authRequestAttempts = 0;
const MAX_AUTH_RETRIES = 3;
const PUBLIC_AUTH_PATHS = ["/login", "/register", "/forgot-password"];

function shouldSkipAuthBootstrap(pathname?: string | null): boolean {
  if (!pathname) {
    if (typeof window === "undefined") return false;
    pathname = window.location.pathname;
  }

  return PUBLIC_AUTH_PATHS.some(
    path => pathname === path || pathname?.startsWith(`${path}/`),
  );
}

// Retry with exponential backoff
async function fetchUserWithRetry(
  maxRetries = MAX_AUTH_RETRIES,
): Promise<{ user: User } | null> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      authRequestAttempts++;
      const response = await apiClient.get<{ user: User }>(
        API_ENDPOINTS.AUTH_ME,
      );
      return response?.data ?? null;
    } catch (err) {
      lastError = err;
      const status = (err as any)?.response?.status;

      // Don't retry on 401 (not authenticated) or 403 (forbidden)
      if (status === 401 || status === 403) {
        throw err;
      }

      // For rate limits (429) or network errors, retry with backoff
      if (status === 429 || !status) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Other errors, throw immediately
      throw err;
    }
  }

  throw lastError;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMountedRef = useRef(true);
  const pathname = usePathname();

  // Load user from backend session on mount
  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        if (shouldSkipAuthBootstrap(pathname)) {
          if (!cancelled) {
            setLoading(false);
            setError(null);
          }
          return;
        }

        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedUser && !cancelled) {
          setUser(JSON.parse(storedUser));
        }

        // Use global promise to deduplicate across all useAuth instances
        if (!authRequestPromise) {
          authRequestPromise = (async () => {
            try {
              const result = await fetchUserWithRetry();

              if (!cancelled) {
                if (result?.user) {
                  localStorage.setItem(
                    STORAGE_KEYS.USER,
                    JSON.stringify(result.user),
                  );
                  setUser(result.user);
                  setIsAuthenticated(true);
                } else {
                  localStorage.removeItem(STORAGE_KEYS.USER);
                  localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            } catch (err) {
              if (!cancelled) {
                console.error("Failed to load user:", err);
                const status = (err as any)?.response?.status;
                if (status === 401 || status === 403) {
                  localStorage.removeItem(STORAGE_KEYS.USER);
                  localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
                  setUser(null);
                  setIsAuthenticated(false);
                }
              }
            }
          })().finally(() => {
            authRequestPromise = null;
            authRequestAttempts = 0;
          });
        }

        await authRequestPromise;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (isMountedRef.current) {
      loadUser();
    }

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH_REGISTER,
        data,
      );

      if (response?.data && response?.data.user) {
        const { user, csrfToken } = response.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        apiClient.setCsrfToken(csrfToken);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        setError("Invalid response from server");
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      console.error("Register error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH_LOGIN,
        data,
      );

      if (response?.data && response?.data.user) {
        const { user, csrfToken } = response.data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        apiClient.setCsrfToken(csrfToken);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        setError("Invalid response from server");
        return { success: false, error: "Invalid response from server" };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      console.error("Login error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESTAURANT);

      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);

      // Reset global state
      authRequestPromise = null;
      authRequestAttempts = 0;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
  };
}
