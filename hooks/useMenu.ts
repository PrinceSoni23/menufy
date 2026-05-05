"use client";

import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { MenuItem, CreateMenuItemRequest } from "@/lib/types";
import { retryWithBackoff } from "@/lib/error-handling";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useMenu(restaurantId: string | null = null) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMenuItems = useCallback(
    async (targetRestaurantId?: string) => {
      const rId = targetRestaurantId || restaurantId;
      if (!rId) {
        console.warn("No restaurant ID provided to fetchMenuItems");
        return [];
      }

      // Abort previous request if it's still in progress
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await retryWithBackoff(
          () => apiClient.get<any>(`/menu/restaurant/${rId}`),
          {
            maxRetries: 2,
            initialDelayMs: 500,
          },
        );

        const menuItems = response?.data?.menuItems || response?.data || [];

        if (Array.isArray(menuItems)) {
          setMenuItems(menuItems);
          return menuItems;
        }

        console.warn("Unexpected menuItems structure:", menuItems);
        return [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch menu items";
        console.error("fetchMenuItems error:", err);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [restaurantId],
  );

  // Fetch a single menu item by ID
  const fetchMenuItemById = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await retryWithBackoff(
        () => apiClient.get<any>(`/menu/${itemId}`),
        {
          maxRetries: 2,
          initialDelayMs: 500,
        },
      );

      const menuItem = response?.data;

      if (menuItem) {
        return menuItem;
      }

      console.warn("Unexpected menu item structure:", response);
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch menu item";
      console.error("fetchMenuItemById error:", err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenuItem = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error("Menu item name is required");
      }
      if (!data.restaurantId) {
        throw new Error("Restaurant ID is required");
      }
      if (typeof data.price !== "number" || data.price <= 0) {
        throw new Error("Valid price is required");
      }

      const menuItemData: CreateMenuItemRequest = {
        name: data.name.trim(),
        description: (data.description || "").trim(),
        price: parseFloat(String(data.price || 0)),
        category: data.category || "Other",
        restaurantId: data.restaurantId,
        imageUrl2D: data.image || "/uploads/placeholder.png",
        arEnabled: true,
        scaling: 1,
      };

      const response = await apiClient.post<any>("/menu", menuItemData);

      const menuItem = response?.data?.menuItem || response?.data;

      if (menuItem) {
        setMenuItems(prev => [...prev, menuItem]);
        return { success: true, data: menuItem };
      } else {
        return { success: false, error: "No menu item data in response" };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create menu item";
      console.error("Create menu item error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMenuItem = useCallback(
    async (
      menuItemId: string,
      data: Partial<CreateMenuItemRequest>,
      targetRestaurantId?: string,
    ) => {
      if (!menuItemId) {
        throw new Error("Menu item ID is required");
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.put<MenuItem>(
          `/menu/${menuItemId}`,
          data,
        );
        if (response.data) {
          setMenuItems(prev =>
            prev.map(item =>
              item._id === menuItemId ? (response.data as MenuItem) : item,
            ),
          );
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update menu item";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteMenuItem = useCallback(
    async (menuItemId: string, targetRestaurantId?: string) => {
      if (!menuItemId) {
        throw new Error("Menu item ID is required");
      }

      try {
        setLoading(true);
        setError(null);
        await apiClient.delete(`/menu/${menuItemId}`);
        setMenuItems(prev => prev.filter(item => item._id !== menuItemId));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete menu item";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const uploadImage = useCallback(
    async (file: File, restaurantId: string, menuItemId: string) => {
      try {
        // Validate file
        if (!file) {
          throw new Error("File is required");
        }

        if (file.size > 50 * 1024 * 1024) {
          throw new Error("File size must not exceed 50MB");
        }

        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          throw new Error(
            "Invalid file type. Supported types: JPEG, PNG, WebP, GIF",
          );
        }

        setLoading(true);
        setError(null);

        const response = await apiClient.uploadFile<any>(
          `/upload/menu-item/${restaurantId}/${menuItemId}`,
          file,
          "image",
        );

        const responseData = response?.data as any;
        const imageUrl = responseData?.imageUrl || "";

        if (!imageUrl) {
          console.warn("No imageUrl in response:", response);
          return { success: false, error: "No image URL returned from server" };
        }

        return { success: true, url: imageUrl };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to upload image";
        console.error("Upload error:", err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const retryConversion = useCallback(async (menuItemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<any>(
        `/upload/retry-conversion/${menuItemId}`,
      );

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to retry conversion";
      console.error("retryConversion error:", err);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cancelPendingRequests = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    fetchMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    uploadImage,
    retryConversion,
    clearError,
  };
}
