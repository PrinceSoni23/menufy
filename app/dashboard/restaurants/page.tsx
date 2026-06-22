"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { confirmAction } from "@/components/common/ConfirmDialog";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl hero-title font-bold text-slate-900">
            Restaurants
          </h2>
          <p className="text-slate-600 mt-1">
            Manage all your restaurant locations
          </p>
        </div>
        <Link href="/dashboard/restaurants/create" className="btn-primary">
          ➕ Add Restaurant
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="card bg-white/90 border-slate-200 text-center py-12">
          <div className="text-4xl mb-4">🏪</div>
          <p className="text-slate-600 mb-4">No restaurants yet</p>
          <Link
            href="/dashboard/restaurants/create"
            className="btn-primary inline-block"
          >
            Create Your First Restaurant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div
              key={restaurant._id}
              className="card bg-white/90 border-slate-200 group hover:border-orange-300/50 transition-all"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {Array.isArray(restaurant.cuisine)
                  ? restaurant.cuisine.join(", ")
                  : restaurant.cuisine}
              </p>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p>
                  📍 {restaurant.address}, {restaurant.city}
                </p>
                <p>📱 {restaurant.phone}</p>
                <p>🔗 {restaurant.stats?.qrScans || 0} QR Scans</p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/restaurants/${restaurant._id}`}
                  className="flex-1 btn-secondary text-sm text-center"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(restaurant._id, restaurant.name)}
                  disabled={deleting === restaurant._id}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
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
