"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Restaurant } from "@/lib/types";

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
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-slate-600">Loading restaurant...</p>
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Restaurant not found</p>
        <Link href="/dashboard/restaurants" className="btn-primary">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/restaurants"
          className="text-orange-600 hover:text-orange-700"
        >
          ← Back to Restaurants
        </Link>
        <button
          onClick={() => setEditing(!editing)}
          className={editing ? "btn-secondary" : "btn-primary"}
        >
          {editing ? "Cancel" : "✏️ Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="card bg-white/90 border-slate-200">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 mb-4">
                {error}
              </div>
            )}

            {!editing ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl hero-title font-bold text-slate-900">
                    {currentRestaurant.name}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {currentRestaurant.cuisine}
                  </p>
                </div>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <span className="font-semibold">📍 Location:</span>{" "}
                    {currentRestaurant.location}
                  </p>
                  <p>
                    <span className="font-semibold">📱 Phone:</span>{" "}
                    {currentRestaurant.phone}
                  </p>
                  {currentRestaurant.description && (
                    <p>
                      <span className="font-semibold">📝 Description:</span>{" "}
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
