"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/lib/constants";
import { Restaurant, CreateRestaurantRequest, QRCode } from "@/lib/types";

export function useRestaurant() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<any>(API_ENDPOINTS.RESTAURANTS);
      // Response.data is now the array directly
      const data = Array.isArray(response.data)
        ? response.data
        : response.data || [];
      setRestaurants(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch restaurants";
      setError(errorMessage);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRestaurant = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<Restaurant>(
        API_ENDPOINTS.RESTAURANT_DETAIL(id),
      );
      // Response.data is now the restaurant object directly
      if (response.data) {
        setCurrentRestaurant(response.data);
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_RESTAURANT,
          JSON.stringify(response.data),
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch restaurant";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRestaurant = useCallback(
    async (data: CreateRestaurantRequest) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.post<any>(
          API_ENDPOINTS.RESTAURANTS,
          data,
        );

        // Response.data is now the restaurant object directly
        const restaurantData = response.data;

        if (restaurantData) {
          setRestaurants(prev => [...prev, restaurantData]);
          setCurrentRestaurant(restaurantData);
          localStorage.setItem(
            STORAGE_KEYS.CURRENT_RESTAURANT,
            JSON.stringify(restaurantData),
          );
        }
        return { success: true, data: restaurantData };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create restaurant";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateRestaurant = useCallback(
    async (id: string, data: Partial<CreateRestaurantRequest>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.put<Restaurant>(
          API_ENDPOINTS.RESTAURANT_DETAIL(id),
          data,
        );
        if (response.data) {
          setRestaurants(prev =>
            prev.map(r => (r._id === id ? (response.data as Restaurant) : r)),
          );
          setCurrentRestaurant(response.data as Restaurant);
          localStorage.setItem(
            STORAGE_KEYS.CURRENT_RESTAURANT,
            JSON.stringify(response.data),
          );
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update restaurant";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteRestaurant = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiClient.delete(API_ENDPOINTS.RESTAURANT_DETAIL(id));
        setRestaurants(prev => prev.filter(r => r._id !== id));
        if (currentRestaurant?._id === id) {
          setCurrentRestaurant(null);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_RESTAURANT);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete restaurant";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentRestaurant?._id],
  );

  const fetchQRCode = useCallback(async (restaurantId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<QRCode>(
        API_ENDPOINTS.QR_GET(restaurantId),
      );
      if (response.data) {
        setQrCode(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch QR code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    restaurants,
    currentRestaurant,
    qrCode,
    loading,
    error,
    fetchRestaurants,
    fetchRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    fetchQRCode,
    clearError,
  };
}
