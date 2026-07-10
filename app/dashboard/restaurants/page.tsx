"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import {
  Check,
  ChevronRight,
  MapPin,
  MoreHorizontal,
  Plus,
  QrCode,
  Shield,
  Store,
  Wifi,
} from "lucide-react";
import { showToast } from "@/components/common/Toast";
import { API_BASE_URL } from "@/lib/constants";

/* Decorative sparkline used on the stat cards. Purely visual — not tied to real metrics. */
function Sparkline({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      className="mt-3 h-8 w-full"
    >
      <path
        d="M0 28 C 20 30, 30 12, 50 18 S 80 32, 100 22 S 140 8, 160 16 S 190 10, 200 8"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="200" cy="8" r="4" fill={color} />
    </svg>
  );
}

/* Decorative header illustration. Stylized approximation, not a traced asset. */
function HeroIllustration() {
  return (
    <div className="relative hidden h-40 w-52 shrink-0 items-center justify-center md:flex">
      <div className="absolute h-32 w-32 rotate-45 rounded-2xl border border-dashed border-violet-200" />
      <div className="absolute -left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
        <MapPin className="h-4 w-4 text-violet-600" />
      </div>
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-[0_18px_36px_rgba(79,70,229,0.28)]">
        <Store className="h-10 w-10 text-white" />
      </div>
      <div className="absolute -right-1 bottom-3 h-3 w-3 rounded-full bg-emerald-400" />
      <div className="absolute right-8 bottom-0 h-2 w-2 rounded-full bg-sky-400" />
    </div>
  );
}

export default function RestaurantsPage() {
  const router = useRouter();
  const { restaurants, fetchRestaurants } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    restaurantId: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB", "error");
      return;
    }

    try {
      setUploadingId(restaurantId);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantId}/upload-image`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      showToast("Image uploaded successfully!", "success");

      // Refresh restaurants list to show new image
      await fetchRestaurants();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      showToast(message, "error");
    } finally {
      setUploadingId(null);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-600">
              Restaurant Hub
            </p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              Restaurants
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Manage your locations, review coverage, and keep every branch
              aligned.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <HeroIllustration />
            <Link
              href="/dashboard/restaurants/create"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Add Restaurant
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100">
              <Store className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Locations
              </p>
              <p className="text-2xl font-black tracking-tighter text-slate-950">
                {restaurants.length}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">Active locations</p>
          <Sparkline color="#7c3aed" />
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Wifi className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Quick status
              </p>
              <p className="text-2xl font-black tracking-tighter text-slate-950">
                Live
              </p>
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">All systems operational</p>
          <Sparkline color="#10b981" />
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
              <Shield className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Coverage
              </p>
              <p className="text-2xl font-black tracking-tighter text-slate-950">
                100%
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">Network coverage</p>
          <Sparkline color="#0ea5e9" />
        </div>
      </div>

      {/* Restaurant list */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/85 px-6 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100">
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
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {restaurants.map(restaurant => (
            <div
              key={restaurant._id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.08)] sm:flex-row"
            >
              {/* Image panel */}
              <div className="group/image relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-violet-100 via-slate-50 to-slate-100">
                    <Store className="h-10 w-10 text-violet-300" />
                  </div>
                )}

                {/* Upload overlay (transparent so image remains full opacity) */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-200">
                  <div className="flex flex-col items-center gap-2 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
                    <label
                      htmlFor={`image-upload-${restaurant._id}`}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-white transition">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      {uploadingId === restaurant._id ? (
                        <span className="text-sm font-semibold text-white">
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-white">
                            Change Image
                          </span>
                          <span className="text-xs text-white/80">
                            Click to upload
                          </span>
                        </>
                      )}
                    </label>
                    <input
                      id={`image-upload-${restaurant._id}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, restaurant._id)}
                      disabled={uploadingId === restaurant._id}
                      className="hidden"
                    />
                  </div>
                </div>

                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold tracking-tighter text-slate-950 transition-colors group-hover:text-violet-700">
                      {restaurant.name}
                    </h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.18em] text-violet-600">
                      {Array.isArray(restaurant.cuisine)
                        ? restaurant.cuisine.join(", ")
                        : restaurant.cuisine}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="More options"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5 rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600">
                  <p className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-violet-500" />
                    <span className="truncate">
                      {restaurant.address}, {restaurant.city}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 shrink-0 text-violet-500" />
                    <span>{restaurant.stats?.qrScans || 0} QR scans</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 text-violet-500" />
                    <span>{restaurant.phone}</span>
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/dashboard/restaurants/${restaurant._id}`}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-2.5 text-center text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
