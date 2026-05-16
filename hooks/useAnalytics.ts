import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ItemPopularityData,
  EngagementFunnelData,
  ARUsageData,
  CartAbandonmentData,
  SessionDurationData,
  SelectionPatternsData,
} from "@/lib/types";

interface AnalyticsSummary {
  totalQRScans: number;
  totalDishesVisited: number;
  total3DModelViews: number;
  totalOrders: number;
  totalAddToCartEvents: number;
  estimatedSales: string;
  avgOrderValue: string;
}

interface PopularityMetrics {
  mostPopularDish: {
    itemId: string;
    name: string;
    orders: number;
  } | null;
  leastPopularDish: {
    itemId: string;
    name: string;
    orders: number;
  } | null;
  topDishes: Array<{
    itemId: string;
    name: string;
    orders: number;
  }>;
  bottomDishes: Array<{
    itemId: string;
    name: string;
    orders: number;
  }>;
}

interface CustomerMetrics {
  newCustomers: number;
  repeatedCustomers: number;
  totalUniqueCustomers: number;
  conversionRate: number;
  uniqueSessionsThisMonth: number;
}

interface AnalyticsData {
  period: {
    month: string;
    year: number;
    startDate: string;
    endDate: string;
  };
  summary: AnalyticsSummary;
  popularity: PopularityMetrics;
  customers: CustomerMetrics;
  devices: {
    iOS: number;
    Android: number;
    Web: number;
  };
  trends: Array<{
    _id: {
      date: string;
    };
    scans: number;
    views: number;
    arViews: number;
    shares: number;
    total: number;
  }>;
  topItems: Array<{
    _id: string;
    name: string;
    views: number;
    arViews: number;
    clicks: number;
  }>;
  averageRating: string | null;
  itemPopularity?: ItemPopularityData;
  engagementFunnel?: EngagementFunnelData;
  engagement?: {
    menuUsersWhoAddedItems: number;
    totalMenuUsers: number;
    engagementRate: number;
  };
  arUsage?: ARUsageData & {
    usageRate: number;
    totalSessions: number;
    topARItems?: Array<{
      itemId: string;
      name: string;
      arViews: number;
    }>;
  };
  cartAbandonment?: CartAbandonmentData & {
    totalCartsCreated: number;
    abandonedCarts: number;
    avgAbandonedCartSize: number;
  };
  sessionDuration?: SessionDurationData;
  selectionPatterns?: SelectionPatternsData & {
    topCombos: Array<{
      rank: number;
      item1: string;
      item2: string;
      frequency: number;
      cartSessions: number;
      percentage: number;
    }>;
  };
}

interface SalesHeatmapData {
  meta: {
    timezone: string;
    rangeDays: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    dataCoveragePct: number;
  };
  peaks: {
    hour: { hourLabel: string };
    day: { day: string };
  };
  max: {
    cellRevenue: number;
  };
  hourOrder: Array<{ hour: number; hourLabel: string }>;
  heatmap: Array<{
    day: string;
    cells: Array<{
      hour: number;
      orders: number;
      revenue: number;
    }>;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

interface CategoryPerformanceData {
  meta: {
    rangeDays: number;
    startDate: string;
    endDate: string;
    viewSource: "events" | "menu-item-counters";
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalViews: number;
    totalQuantity: number;
    categoryCount: number;
    averageOrderValue: number;
    overallConversionRate: number;
  };
  insights: {
    topRevenueCategory: {
      category: string;
      revenue: number;
      conversionRate: number;
    } | null;
    bestConversionCategory: {
      category: string;
      revenue: number;
      conversionRate: number;
    } | null;
    weakestCategory: {
      category: string;
      revenue: number;
      conversionRate: number;
    } | null;
  };
  categories: Array<{
    rank: number;
    category: string;
    menuItemCount: number;
    orders: number;
    quantity: number;
    views: number;
    revenue: number;
    averageOrderValue: number;
    conversionRate: number;
  }>;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesHeatmap, setSalesHeatmap] = useState<SalesHeatmapData | null>(
    null,
  );
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapError, setHeatmapError] = useState<string | null>(null);
  const [categoryPerformance, setCategoryPerformance] =
    useState<CategoryPerformanceData | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const fetchComprehensiveAnalytics = useCallback(
    async (restaurantId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<any>(
          API_ENDPOINTS.ANALYTICS_COMPREHENSIVE(restaurantId),
        );

        const payload =
          response?.data?.data?.analytics ||
          response?.data?.data ||
          response?.data ||
          null;
        setData(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch analytics";
        setError(message);
        console.error("Analytics error:", err);
        setData(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchSalesHeatmap = useCallback(
    async (
      restaurantId: string,
      days: number = 30,
      timezone: string = "UTC",
    ) => {
      setHeatmapLoading(true);
      setHeatmapError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_SALES_HEATMAP(restaurantId)}?days=${days}&timezone=${encodeURIComponent(timezone)}`,
        );

        const payload = response?.data?.data || response?.data || null;
        setSalesHeatmap(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch sales heatmap";
        setHeatmapError(message);
        console.error("Sales heatmap error:", err);
        setSalesHeatmap(null);
        return null;
      } finally {
        setHeatmapLoading(false);
      }
    },
    [],
  );

  const fetchCategoryPerformance = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setCategoryLoading(true);
      setCategoryError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_CATEGORY_PERFORMANCE(restaurantId)}?days=${days}`,
        );

        const payload = response?.data?.data || response?.data || null;
        setCategoryPerformance(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch category performance";
        setCategoryError(message);
        console.error("Category performance error:", err);
        setCategoryPerformance(null);
        return null;
      } finally {
        setCategoryLoading(false);
      }
    },
    [],
  );

  // Item Popularity
  const [itemPopularity, setItemPopularity] =
    useState<ItemPopularityData | null>(null);
  const [itemPopularityLoading, setItemPopularityLoading] = useState(false);
  const [itemPopularityError, setItemPopularityError] = useState<string | null>(
    null,
  );

  // Engagement Funnel
  const [engagementFunnel, setEngagementFunnel] =
    useState<EngagementFunnelData | null>(null);
  const [engagementFunnelLoading, setEngagementFunnelLoading] = useState(false);
  const [engagementFunnelError, setEngagementFunnelError] = useState<
    string | null
  >(null);

  // AR Usage
  const [arUsage, setARUsage] = useState<ARUsageData | null>(null);
  const [arUsageLoading, setARUsageLoading] = useState(false);
  const [arUsageError, setARUsageError] = useState<string | null>(null);

  // Cart Abandonment
  const [cartAbandonment, setCartAbandonment] =
    useState<CartAbandonmentData | null>(null);
  const [cartAbandonmentLoading, setCartAbandonmentLoading] = useState(false);
  const [cartAbandonmentError, setCartAbandonmentError] = useState<
    string | null
  >(null);

  // Session Duration
  const [sessionDuration, setSessionDuration] =
    useState<SessionDurationData | null>(null);
  const [sessionDurationLoading, setSessionDurationLoading] = useState(false);
  const [sessionDurationError, setSessionDurationError] = useState<
    string | null
  >(null);

  // Selection Patterns
  const [selectionPatterns, setSelectionPatterns] =
    useState<SelectionPatternsData | null>(null);
  const [selectionPatternsLoading, setSelectionPatternsLoading] =
    useState(false);
  const [selectionPatternsError, setSelectionPatternsError] = useState<
    string | null
  >(null);

  const fetchItemPopularity = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setItemPopularityLoading(true);
      setItemPopularityError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_ITEM_POPULARITY(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setItemPopularity(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch item popularity";
        setItemPopularityError(message);
        console.error("Item popularity error:", err);
        setItemPopularity(null);
        return null;
      } finally {
        setItemPopularityLoading(false);
      }
    },
    [],
  );

  const fetchEngagementFunnel = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setEngagementFunnelLoading(true);
      setEngagementFunnelError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_ENGAGEMENT_FUNNEL(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setEngagementFunnel(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch engagement funnel";
        setEngagementFunnelError(message);
        console.error("Engagement funnel error:", err);
        setEngagementFunnel(null);
        return null;
      } finally {
        setEngagementFunnelLoading(false);
      }
    },
    [],
  );

