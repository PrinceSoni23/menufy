"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { ArrowLeft, Building2, Plus, Sparkles } from "lucide-react";

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
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href="/dashboard/restaurants"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Restaurants
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              Restaurant Hub
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              Create Restaurant
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add a new location and keep the dashboard coverage tidy.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <Sparkles className="mt-0.5 h-4 w-4" />
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

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/60"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
