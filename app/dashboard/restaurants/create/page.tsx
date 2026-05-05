"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";

const CUISINES = [
  "Italian",
  "Chinese",
  "Japanese",
  "Mexican",
  "Indian",
  "Thai",
  "French",
  "Korean",
  "Middle Eastern",
  "Mediterranean",
  "American",
  "Fusion",
];

export default function CreateRestaurantPage() {
  const router = useRouter();
  const { createRestaurant } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cuisine: CUISINES[0],
    address: "",
    city: "",
    phone: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter a restaurant name");
      showToast("Please enter a restaurant name", "error");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter an address");
      showToast("Please enter an address", "error");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter a city");
      showToast("Please enter a city", "error");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter a phone number");
      showToast("Please enter a phone number", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await createRestaurant({
        name: formData.name,
        cuisine: [formData.cuisine], // Send as array
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        description: formData.description,
      });

      if (response?.success) {
        showToast("Restaurant created successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard/restaurants");
        }, 1000);
      } else {
        const errorMsg = response?.error || "Failed to create restaurant";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err: any) {
      const errorMsg = err.message || "An error occurred";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/restaurants"
          className="text-orange-200 hover:text-orange-100"
        >
          ← Back to Restaurants
        </Link>
      </div>

      <div className="card">
        <h2 className="text-3xl hero-title font-bold text-slate-100 mb-6">
          Create Restaurant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="form-label">Restaurant Name *</label>
            <input
              type="text"
              name="name"
              placeholder="The Italian Kitchen"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Cuisine Type *</label>
            <select
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="form-input"
              required
            >
              {CUISINES.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                placeholder="New York"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Tell us about your restaurant..."
              value={formData.description}
              onChange={handleChange}
              className="form-input resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating...
                </>
              ) : (
                "✓ Create Restaurant"
              )}
            </button>
            <Link
              href="/dashboard/restaurants"
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