  const fetchARUsage = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setARUsageLoading(true);
      setARUsageError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_AR_USAGE(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setARUsage(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch AR usage";
        setARUsageError(message);
        console.error("AR usage error:", err);
        setARUsage(null);
        return null;
      } finally {
        setARUsageLoading(false);
      }
    },
    [],
  );

  const fetchCartAbandonment = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setCartAbandonmentLoading(true);
      setCartAbandonmentError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_CART_ABANDONMENT(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setCartAbandonment(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch cart abandonment";
        setCartAbandonmentError(message);
        console.error("Cart abandonment error:", err);
        setCartAbandonment(null);
        return null;
      } finally {
        setCartAbandonmentLoading(false);
      }
    },
    [],
  );

  const fetchSessionDuration = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setSessionDurationLoading(true);
      setSessionDurationError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_SESSION_DURATION(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setSessionDuration(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch session duration";
        setSessionDurationError(message);
        console.error("Session duration error:", err);
        setSessionDuration(null);
        return null;
      } finally {
        setSessionDurationLoading(false);
      }
    },
    [],
  );

  const fetchSelectionPatterns = useCallback(
    async (restaurantId: string, days: number = 30) => {
      setSelectionPatternsLoading(true);
      setSelectionPatternsError(null);

      try {
        const response = await apiClient.get<any>(
          `${API_ENDPOINTS.ANALYTICS_SELECTION_PATTERNS(restaurantId)}?days=${days}`,
        );

        const payload = response?.data || null;
        setSelectionPatterns(payload);
        return payload;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch selection patterns";
        setSelectionPatternsError(message);
        console.error("Selection patterns error:", err);
        setSelectionPatterns(null);
        return null;
      } finally {
        setSelectionPatternsLoading(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    salesHeatmap,
    heatmapLoading,
    heatmapError,
    categoryPerformance,
    categoryLoading,
    categoryError,
    fetchComprehensiveAnalytics,
    fetchSalesHeatmap,
    fetchCategoryPerformance,

    // Item Popularity
    itemPopularity,
    itemPopularityLoading,
    itemPopularityError,
    fetchItemPopularity,

    // Engagement Funnel
    engagementFunnel,
    engagementFunnelLoading,
    engagementFunnelError,
    fetchEngagementFunnel,

    // AR Usage
    arUsage,
    arUsageLoading,
    arUsageError,
    fetchARUsage,

    // Cart Abandonment
    cartAbandonment,
    cartAbandonmentLoading,
    cartAbandonmentError,
    fetchCartAbandonment,

    // Session Duration
    sessionDuration,
    sessionDurationLoading,
    sessionDurationError,
    fetchSessionDuration,

    // Selection Patterns
    selectionPatterns,
    selectionPatternsLoading,
    selectionPatternsError,
    fetchSelectionPatterns,
  };
}
