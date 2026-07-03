"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useRestaurant } from "@/hooks/useRestaurant";
import { DashboardSummary } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import { DashboardLoader } from "@/components/common/DashboardLoader";
import {
  ArrowRight,
  BarChart3,
  Box,
  ChefHat,
  Clock3,
  Eye,
  Grip,
  LayoutGrid,
  Plus,
  QrCode,
  Sparkles,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const metricCards = [
  {
    key: "totalRestaurants",
    label: "Restaurants",
    description: "Active restaurants",
    icon: Store,
    accent: "from-violet-500 to-indigo-500",
    chip: "RS",
  },
  {
    key: "totalMenuItems",
    label: "Menu Items",
    description: "Total dishes",
    icon: UtensilsCrossed,
    accent: "from-amber-500 to-orange-500",
    chip: "MN",
  },
  {
    key: "totalQRScans",
    label: "QR Scans",
    description: "This month",
    icon: QrCode,
    accent: "from-emerald-500 to-teal-500",
    chip: "QR",
  },
  {
    key: "totalModelViews",
    label: "Total Model Views",
    description: "Model views this month",
    icon: Box,
    accent: "from-sky-500 to-blue-500",
    chip: "3D",
  },
] as const;

export default function DashboardPage() {
  const { restaurants, fetchRestaurants } = useRestaurant();
  const {
    status: subscriptionStatus,
    fetchStatus,
    isLoading: subLoading,
  } = useSubscription();
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
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    // Wait until subscription status is known before attempting data load
    if (subscriptionStatus === null) return;

    // If not active, stop loading — layout gate will show the expired screen
    if (subscriptionStatus.subscriptionStatus !== "active") {
      setLoading(false);
      return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionStatus]);

  useEffect(() => {
    if (hasSummary) return;

    const restaurantArray = Array.isArray(restaurants) ? restaurants : [];
    setStats({
      totalRestaurants: restaurantArray.length,
      totalMenuItems: restaurantArray.reduce(
        (sum, restaurant) => sum + (restaurant.totalMenuItems || 0),
        0,
      ),
      totalQRScans: restaurantArray.reduce(
        (sum, restaurant) => sum + (restaurant.totalScans || 0),
        0,
      ),
      totalModelViews: restaurantArray.reduce(
        (sum, restaurant) => sum + (restaurant.totalViews || 0),
        0,
      ),
      modelViewsTrend: 0,
    });
  }, [restaurants, hasSummary]);

  // Subscription gate is handled at layout level (dashboard/layout.tsx)
  // This page only shows when subscription is active
  const restaurantArray = Array.isArray(restaurants) ? restaurants : [];

  if (loading) {
    return (
      <div className="flex min-h-[52vh] items-center justify-center rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <DashboardLoader message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-4.5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(244,247,255,0.82))]" />
        <div className="relative grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600">
              Operator Briefing
            </p>
            <h2 className="mt-2 text-[1.9rem] font-black tracking-tighter text-slate-950 sm:text-[2.35rem]">
              Welcome Back
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-[0.98rem] sm:leading-7">
              Real-time snapshot of your restaurant network performance, content
              readiness, and guest engagement momentum.
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative h-44 w-full max-w-85 overflow-hidden rounded-3xl border border-white/80 bg-linear-to-br from-violet-50 via-white to-slate-100 shadow-[0_20px_50px_rgba(99,102,241,0.10)]">
              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-600 shadow-sm">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
                  Live workspace
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-violet-300" />
              </div>
              <div className="absolute right-6 top-6 h-8 w-8 rounded-full bg-violet-200/70 blur-xl" />
              <div className="absolute left-7 top-14 h-10 w-10 rounded-full bg-indigo-200/60 blur-xl" />
              <div className="absolute right-7 bottom-8 h-16 w-16 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-500 shadow-[0_14px_20px_rgba(99,102,241,0.18)]" />
              <div className="absolute right-16 top-16 h-12 w-12 rounded-2xl bg-white shadow-[0_12px_24px_rgba(15,23,42,0.08)]" />
              <div className="absolute right-18 top-18 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 shadow-sm">
                <BarChart3 className="h-4.5 w-4.5" />
              </div>
              <div className="absolute left-9 bottom-6 flex items-end gap-1.5">
                <div className="h-7 w-2 rounded-full bg-violet-300" />
                <div className="h-11 w-2 rounded-full bg-violet-500" />
                <div className="h-8 w-2 rounded-full bg-indigo-400" />
                <div className="h-13 w-2 rounded-full bg-sky-300" />
              </div>
              <div className="absolute left-10 bottom-3 space-y-1">
                <div className="h-1 w-16 rounded-full bg-slate-200" />
                <div className="h-1 w-12 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(card => {
          const Icon = card.icon;
          const value = stats[card.key];

          return (
            <article
              key={card.key}
              className="group rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${card.accent} text-white shadow-[0_14px_20px_rgba(99,102,241,0.16)]`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {card.chip}
                </span>
              </div>
              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {card.label}
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="text-[2rem] font-black tracking-tighter text-slate-950">
                    {value}
                  </p>
                  {card.key === "totalModelViews" &&
                    stats.modelViewsTrend !== 0 && (
                      <span
                        className={`text-sm font-semibold ${
                          stats.modelViewsTrend > 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {stats.modelViewsTrend > 0 ? "↑" : "↓"}{" "}
                        {Math.abs(stats.modelViewsTrend)}%
                      </span>
                    )}
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {card.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-4.5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Quick Actions
              </p>
              <h3 className="mt-1.5 text-lg font-black tracking-tighter text-slate-950">
                Manage the workspace
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Link
              href="/dashboard/restaurants/create"
              className="group flex items-center justify-between rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-3 text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-3 font-semibold text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">
                  <Plus className="h-4 w-4" />
                </span>
                Add Restaurant
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard/menu"
              className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/60"
            >
              <span className="flex items-center gap-3 font-semibold text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-violet-600">
                  <ChefHat className="h-4 w-4" />
                </span>
                Add Menu Item
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-violet-600" />
            </Link>
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-4.5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Recent Activity
              </p>
              <h3 className="mt-1.5 text-lg font-black tracking-tighter text-slate-950">
                Live activity feed
              </h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Updated now
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <Grip className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  {stats.totalMenuItems} menu items currently active
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Menu coverage at a glance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <QrCode className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  {stats.totalQRScans} total QR interactions tracked
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Guest discovery momentum
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <Eye className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  {stats.totalModelViews} total model views tracked
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  3D engagement trending
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
