"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useMenu } from "@/hooks/useMenu";

// Import DashboardSummary from types instead of defining locally
import { DashboardSummary } from "@/lib/types";

export default function DashboardPage() {
  const { restaurants, fetchRestaurants } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [hasSummary, setHasSummary] = useState(false);
  const [stats, setStats] = useState<DashboardSummary>({
    totalRestaurants: 0,
    totalMenuItems: 0,
    totalQRScans: 0,
    totalModelViews: 0,
    modelViewsTrend: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantLoad = fetchRestaurants();
        const summaryResponse = await apiClient.get<DashboardSummary>(
          API_ENDPOINTS.RESTAURANTS_SUMMARY,
        );

        if (summaryResponse.data) {
          setStats(summaryResponse.data);
          setHasSummary(true);
        }

        await restaurantLoad;
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    };
    loadData();
  }, [fetchRestaurants]);

  useEffect(() => {
    if (hasSummary) {
      return;
    }

    const restaurantArray = Array.isArray(restaurants) ? restaurants : [];
    setStats({
      totalRestaurants: restaurantArray.length,
      totalMenuItems: restaurantArray.reduce(
        (sum, r) => sum + (r.totalMenuItems || 0),
        0,
      ),
      totalQRScans: restaurantArray.reduce(
        (sum, r) => sum + (r.totalScans || 0),
        0,
      ),
      totalModelViews: restaurantArray.reduce(
        (sum, r) => sum + (r.totalViews || 0),
        0,
      ),
      modelViewsTrend: 0,
    });
  }, [restaurants, hasSummary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-black">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-white/90 border-black/10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">
          Operator Briefing
        </p>
        <h2 className="text-4xl hero-title font-bold text-black mt-2 mb-2">
          Welcome Back
        </h2>
        <p className="text-base leading-7 text-black max-w-3xl">
          Real-time snapshot of your restaurant network performance, content
          readiness, and guest engagement momentum.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white/90 border-black/10 hover:shadow-lg hover:shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm mb-1 uppercase tracking-[0.14em]">
                Restaurants
              </p>
              <p className="text-4xl font-bold text-orange-600">
                {stats.totalRestaurants}
              </p>
            </div>
            <span className="text-xs rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-cyan-700 uppercase tracking-[0.12em]">
              RS
            </span>
          </div>
          <p className="text-xs text-black/70 mt-4">Active restaurants</p>
        </div>

        <div className="card bg-white/90 border-black/10 hover:shadow-lg hover:shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm mb-1 uppercase tracking-[0.14em]">
                Menu Items
              </p>
              <p className="text-4xl font-bold text-amber-600">
                {stats.totalMenuItems}
              </p>
            </div>
            <span className="text-xs rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-cyan-700 uppercase tracking-[0.12em]">
              MN
            </span>
          </div>
          <p className="text-xs text-black/70 mt-4">Total dishes</p>
        </div>

        <div className="card bg-white/90 border-black/10 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm mb-1 uppercase tracking-[0.14em]">
                QR Scans
              </p>
              <p className="text-4xl font-bold text-teal-600">
                {stats.totalQRScans}
              </p>
            </div>
            <span className="text-xs rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-cyan-700 uppercase tracking-[0.12em]">
              QR
            </span>
          </div>
          <p className="text-xs text-black/70 mt-4">This month</p>
        </div>

        <div className="card bg-white/90 border-black/10 hover:shadow-lg hover:shadow-green-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm mb-1 uppercase tracking-[0.14em]">
                Total Model Views
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-lime-600">
                  {stats.totalModelViews}
                </p>
                {stats.modelViewsTrend !== 0 && (
                  <span
                    className={`text-sm font-semibold ${
                      stats.modelViewsTrend > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.modelViewsTrend > 0 ? "↑" : "↓"}{" "}
                    {Math.abs(stats.modelViewsTrend)}%
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-cyan-700 uppercase tracking-[0.12em]">
              3D
            </span>
          </div>
          <p className="text-xs text-black/70 mt-4">Model views this month</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white/90 border-black/10">
          <h3 className="text-xl font-bold text-black mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/restaurants/create"
              className="btn-primary block text-center w-full"
            >
              Add Restaurant
            </Link>
            <Link
              href="/dashboard/menu"
              className="btn-secondary block text-center w-full"
            >
              Add Menu Item
            </Link>
          </div>
        </div>

        <div className="card bg-white/90 border-black/10">
          <h3 className="text-xl font-bold text-black mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm text-black/70">
            <p>{stats.totalMenuItems} menu items currently active</p>
            <p>{stats.totalQRScans} total QR interactions tracked</p>
            <p>{stats.totalModelViews} total model views tracked</p>
          </div>
        </div>
      </div>

      {/* Restaurants Overview */}
      <div className="card bg-white/90 border-black/10">
        <h3 className="text-xl font-bold text-black mb-4">Your Restaurants</h3>
        {(Array.isArray(restaurants) ? restaurants : []).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-black/80 mb-4">No restaurants yet</p>
            <Link
              href="/dashboard/restaurants/create"
              className="btn-primary inline-block"
            >
              Create Your First Restaurant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Array.isArray(restaurants) ? restaurants : [])
              .slice(0, 4)
              .map(restaurant => (
                <Link
                  key={restaurant._id}
                  href={`/dashboard/restaurants/${restaurant._id}`}
                  className="p-4 bg-white border border-black/10 rounded-lg hover:bg-black/[0.02] transition-colors"
                >
                  <h4 className="font-semibold text-black">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-black/80">{restaurant.cuisine}</p>
                  <p className="text-xs text-black/70 mt-2">
                    {restaurant.stats?.qrScans || 0} scans
                  </p>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
