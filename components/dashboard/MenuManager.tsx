"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import { showToast } from "@/components/common/Toast";
import { MenuItem } from "@/lib/types";
import {
  Plus,
  Search,
  Sparkles,
  UtensilsCrossed,
  Edit3,
  Trash2,
} from "lucide-react";

interface MenuManagerProps {
  restaurantId: string;
}

const CATEGORY_ICONS: { [key: string]: string } = {
  starters: "🥗",
  appetizers: "🥙",
  "main course": "🍽️",
  mains: "🍽️",
  desserts: "🍰",
  deserts: "🍰",
  drinks: "🥤",
  beverages: "🥤",
  mojito: "🍹",
  cocktails: "🍸",
  mocktails: "🧃",
  wine: "🍷",
  beer: "🍺",
  coffee: "☕",
  tea: "🍵",
  smoothies: "🧋",
  salads: "🥗",
  soups: "🍲",
  breads: "🍞",
  pasta: "🍝",
  rice: "🍚",
};

const AVAILABLE_CATEGORIES = [
  "Starters",
  "Appetizers",
  "Main Course",
  "Mains",
  "Desserts",
  "Deserts",
  "Drinks",
  "Beverages",
  "Mojito",
  "Cocktails",
  "Mocktails",
  "Wine",
  "Beer",
  "Coffee",
  "Tea",
  "Smoothies",
  "Salads",
  "Soups",
  "Breads",
  "Pasta",
  "Rice",
];

