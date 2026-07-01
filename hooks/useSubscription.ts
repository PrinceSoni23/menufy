"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  SubscriptionStatusData,
  Plan,
  GatewayInfo,
  CreateOrderResponse,
  Invoice,
  PlanId,
  GatewayId,
} from "@/lib/types";

interface UseSubscriptionReturn {
  // State
  status: SubscriptionStatusData | null;
  plans: Plan[];
  gateways: GatewayInfo[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStatus: () => Promise<SubscriptionStatusData | null>;
  fetchPlans: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  createOrder: (
    planId: PlanId,
    gateway: GatewayId,
    isRecurring: boolean,
  ) => Promise<CreateOrderResponse>;
  verifyPayment: (params: {
    gateway: GatewayId;
    orderId: string;
    paymentId: string;
    signature?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<{ invoiceNumber: string; planId: string; expiresAt: string }>;
  cancelSubscription: (reason?: string) => Promise<void>;
  toggleAutoRenew: (autoRenew: boolean) => Promise<void>;

  // Derived state
  isActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
}

export function useSubscription(): UseSubscriptionReturn {
  const [status, setStatus] = useState<SubscriptionStatusData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [gateways, setGateways] = useState<GatewayInfo[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus =
    useCallback(async (): Promise<SubscriptionStatusData | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await apiClient.get<SubscriptionStatusData>(
          API_ENDPOINTS.SUBSCRIPTION_STATUS,
        );
        if (res.data) {
          setStatus(res.data);
          return res.data;
        }
        return null;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to fetch subscription status";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await apiClient.get<{
        plans: Plan[];
        gateways: GatewayInfo[];
      }>(API_ENDPOINTS.SUBSCRIPTION_PLANS);
      if (res.data) {
        setPlans(res.data.plans);
        setGateways(res.data.gateways);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch plans";
      setError(msg);
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await apiClient.get<{ invoices: Invoice[] }>(
        API_ENDPOINTS.SUBSCRIPTION_INVOICES,
      );
      if (res.data) setInvoices(res.data.invoices);
    } catch {
      // Non-critical
    }
  }, []);

  const createOrder = useCallback(
    async (
      planId: PlanId,
      gateway: GatewayId,
      isRecurring: boolean,
    ): Promise<CreateOrderResponse> => {
      const res = await apiClient.post<CreateOrderResponse>(
        API_ENDPOINTS.SUBSCRIPTION_CREATE_ORDER,
        { planId, gateway, isRecurring },
      );
      if (!res.data) throw new Error("Failed to create order");
      return res.data;
    },
    [],
  );

  const verifyPayment = useCallback(
    async (params: {
      gateway: GatewayId;
      orderId: string;
      paymentId: string;
      signature?: string;
      metadata?: Record<string, unknown>;
    }) => {
      const res = await apiClient.post<{
        invoiceNumber: string;
        planId: string;
        expiresAt: string;
      }>(API_ENDPOINTS.SUBSCRIPTION_VERIFY_PAYMENT, params);
      if (!res.data) throw new Error("Payment verification failed");
      // Refresh subscription status after successful payment
      await fetchStatus();
      return res.data;
    },
    [fetchStatus],
  );

  const cancelSubscription = useCallback(
    async (reason?: string) => {
      await apiClient.post(API_ENDPOINTS.SUBSCRIPTION_CANCEL, { reason });
      await fetchStatus();
    },
    [fetchStatus],
  );

  const toggleAutoRenew = useCallback(
    async (autoRenew: boolean) => {
      await apiClient.post(API_ENDPOINTS.SUBSCRIPTION_TOGGLE_AUTORENEW, {
        autoRenew,
      });
      await fetchStatus();
    },
    [fetchStatus],
  );

  const isActive = status?.subscriptionStatus === "active";
  const isExpired =
    status?.subscriptionStatus === "expired" ||
    status?.subscriptionStatus === "cancelled";

  const daysRemaining = status?.subscriptionEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(status.subscriptionEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    status,
    plans,
    gateways,
    invoices,
    isLoading,
    error,
    fetchStatus,
    fetchPlans,
    fetchInvoices,
    createOrder,
    verifyPayment,
    cancelSubscription,
    toggleAutoRenew,
    isActive,
    isExpired,
    daysRemaining,
  };
}
