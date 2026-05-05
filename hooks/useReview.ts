"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Review, CreateReviewRequest, UpdateReviewRequest } from "@/lib/types";

export function useReview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reviews for a menu item
  const fetchReviews = useCallback(async (menuItemId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useReview] Fetching reviews for menu item:", menuItemId);

      const response = await apiClient.get<any>(`/reviews/menu/${menuItemId}`);

      console.log("[useReview] Fetch response:", response);

      // Handle response: {success, message, data: {reviews, count}} or {success, message, data: []?}
      const reviewsData = response?.data?.reviews || response?.data || [];

      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
        return reviewsData;
      }

      console.warn("[useReview] Unexpected reviews structure:", reviewsData);
      return [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch reviews";
      console.error("[useReview] Fetch error:", err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all reviews for a restaurant
  const fetchRestaurantReviews = useCallback(async (restaurantId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useReview] Fetching reviews for restaurant:", restaurantId);

      const response = await apiClient.get<any>(
        `/reviews/restaurant/${restaurantId}`,
      );

      console.log("[useReview] Fetch restaurant reviews response:", response);

      const reviewsData = response?.data?.reviews || response?.data || [];

      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
        return reviewsData;
      }

      return [];
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch restaurant reviews";
      console.error("[useReview] Fetch restaurant reviews error:", err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new review
  const createReview = useCallback(async (data: CreateReviewRequest) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useReview] Creating review:", data);

      const response = await apiClient.post<any>("/reviews", data);

      console.log("[useReview] Create response:", response);

      const review = response?.data?.review || response?.data;

      if (review) {
        setReviews(prev => [...prev, review]);
        return { success: true, data: review };
      } else {
        return { success: false, error: "No review data in response" };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create review";
      console.error("[useReview] Create error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a review
  const updateReview = useCallback(
    async (reviewId: string, data: UpdateReviewRequest) => {
      try {
        setLoading(true);
        setError(null);

        console.log("[useReview] Updating review:", reviewId, data);

        const response = await apiClient.put<any>(`/reviews/${reviewId}`, data);

        console.log("[useReview] Update response:", response);

        const updatedReview = response?.data?.review || response?.data;

        if (updatedReview) {
          setReviews(prev =>
            prev.map(review =>
              review._id === reviewId ? updatedReview : review,
            ),
          );
          return { success: true, data: updatedReview };
        } else {
          return { success: false, error: "No review data in response" };
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update review";
        console.error("[useReview] Update error:", err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a review
  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useReview] Deleting review:", reviewId);

      await apiClient.delete(`/reviews/${reviewId}`);

      setReviews(prev => prev.filter(review => review._id !== reviewId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete review";
      console.error("[useReview] Delete error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useReview] Marking review as helpful:", reviewId);

      const response = await apiClient.post<any>(
        `/reviews/${reviewId}/helpful`,
        {},
      );

      const updatedReview = response?.data?.review || response?.data;

      if (updatedReview) {
        setReviews(prev =>
          prev.map(review =>
            review._id === reviewId ? updatedReview : review,
          ),
        );
        return { success: true, data: updatedReview };
      } else {
        return { success: false, error: "Failed to mark review as helpful" };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to mark review as helpful";
      console.error("[useReview] Mark helpful error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    fetchRestaurantReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    clearError,
  };
}