export default function MenuManager({ restaurantId }: MenuManagerProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploading3D, setUploading3D] = useState(false);
  const [upload3DProgress, setUpload3DProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [model3DName, setModel3DName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    ingredients: "",
    calories: "",
    imageUrl2D: "",
    model3DUrl: "",
    imageFile: null as File | null,
    model3DFile: null as File | null,
    isActive: true,
  });

  useEffect(() => {
    loadMenuItems();
  }, [restaurantId]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log("Loading menu items for restaurantId:", restaurantId); // Debug log
      const response = await apiClient.get(`/menu/restaurant/${restaurantId}`);
      console.log("Full API Response:", response); // Debug - full response object
      let data = response.data as any;

      console.log("API Response data:", data); // Debug log

      // Handle the actual API response structure
      // Response is: { success, message, data: { menuItems, pagination, count } }
      let items: MenuItem[] = [];

      // First check: data.menuItems (correct structure from backend)
      if (data?.menuItems && Array.isArray(data.menuItems)) {
        console.log("Using data.menuItems");
        items = data.menuItems;
      } else if (data?.data?.menuItems && Array.isArray(data.data.menuItems)) {
        console.log("Using data.data.menuItems");
        items = data.data.menuItems;
      } else if (data?.data?.data && Array.isArray(data.data.data)) {
        console.log("Using data.data.data");
        items = data.data.data;
      } else if (data?.data && Array.isArray(data.data)) {
        console.log("Using data.data");
        items = data.data;
      } else if (Array.isArray(data)) {
        console.log("Using data directly");
        items = data;
      } else {
        console.warn("Could not find items in response structure");
      }

      console.log("Loaded items count:", items.length); // Debug log
      console.log("Loaded items:", items); // Debug log
      setMenuItems(items);
    } catch (error) {
      console.error("Failed to load menu items:", error);
      // Don't show error toast on load, just set empty
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("Image must be less than 10MB", "error");
        return;
      }
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handle3DModelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 35 * 1024 * 1024) {
        showToast(
          "3D model must be less than 35MB for reliable production uploads",
          "error",
        );
        return;
      }
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
      setFormData(prev => ({ ...prev, model3DFile: file }));
      setModel3DName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const submitData: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients
          ? formData.ingredients.split(",").map(s => s.trim())
          : [],
        calories: formData.calories ? Number(formData.calories) : undefined,
        category: formData.category,
        isActive: formData.isActive,
        restaurantId,
        // Never persist base64 previews; actual image files are uploaded separately.
        imageUrl2D:
          !formData.imageFile &&
          formData.imageUrl2D &&
          !formData.imageUrl2D.startsWith("data:")
            ? formData.imageUrl2D
            : "",
      };

      if (editingId) {
        if (formData.model3DUrl.trim()) {
          submitData.model3DUrl = formData.model3DUrl.trim();
        }
      }

      console.log("Submitting menu item with data:", submitData); // Debug log
      console.log("RestaurantId:", restaurantId); // Debug log

      let createdItemId = editingId;

      if (editingId) {
        // Update existing item
        await apiClient.put(`/menu/${editingId}`, submitData);
        showToast("Menu item updated successfully", "success");
      } else {
        // Create new item
        const response = (await apiClient.post("/menu", submitData)) as any;
        console.log("Create response:", response.data); // Debug log
        createdItemId = response.data?.menuItem?._id;
        console.log("[3D UPLOAD] Extracted createdItemId:", createdItemId); // DEBUG
        showToast("Menu item created successfully", "success");
      }

      // Upload 2D image separately if provided
      if (formData.imageFile && createdItemId) {
        const imageEndpoint = API_ENDPOINTS.UPLOAD_IMAGE(
          restaurantId,
          createdItemId,
        );
        const imageFullUrl = `${API_BASE_URL.replace(/\/$/, "")}${imageEndpoint}`;
        console.log(
          `[2D UPLOAD] Making POST request to ${imageEndpoint} (resolved full URL: ${imageFullUrl})`,
        );

        try {
          const imageUploadResponse = await apiClient.uploadFile(
            imageEndpoint,
            formData.imageFile,
            "image",
          );
          console.log("[2D UPLOAD] Response:", imageUploadResponse);
          showToast("Image uploaded successfully", "success");
        } catch (imageError: any) {
          console.error("[2D UPLOAD] Error:", imageError);
          showToast(
            "Item saved! Image upload failed - you can retry later",
            "warning",
          );
        }
      }

      // Upload 3D model separately if provided
      console.log(
        `[3D UPLOAD] About to upload - model3DFile: ${formData.model3DFile ? "EXISTS" : "MISSING"}, createdItemId: ${createdItemId}`,
      ); // DEBUG
      if (formData.model3DFile && createdItemId) {
        const formDataForModel = new FormData();
        formDataForModel.append("file", formData.model3DFile);

        const relativeEndpoint = API_ENDPOINTS.UPLOAD_3D_MODEL(
          restaurantId,
          createdItemId,
        );
        const fullUrl = `${API_BASE_URL.replace(/\/$/, "")}${relativeEndpoint}`;
        console.log(
          `[3D UPLOAD] Making POST request to ${relativeEndpoint} (resolved full URL: ${fullUrl})`,
        ); // DEBUG

        try {
          setUploading3D(true);
          setUpload3DProgress(0);

          // Upload to the 3D model endpoint using uploadFile helper (handles FormData)
          const uploadResponse = await apiClient.uploadFile(
            relativeEndpoint,
            formDataForModel.get("file") as File,
            "file",
            undefined,
            {
              timeoutMs: 10 * 60 * 1000,
              onUploadProgress: progress => {
                setUpload3DProgress(progress);
              },
            },
          );
          setUpload3DProgress(100);
          console.log("[3D UPLOAD] Response:", uploadResponse); // DEBUG
          showToast("3D model uploaded successfully", "success");
        } catch (modelError: any) {
          console.error("[3D UPLOAD] Error:", modelError);
          try {
            console.error("[3D UPLOAD] error.message:", modelError.message);
            console.error(
              "[3D UPLOAD] response status:",
              modelError.response?.status,
            );
            console.error(
              "[3D UPLOAD] response headers:",
              modelError.response?.headers,
            );
            console.error(
              "[3D UPLOAD] response data:",
              modelError.response?.data,
            );
          } catch (e) {
            console.error(
              "[3D UPLOAD] Error while logging modelError details",
              e,
            );
          }

          showToast(
            modelError?.message?.includes("timeout")
              ? "Item saved! 3D upload timed out. Try a smaller .glb (<=35MB)."
              : "Item saved! 3D model upload failed - you can retry later",
            "warning",
          );
        } finally {
          setUploading3D(false);
        }
      } else {
        console.log("[3D UPLOAD] Skipping upload - missing file or item ID"); // DEBUG
      }

      resetForm();
      await loadMenuItems();
    } catch (error: any) {
      console.error("Error saving menu item:", error);
      showToast(error.message || "Failed to save menu item", "error");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await apiClient.delete(`/menu/${itemId}`);
      showToast("Menu item deleted successfully", "success");
      await loadMenuItems();
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      showToast(error.message || "Failed to delete menu item", "error");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price?.toString() || "",
      category: item.category || "Main Course",
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.join(", ")
        : item.ingredients || "",
      calories:
        item.calories !== undefined && item.calories !== null
          ? String(item.calories)
          : "",
      imageUrl2D: item.imageUrl2D || "",
      model3DUrl: item.model3DUrl || "",
      imageFile: null,
      model3DFile: null,
      isActive: item.isActive ?? true,
    });
    setImagePreview(item.imageUrl2D || null);
    setModel3DName(
      item.model3DUrl ? item.model3DUrl.split("/").pop() || "3D Model" : null,
    );
    setEditingId(item._id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Main Course",
      ingredients: "",
      calories: "",
      imageUrl2D: "",
      model3DUrl: "",
      imageFile: null,
      model3DFile: null,
      isActive: true,
    });
    setImagePreview(null);
    setModel3DName(null);
    setUpload3DProgress(0);
    setUploading3D(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const categories = [
    "all",
    ...new Set(menuItems.map(item => item.category).filter(Boolean)),
  ];
  const filteredItems = menuItems.filter(item => {
    const matchCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  console.log("Total items:", menuItems.length); // Debug
  console.log("Categories:", categories); // Debug
  console.log("Selected category:", selectedCategory); // Debug
  console.log("Filtered items:", filteredItems.length); // Debug
  console.log("Menu items details:", menuItems); // Debug

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🍽️</div>
          <p className="text-black/70">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
            Menu Management
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
            Menu Items
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your restaurant's menu
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition-all"
        >
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Item
            </>
          )}
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6"
          >
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
              <UtensilsCrossed className="h-4 w-4 text-violet-600" />
              {editingId ? "Edit Menu Item" : "Add New Item"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Caesar Salad"
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 12.99"
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black focus:border-black/40 focus:outline-none"
                >
                  {AVAILABLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your item..."
                  rows={3}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={e =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    placeholder="e.g., tomato, lettuce, parmesan"
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={e =>
                      setFormData({ ...formData, calories: e.target.value })
                    }
                    placeholder="e.g., 420"
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Food Image
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.imageUrl2D}
                      onChange={e =>
                        setFormData({ ...formData, imageUrl2D: e.target.value })
                      }
                      placeholder="Image URL or upload below..."
                      className="flex-1 bg-white border border-black/10 rounded-lg px-4 py-2 text-black placeholder-black/40 focus:border-black/40 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex-1 px-4 py-2 bg-white border border-black/10 rounded-lg text-black font-semibold cursor-pointer transition-all text-center"
                    >
                      📤 Upload Food Image
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="rounded-lg overflow-hidden bg-white border border-black/10">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="px-3 py-2 border-t border-black/10 text-xs text-black/70">
                        ✓ Image ready
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  3D Model (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".glb,.gltf,.obj"
                      onChange={handle3DModelSelect}
                      className="hidden"
                      id="model-upload"
                    />
                    <label
                      htmlFor="model-upload"
                      className="flex-1 px-4 py-2 bg-white border border-black/10 rounded-lg text-black font-semibold cursor-pointer transition-all text-center"
                    >
                      🎨 Upload 3D Model (.glb, .gltf, .obj)
                    </label>
                  </div>
                  {model3DName && (
                    <div className="px-4 py-2 bg-white border border-black/10 rounded-lg text-black text-sm flex items-center gap-2">
                      <span>✓</span>
                      <span>{model3DName}</span>
                    </div>
                  )}
                  {uploading3D && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-black/70">
                        <span>Uploading 3D model...</span>
                        <span>{upload3DProgress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-purple-500 to-violet-400 transition-all duration-200"
                          style={{ width: `${upload3DProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-black/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-black">
                    Active
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={uploading3D}
                  className="flex-1 rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)] transition-all"
                >
                  {uploading3D
                    ? `Uploading 3D... ${upload3DProgress}%`
                    : editingId
                      ? "Update Item"
                      : "Add Item"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none"
        />
        <div className="flex overflow-x-auto gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {CATEGORY_ICONS[cat.toLowerCase()] || "📋"}{" "}
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-slate-300 bg-white/85 py-12 text-center shadow-sm"
          >
            <p className="text-sm text-slate-600">
              No items found. Add your first menu item!
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.08)]"
              >
                <div className="flex gap-4">
                  {item.imageUrl2D && (
                    <img
                      src={item.imageUrl2D}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-950">
                          {item.name}
                        </h4>
                        <span className="mt-1 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {CATEGORY_ICONS[
                            item.category?.toLowerCase() || "all"
                          ] || "📋"}{" "}
                          {item.category}
                        </span>
                      </div>
                      {!item.isActive && (
                        <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-200">
                          Inactive
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-black/70 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.ingredients && item.ingredients.length > 0 && (
                      <p className="text-sm text-black/70 mb-2">
                        {Array.isArray(item.ingredients)
                          ? item.ingredients.join(", ")
                          : String(item.ingredients)}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-black">
                          ${item.price?.toFixed(2)}
                        </span>
                        {item.calories !== undefined &&
                        item.calories !== null ? (
                          <span className="text-sm text-black/60">
                            {item.calories} kcal
                          </span>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-black/3 text-black hover:bg-black/6 transition-all"
                          title="Edit"
                        >
                          ✏️
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all"
                          title="Delete"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
