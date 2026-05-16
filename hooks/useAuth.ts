"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, STORAGE_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        const tokenIsValid =
          storedToken && storedToken !== "undefined" && storedToken !== "null";

        if (storedUser && tokenIsValid) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (storedUser || storedToken) {
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        // Clear corrupted auth data
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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

      // response is {success, message, data: {user, accessToken, refreshToken}}
      if (response?.data && response?.data.user && response?.data.accessToken) {
        const { user, accessToken, refreshToken } = response.data;
        if (!accessToken || !refreshToken) {
          throw new Error("Invalid auth response from server");
        }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
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

      // response is {success, message, data: {user, accessToken, refreshToken}}
      if (response?.data && response?.data.user && response?.data.accessToken) {
        const { user, accessToken, refreshToken } = response.data;
        if (!accessToken || !refreshToken) {
          throw new Error("Invalid auth response from server");
        }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
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
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
