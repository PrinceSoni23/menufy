"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { confirmAction } from "@/components/common/ConfirmDialog";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Plus,
  Sparkles,
  Store,
} from "lucide-react";

export default function RestaurantsPage() {
  const router = useRouter();
  const { restaurants, fetchRestaurants, deleteRestaurant } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        await fetchRestaurants();
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        showToast("Failed to load restaurants", "error");
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, [fetchRestaurants]);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirmAction({
      title: "Delete Restaurant?",
      message: `Are you sure you want to delete "${name}" and all its associated menu items? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
    });

    if (!confirmed) return;

    setDeleting(id);
    try {
      await deleteRestaurant(id);
      showToast("Restaurant deleted successfully", "success");
      await fetchRestaurants();
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      showToast("Failed to delete restaurant", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600">
              Restaurant Hub
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              Restaurants
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage your locations, review coverage, and keep every branch
              aligned.
            </p>
          </div>
          <Link
            href="/dashboard/restaurants/create"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Locations
          </p>
          <p className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
            {restaurants.length}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Quick status
          </p>
          <p className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
            Live
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Coverage
          </p>
          <p className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
            100%
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/85 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-2xl">
            <Store className="h-6 w-6 text-violet-600" />
          </div>
          <p className="mb-4 text-slate-600">No restaurants yet</p>
          <Link
            href="/dashboard/restaurants/create"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create Your First Restaurant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map(restaurant => (
            <div
              key={restaurant._id}
              className="group rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tighter text-slate-950 group-hover:text-violet-700 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500">
                    {Array.isArray(restaurant.cuisine)
                      ? restaurant.cuisine.join(", ")
                      : restaurant.cuisine}
                  </p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Live
                </span>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600">
                <p>
                  <Building2 className="mr-2 inline-block h-4 w-4 text-violet-500" />
                  {restaurant.address}, {restaurant.city}
                </p>
                <p>
                  <Sparkles className="mr-2 inline-block h-4 w-4 text-violet-500" />
                  {restaurant.stats?.qrScans || 0} QR scans
                </p>
                <p>
                  <ChevronRight className="mr-2 inline-block h-4 w-4 text-violet-500" />
                  {restaurant.phone}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dashboard/restaurants/${restaurant._id}`}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/60"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(restaurant._id, restaurant.name)}
                  disabled={deleting === restaurant._id}
                  className="flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting === restaurant._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
