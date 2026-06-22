"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Restaurant } from "@/lib/types";
import {
  ArrowLeft,
  Building2,
  Edit3,
  MenuSquare,
  Phone,
  Save,
} from "lucide-react";

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  const { currentRestaurant, loading, fetchRestaurant, updateRestaurant } =
    useRestaurant();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    location: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        await fetchRestaurant(restaurantId);
      } catch (error) {
        console.error("Failed to load restaurant:", error);
        setError("Failed to load restaurant");
      }
    };
    loadRestaurant();
  }, [restaurantId, fetchRestaurant]);

  useEffect(() => {
    if (currentRestaurant) {
      setFormData({
        name: currentRestaurant.name,
        cuisine: currentRestaurant.cuisine,
        location: currentRestaurant.location,
        phone: currentRestaurant.phone,
        description: currentRestaurant.description || "",
      });
    }
  }, [currentRestaurant]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await updateRestaurant(restaurantId, formData);
      if (response.success) {
        setEditing(false);
        router.refresh();
      } else {
        setError(response.error || "Failed to update restaurant");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-slate-600">Loading restaurant...</p>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-rose-600">Restaurant not found</p>
        <Link
          href="/dashboard/restaurants"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/restaurants"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restaurants
        </Link>
        <button
          onClick={() => setEditing(!editing)}
          className={
            editing
              ? "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
              : "inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)]"
          }
        >
          {editing ? (
            <>
              <Edit3 className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" /> Edit
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {!editing ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
                      Restaurant Profile
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
                      {currentRestaurant.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {currentRestaurant.cuisine}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Active
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">
                      📍 Location:
                    </span>{" "}
                    {currentRestaurant.location}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      📱 Phone:
                    </span>{" "}
                    {currentRestaurant.phone}
                  </p>
                  {currentRestaurant.description && (
                    <p>
                      <span className="font-semibold text-slate-900">
                        📝 Description:
                      </span>{" "}
                      {currentRestaurant.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="form-label">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Cuisine Type</label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input resize-none"
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Menu Items Section */}
          <div className="card bg-white/90 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Menu Items</h3>
              <Link
                href={`/dashboard/menu?restaurant=${restaurantId}`}
                className="btn-primary text-sm"
              >
                ➕ Add Item
              </Link>
            </div>
            <p className="text-slate-600">
              Manage dishes for this restaurant in the Menu section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
