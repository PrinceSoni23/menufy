"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/components/common/Toast";
import { MenuItem } from "@/lib/types";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [model3DName, setModel3DName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    imageUrl2D: "",
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
      if (file.size > 50 * 1024 * 1024) {
        showToast("3D model must be less than 50MB", "error");
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
        category: formData.category,
        isActive: formData.isActive,
        restaurantId,
        imageUrl2D: imagePreview || "", // Always send imageUrl2D (empty string will use default placeholder on backend)
      };

      console.log("Submitting menu item with data:", submitData); // Debug log
      console.log("RestaurantId:", restaurantId); // Debug log

      let createdItemId = editingId;

      if (editingId) {
        // Update existing item
        await apiClient.put(`/menu/${editingId}`, submitData);
        showToast("Menu item updated successfully", "success");
      } else {
        // Create new item
        const response = await apiClient.post("/menu", submitData);
        console.log("Create response:", response.data); // Debug log
        createdItemId =
          response.data?.data?.menuItem?._id || response.data?.data?._id;
        showToast("Menu item created successfully", "success");
      }

      // Upload 3D model separately if provided
      if (formData.model3DFile && createdItemId) {
        const formDataForModel = new FormData();
        formDataForModel.append("file", formData.model3DFile);

        try {
          // Upload to the 3D model endpoint
          await apiClient.post(
            `/upload/3d-model/${restaurantId}/${createdItemId}`,
            formDataForModel,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          showToast("3D model uploaded successfully", "success");
        } catch (modelError: any) {
          console.warn("3D model upload failed:", modelError);
          showToast(
            "Item saved! 3D model upload failed - you can retry later",
            "warning",
          );
        }
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
      imageUrl2D: item.imageUrl2D || "",
      imageFile: null,
      model3DFile: null,
      isActive: item.isActive || true,
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
      imageUrl2D: "",
      imageFile: null,
      model3DFile: null,
      isActive: true,
    });
    setImagePreview(null);
    setModel3DName(null);
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

  const [direction, setDirection] = useState(0);

  const handleCategoryChange = (newCat: string) => {
    const currentIndex = categories.indexOf(selectedCategory);
    const newIndex = categories.indexOf(newCat);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelectedCategory(newCat);
  };

  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
      z: -300,
    }),
    center: {
      zIndex: 1,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      rotateY: dir < 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
      z: -300,
    }),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          className="text-orange-500/80 font-medium tracking-widest uppercase text-sm"
        >
          LOADING MENU
        </motion.p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 font-serif tracking-wide"
          >
            The Grand Menu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm max-w-md italic font-serif"
          >
            Curate your majestic culinary offerings here.
          </motion.p>
        </div>

        <div className="flex gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="relative flex items-center justify-center gap-2 overflow-hidden rounded-sm bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_15px_rgba(217,119,6,0.4)]"
          >
            <span className="flex items-center gap-2 font-serif rounded-sm bg-[#1a1a1a] px-6 py-3 text-amber-400 transition-all hover:bg-transparent hover:text-black">
              {showAddForm ? (
                <span className="font-semibold tracking-widest text-sm uppercase">
                  Close Ledger
                </span>
              ) : (
                <>
                  <span className="text-lg">+</span>
                  <span className="font-semibold tracking-widest text-sm uppercase">
                    Scribe New Item
                  </span>
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar bg-[#1c1917] border-2 border-amber-900/50 rounded-xl shadow-2xl p-8">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-500 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>

              <div className="mb-8 text-center border-b border-amber-900/30 pb-6">
                <h3 className="text-3xl font-bold text-amber-500 font-serif uppercase tracking-widest">
                  {editingId ? "Refine Creation" : "New Culinary Masterpiece"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 font-serif">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                        Item Nomenclature *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#111] border border-amber-900/50 rounded-sm px-4 py-3 text-amber-100 placeholder-amber-900/50 focus:border-amber-500 focus:outline-none transition-all"
                        placeholder="e.g. Royal Truffle Risotto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                          Valuation *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 font-medium">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            className="w-full bg-[#111] border border-amber-900/50 rounded-sm pl-8 pr-4 py-3 text-amber-100 focus:border-amber-500 focus:outline-none transition-all"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                          Chapter (Category) *
                        </label>
                        <select
                          value={formData.category}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-[#111] border border-amber-900/50 rounded-sm px-4 py-3 text-amber-100 focus:border-amber-500 focus:outline-none transition-all appearance-none cursor-pointer capitalize"
                        >
                          {AVAILABLE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                        Tale (Description)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full bg-[#111] border border-amber-900/50 rounded-sm px-4 py-3 text-amber-100 placeholder-amber-900/50 focus:border-amber-500 focus:outline-none transition-all resize-none italic"
                        placeholder="Impart the story of this dish..."
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Column: Media */}
                  <div className="space-y-6">
                    <div className="bg-[#111] border border-amber-900/30 rounded-sm p-6 shadow-inner">
                      <label className="block text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 border-b border-amber-900/30 pb-2">
                        Visuals & Art
                      </label>

                      <div className="space-y-5 mt-4">
                        <div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.imageUrl2D}
                              onChange={e =>
                                setFormData({
                                  ...formData,
                                  imageUrl2D: e.target.value,
                                })
                              }
                              placeholder="Image URL..."
                              className="flex-1 bg-[#0a0a0a] border border-amber-900/50 rounded-sm px-4 py-3 text-sm text-amber-100 placeholder-amber-900/50 focus:border-amber-500 focus:outline-none"
                            />
                            <div className="relative group">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                id="image-upload"
                              />
                              <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center w-12 h-12 bg-[#1a1a1a] border border-amber-900/50 rounded-sm cursor-pointer hover:border-amber-500 hover:text-amber-500 text-amber-700 transition-all"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                  ></path>
                                </svg>
                              </label>
                            </div>
                          </div>
                          {imagePreview && (
                            <div className="mt-3 relative h-40 rounded-sm overflow-hidden border border-amber-900/50 group">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <input
                            type="file"
                            accept=".glb,.gltf,.obj"
                            onChange={handle3DModelSelect}
                            className="hidden"
                            id="model-upload"
                          />
                          <label
                            htmlFor="model-upload"
                            className="flex items-center justify-center gap-3 w-full border border-dashed border-amber-900/50 rounded-sm p-4 cursor-pointer hover:border-amber-500 hover:bg-amber-900/10 transition-all text-amber-700 hover:text-amber-500"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              ></path>
                            </svg>
                            <span className="text-sm font-semibold tracking-wide uppercase">
                              Attach 3D Artifact
                            </span>
                          </label>
                          {model3DName && (
                            <div className="mt-2 text-center text-xs text-amber-600 font-mono">
                              {model3DName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-amber-900/30">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 accent-amber-600 bg-[#111] border-amber-900/50"
                    />
                    <span className="text-sm font-bold tracking-widest text-amber-600 uppercase">
                      Available in Menu
                    </span>
                  </label>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-amber-900/50 text-amber-700 hover:bg-amber-900/20 hover:text-amber-500 font-bold tracking-widest uppercase text-sm transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-amber-600 text-[#111] hover:bg-amber-500 font-bold tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all rounded-sm"
                    >
                      {editingId ? "Seal Changes" : "Scribe to Ledger"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Book Layout Container */}
      <div className="relative mt-12 mb-24 max-w-6xl mx-auto perspective-[2500px]">
        {/* Book Outer Binder */}
        <div className="relative flex shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-r-[40px] rounded-l-md bg-[#131110] border-y-8 border-r-8 border-l-[16px] border-[#0a0908] h-[85vh] sm:h-[800px] transform-style-3d">
          {/* Leather Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-[#1a1715] to-[#0a0908] z-30 shadow-[inset_-6px_0_15px_rgba(0,0,0,0.8)] rounded-l-md border-r border-[#222]">
            <div className="absolute top-10 left-2 right-2 h-1 bg-[#0a0908] shadow-inner"></div>
            <div className="absolute top-12 left-2 right-2 h-1 bg-[#0a0908] shadow-inner"></div>
            <div className="absolute bottom-10 left-2 right-2 h-1 bg-[#0a0908] shadow-inner"></div>
            <div className="absolute bottom-12 left-2 right-2 h-1 bg-[#0a0908] shadow-inner"></div>
          </div>

          {/* Bookmarks (Tabs) Fix for visibility */}
          <div className="absolute -right-4 md:-right-12 lg:-right-16 top-12 bottom-12 flex flex-col justify-start gap-1 z-[1] w-12 md:w-16 lg:w-20">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`relative w-full py-4 rounded-r-lg font-serif font-bold text-xs md:text-sm tracking-widest uppercase transition-all duration-500 border-y border-r border-[#1a1a1a] shadow-xl flex items-center justify-center ${
                  selectedCategory === cat
                    ? "bg-[#1c1917] text-amber-500 w-[120%] lg:w-[130%] shadow-amber-900/20 z-10 border-l-[#1c1917]"
                    : "bg-[#0f0e0d] text-amber-900/50 hover:bg-[#1a1816] hover:text-amber-700 hover:w-[110%] z-0"
                }`}
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                {cat === "all" ? "Prologue" : cat}
              </button>
            ))}
          </div>

          {/* Pages Container - the "Paper" */}
          <div className="relative flex-1 ml-16 mr-8 bg-[#211d1c] shadow-[inset_15px_0_30px_rgba(0,0,0,0.6)] rounded-r-[32px] overflow-hidden transform-style-3d z-[5]">
            {/* Page texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={selectedCategory}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.64, 0, 0.35, 1] }}
                className="absolute inset-0 flex flex-col origin-left bg-[#1c1917] rounded-r-[32px]"
              >
                {/* Page content wrap */}
                <div className="relative h-full flex flex-col p-10 sm:p-16 overflow-y-auto hide-scrollbar shadow-[-10px_0_20px_rgba(0,0,0,0.4)]">
                  {/* Page Header */}
                  <div className="text-center mb-12 flex-shrink-0">
                    <div className="inline-block relative">
                      <div className="absolute top-1/2 left-0 w-[40px] sm:w-[80px] h-px bg-amber-900/40 -translate-x-full"></div>
                      <h2 className="text-3xl sm:text-5xl font-serif text-amber-500 font-extrabold uppercase tracking-[0.2em] px-8">
                        {selectedCategory === "all"
                          ? "The Chef's Prologue"
                          : `Chapter: ${selectedCategory}`}
                      </h2>
                      <div className="absolute top-1/2 right-0 w-[40px] sm:w-[80px] h-px bg-amber-900/40 translate-x-full"></div>
                    </div>
                  </div>

                  {/* Menu Items on the Page */}
                  <div className="flex-1 space-y-12">
                    {filteredItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center opacity-50 py-20 font-serif">
                        <span className="text-4xl mb-4">✒️</span>
                        <p className="text-amber-700 text-xl italic tracking-wide">
                          This chapter is yet to be written.
                        </p>
                      </div>
                    ) : (
                      filteredItems.map((item, idx) => (
                        <div
                          key={item._id}
                          className="relative group/item font-serif"
                        >
                          {/* Admin Controls - Visible on Hover */}
                          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 bg-[#2c2826] text-amber-500 border border-amber-900/50 rounded hover:bg-amber-900 hover:text-black transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 bg-[#2c2826] text-rose-500 border border-rose-900/50 rounded hover:bg-rose-900 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          </div>

                          <div className="flex gap-6 items-start">
                            {/* Optional Item Image Circular */}
                            {item.imageUrl2D && (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-900/40 p-1 flex-shrink-0 bg-[#111]">
                                <img
                                  src={item.imageUrl2D}
                                  alt={item.name}
                                  className="w-full h-full rounded-full object-cover grayscale-[30%]"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-4">
                                <h4 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-wide uppercase flex-shrink-0">
                                  {item.name}
                                  {!item.isActive && (
                                    <span className="ml-3 text-xs bg-rose-900/30 text-rose-500 px-2 py-0.5 rounded border border-rose-900/50 align-middle">
                                      Sold Out
                                    </span>
                                  )}
                                </h4>
                                <div className="flex-1 w-full border-b-[3px] border-dotted border-amber-900/30 mb-2"></div>
                                <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-wider flex-shrink-0">
                                  ${item.price?.toFixed(2)}
                                </span>
                              </div>
                              <p className="mt-3 text-amber-700/80 italic text-base leading-relaxed break-words">
                                {item.description}
                              </p>
                              {item.model3DUrl && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-900/10 border border-amber-900/30 text-amber-600 text-xs font-bold tracking-widest uppercase">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    ></path>
                                  </svg>
                                  3D Artifact Available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Page Footer Number */}
                  <div className="mt-12 text-center text-amber-900/40 font-serif italic text-sm">
                    ~ Page {categories.indexOf(selectedCategory) + 1} ~
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
