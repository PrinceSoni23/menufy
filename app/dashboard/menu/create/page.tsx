"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ArrowLeft, FilePlus2, Sparkles, UtensilsCrossed } from "lucide-react";

const CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Soups",
  "Salads",
];

export default function CreateMenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createMenuItem, uploadImage } = useMenu(null);
  const { restaurants, fetchRestaurants } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [model3DPreview, setModel3DPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    basePrice: "",
    category: CATEGORIES[0],
    restaurantId: searchParams.get("restaurant") || "",
    image: null as File | null,
    model3D: null as File | null,
  });

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setRestaurantsLoading(true);
        await fetchRestaurants();
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        showToast("Failed to load restaurants", "error");
      } finally {
        setRestaurantsLoading(false);
      }
    };
    loadRestaurants();
  }, [fetchRestaurants]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast("Image must be less than 10MB", "error");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModel3DChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 200MB)
      if (file.size > 200 * 1024 * 1024) {
        showToast("3D model must be less than 200MB", "error");
        return;
      }
      // Validate file type
      const validTypes = [".glb", ".gltf", ".obj"];
      const fileExt = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!validTypes.includes(fileExt)) {
        showToast(
          "Please select a valid 3D model file (.glb, .gltf, .obj)",
          "error",
        );
        return;
      }
      setFormData(prev => ({ ...prev, model3D: file }));
      setModel3DPreview(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.restaurantId) {
      setError("Please select a restaurant");
      showToast("Please select a restaurant", "error");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter a dish name");
      showToast("Please enter a dish name", "error");
      return;
    }

    if (!formData.price) {
      setError("Please enter a price");
      showToast("Please enter a price", "error");
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      showToast("Price must be greater than 0", "error");
      return;
    }

    setLoading(true);

    try {
      // Create menu item with image (or placeholder)
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        restaurantId: formData.restaurantId,
        image: formData.image ? imagePreview : undefined, // Include image if selected
      };

      console.log(
        "[CreateMenuPage] Creating menu item with data:",
        menuItemData,
      );

      const createResponse = await createMenuItem(menuItemData);

      console.log("[CreateMenuPage] Create response:", createResponse);

      if (!createResponse.success) {
        const errorMsg = createResponse.error || "Failed to create menu item";
        setError(errorMsg);
        showToast(errorMsg, "error");
        setLoading(false);
        return;
      }

      const menuItem = createResponse.data;

      console.log("[CreateMenuPage] Menu item created successfully:", menuItem);
      showToast("Menu item created successfully!", "success");

      // If image was provided, upload it to the created item
      if (formData.image && menuItem?._id) {
        setUploading(true);
        const imageData = await uploadImage(
          formData.image,
          formData.restaurantId,
          menuItem._id,
        );

        if (!imageData.success) {
          console.warn(
            "Image upload failed but menu item was created:",
            imageData.error,
          );
          showToast(
            "Menu item created! Image upload failed, but you can upload it later.",
            "warning",
          );
        } else {
          showToast("Image uploaded successfully!", "success");
        }
      }

      // If 3D model was provided, upload it to the created item
      if (formData.model3D && menuItem?._id) {
        try {
          const model3DEndpoint = API_ENDPOINTS.UPLOAD_3D_MODEL(
            formData.restaurantId,
            menuItem._id,
          );
          await apiClient.uploadFile(model3DEndpoint, formData.model3D, "file");
          showToast("3D model uploaded successfully!", "success");
        } catch (modelError) {
          console.error("Error uploading 3D model:", modelError);
          showToast(
            "Menu item created! 3D model upload failed, but you can upload it later.",
            "warning",
          );
        }
      }

      setUploading(false);

      console.log(
        "[CreateMenuPage] Redirecting to:",
        `/dashboard/menu?restaurant=${formData.restaurantId}`,
      );

      // Redirect to menu items list
      setTimeout(() => {
        router.push(`/dashboard/menu?restaurant=${formData.restaurantId}`);
      }, 1000);
    } catch (err: any) {
      console.error("[CreateMenuPage] Error:", err);
      const errorMsg = err.message || "An error occurred";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (restaurantsLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <Link
            href="/dashboard/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
              <FilePlus2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
                Menu Builder
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
                Add Menu Item
              </h2>
            </div>
          </div>
          <LoadingSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              Menu Builder
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              Add Menu Item
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Add a dish, attach visuals, and keep the workflow compact.
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
            <label className="form-label">Restaurant *</label>
            <select
              name="restaurantId"
              value={formData.restaurantId}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select a restaurant</option>
              {restaurants.map(restaurant => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Dish Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Spaghetti Carbonara"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Describe the dish and its ingredients..."
              value={formData.description}
              onChange={handleInputChange}
              className="form-input resize-none"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Price * </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">$</span>
                <input
                  type="number"
                  name="price"
                  placeholder="12.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input pl-7"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">
              Dish Image (2D) <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-slate-300 font-semibold">
                  Click or drag to upload
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  PNG, JPG up to 10MB
                </p>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="form-label">
              3D Model <span className="text-slate-400">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".glb,.gltf,.obj"
                onChange={handleModel3DChange}
                className="hidden"
                id="model3d-input"
              />
              <label htmlFor="model3d-input" className="cursor-pointer block">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-slate-300 font-semibold">
                  Click or drag to upload
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  .glb, .gltf, .obj up to 200MB
                </p>
              </label>
            </div>
            {model3DPreview && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">
                  Selected 3D Model:
                </p>
                <p className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300">
                  {model3DPreview}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
            <Sparkles className="mt-0.5 h-4 w-4" />
            <span>
              Upload your own 3D model (.glb, .gltf, or .obj) to showcase your
              dish in interactive 3D. You can also add a 2D image for previews.
            </span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Uploading...
                </>
              ) : loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating...
                </>
              ) : (
                "✓ Create Menu Item"
              )}
            </button>
            <Link
              href="/dashboard/menu"
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
