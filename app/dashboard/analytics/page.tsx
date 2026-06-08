"use client";

import { useCallback, useEffect, useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import { AnalyticsRange, useAnalytics } from "@/hooks/useAnalytics";
import NeoAnalyticsDashboard from "../../../components/analytics/NeoAnalyticsDashboard";

export default function AnalyticsPage() {
  const { restaurants, fetchRestaurants } = useRestaurant();
  const {
    dashboardAnalytics,
    dashboardLoading,
    dashboardError: analyticsError,
    fetchDashboardAnalytics,
  } = useAnalytics();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [selectedRange, setSelectedRange] = useState<AnalyticsRange>("all");
  const [pageLoading, setPageLoading] = useState(true);

  const rangeLabels: Record<AnalyticsRange, string> = {
    "24h": "Last 24 hours",
    "7d": "Past week",
    "30d": "Past month",
    all: "All time",
  };

  const loadRestaurantAnalytics = useCallback(
    async (restaurantId: string, range: AnalyticsRange) => {
      setSelectedRestaurantId(restaurantId);
      await fetchDashboardAnalytics(restaurantId, range, "UTC");
    },
    [fetchDashboardAnalytics],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchRestaurants();
      } catch (error) {
        console.error("Failed to load restaurants:", error);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [fetchRestaurants]);

  useEffect(() => {
    const hasRestaurants = Array.isArray(restaurants) && restaurants.length > 0;
    if (hasRestaurants && !selectedRestaurantId) {
      loadRestaurantAnalytics(restaurants[0]._id, selectedRange);
    }
  }, [
    restaurants,
    selectedRestaurantId,
    loadRestaurantAnalytics,
    selectedRange,
  ]);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadRestaurantAnalytics(selectedRestaurantId, selectedRange);
    }
  }, [selectedRange, selectedRestaurantId, loadRestaurantAnalytics]);

  const handleRestaurantChange = (restaurantId: string) => {
    loadRestaurantAnalytics(restaurantId, selectedRange);
  };

  const handleRangeChange = (range: AnalyticsRange) => {
    setSelectedRange(range);
  };

  const analyticsData = dashboardAnalytics?.analytics ?? null;
  const itemPopularity = dashboardAnalytics?.itemPopularity ?? null;
  const engagementFunnel = dashboardAnalytics?.engagementFunnel ?? null;
  const arUsage = dashboardAnalytics?.arUsage ?? null;
  const cartAbandonment = dashboardAnalytics?.cartAbandonment ?? null;
  const sessionDuration = dashboardAnalytics?.sessionDuration ?? null;
  const selectionPatterns = dashboardAnalytics?.selectionPatterns ?? null;
  const salesHeatmap = dashboardAnalytics?.salesHeatmap ?? null;
  const categoryPerformance = dashboardAnalytics?.categoryPerformance ?? null;
  const loading = pageLoading || dashboardLoading;

  if (!pageLoading && restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-4xl border border-slate-200 bg-white/80 p-10 text-center shadow-[0_30px_80px_rgba(148,163,184,0.25)]">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Analytics
          </p>
          <h2 className="mt-3 text-3xl font-bold">No restaurants yet</h2>
          <p className="mt-3 text-sm text-slate-600">
            Add a location to unlock real-time analytics insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <NeoAnalyticsDashboard
      restaurants={restaurants}
      selectedRestaurantId={selectedRestaurantId}
      onRestaurantChange={handleRestaurantChange}
      rangeLabels={rangeLabels}
      selectedRange={selectedRange}
      onRangeChange={handleRangeChange}
      loading={loading}
      analyticsError={analyticsError}
      analyticsData={analyticsData}
      itemPopularity={itemPopularity}
      engagementFunnel={engagementFunnel}
      arUsage={arUsage}
      cartAbandonment={cartAbandonment}
      sessionDuration={sessionDuration}
      selectionPatterns={selectionPatterns}
      salesHeatmap={salesHeatmap}
      categoryPerformance={categoryPerformance}
    />
  );
}
