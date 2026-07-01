"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/lib/constants";
import { User, LoginRequest, RegisterRequest } from "@/lib/types";

let authRequestPromise: Promise<void> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from backend session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (!authRequestPromise) {
          authRequestPromise = (async () => {
            const response = await apiClient.get<{ user: User }>(
              API_ENDPOINTS.AUTH_ME,
            );

            if (response?.data?.user) {
              localStorage.setItem(
                STORAGE_KEYS.USER,
                JSON.stringify(response.data.user),
              );
              setUser(response.data.user);
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem(STORAGE_KEYS.USER);
              localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
              setUser(null);
              setIsAuthenticated(false);
            }
          })().finally(() => {
            authRequestPromise = null;
          });
        }

        await authRequestPromise;
      } catch (err) {
        console.error("Failed to load user:", err);
        const status = (err as any)?.response?.status;
        if (status === 401) {
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

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
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
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
