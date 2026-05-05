"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { QRCode } from "@/lib/types";

export function useQRCode() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch QR code for a restaurant
  const fetchQRCode = useCallback(async (restaurantId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useQRCode] Fetching QR code for restaurant:", restaurantId);

      const response = await apiClient.get<any>(`/qrcode/${restaurantId}`);

      console.log("[useQRCode] Fetch response:", response);

      // Handle response: {success, message, data: qrCode}
      const qrCode = response?.data?.qrCode || response?.data;

      if (qrCode) {
        setQRCodes([qrCode]);
        return qrCode;
      }

      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch QR code";
      console.error("[useQRCode] Fetch error:", err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all QR codes for a user
  const fetchAllQRCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useQRCode] Fetching all QR codes");

      const response = await apiClient.get<any>("/qrcode");

      console.log("[useQRCode] Fetch all response:", response);

      // Handle response: {success, message, data: {qrCodes, count}} or array
      const qrCodesData = response?.data?.qrCodes || response?.data || [];

      if (Array.isArray(qrCodesData)) {
        setQRCodes(qrCodesData);
        return qrCodesData;
      }

      console.warn("[useQRCode] Unexpected QR codes structure:", qrCodesData);
      return [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch QR codes";
      console.error("[useQRCode] Fetch all error:", err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate or regenerate QR code for a restaurant
  const generateQRCode = useCallback(async (restaurantId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "[useQRCode] Generating QR code for restaurant:",
        restaurantId,
      );

      const response = await apiClient.post<any>(
        `/qrcode/restaurant/${restaurantId}/generate`,
        {},
      );

      console.log("[useQRCode] Generate response:", response);

      const qrCode = response?.data?.qrCode || response?.data;

      if (qrCode) {
        setQRCodes(prev => {
          const exists = prev.findIndex(q => q.restaurantId === restaurantId);
          if (exists >= 0) {
            const updated = [...prev];
            updated[exists] = qrCode;
            return updated;
          }
          return [...prev, qrCode];
        });
        return { success: true, data: qrCode };
      } else {
        return { success: false, error: "No QR code data in response" };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate QR code";
      console.error("[useQRCode] Generate error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete QR code
  const deleteQRCode = useCallback(async (qrCodeId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useQRCode] Deleting QR code:", qrCodeId);

      await apiClient.delete(`/qrcode/${qrCodeId}`);

      setQRCodes(prev => prev.filter(qr => qr._id !== qrCodeId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete QR code";
      console.error("[useQRCode] Delete error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get QR code analytics
  const getQRCodeAnalytics = useCallback(async (qrCodeId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useQRCode] Fetching QR code analytics:", qrCodeId);

      const response = await apiClient.get<any>(
        `/qrcode/${qrCodeId}/analytics`,
      );

      console.log("[useQRCode] Analytics response:", response);

      const analytics = response?.data?.analytics || response?.data;

      return { success: true, data: analytics };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch QR code analytics";
      console.error("[useQRCode] Analytics error:", err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Download QR code as image
  const downloadQRCode = useCallback(
    async (qrCodeId: string, format: "png" | "svg" = "png") => {
      try {
        console.log("[useQRCode] Downloading QR code:", qrCodeId, format);

        const response = await apiClient.get(
          `/qrcode/${qrCodeId}/download?format=${format}`,
          {
            responseType: "blob",
          },
        );

        // Create a blob URL and download
        const url = window.URL.createObjectURL(response.data as Blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-code-${qrCodeId}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to download QR code";
        console.error("[useQRCode] Download error:", err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    qrCodes,
    loading,
    error,
    fetchQRCode,
    fetchAllQRCodes,
    generateQRCode,
    deleteQRCode,
    getQRCodeAnalytics,
    downloadQRCode,
    clearError,
  };
}
