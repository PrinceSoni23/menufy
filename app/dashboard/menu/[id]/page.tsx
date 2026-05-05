"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";
import { MenuItem } from "@/lib/types";

export default function MenuItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { fetchMenuItemById } = useMenu(null);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await fetchMenuItemById(itemId);
        if (item) {
          setMenuItem(item);
        }
      } catch (error) {
        console.error("Failed to load menu item:", error);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [itemId, fetchMenuItemById]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const item = await fetchMenuItemById(itemId);
      if (item) {
        setMenuItem(item);
      }
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-slate-400">Loading menu item...</p>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Menu item not found</p>
        <Link href="/dashboard/menu" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/menu"
          className="text-orange-200 hover:text-orange-100"
        >
          ← Back to Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image & Conversion Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="card">
            <h3 className="text-lg font-bold text-slate-100 mb-4">2D Image</h3>
            {menuItem.imageUrl2D ? (
              <img
                src={menuItem.imageUrl2D}
                alt={menuItem.name}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="bg-slate-700 h-64 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">No image available</p>
              </div>
            )}
          </div>

          {/* 3D Model */}
          <div className="card">
            <h3 className="text-lg font-bold text-slate-100 mb-4">3D Model</h3>
            {menuItem.model3DUrl ? (
              <div className="bg-slate-700 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-300 mb-2">📦 3D Model Uploaded</p>
                  <p className="text-slate-400 text-sm">
                    {menuItem.model3DUrl}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700 h-96 rounded-lg flex flex-col items-center justify-center">
                <p className="text-slate-400">No 3D model uploaded yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Upload a .glb, .gltf, or .obj file to display your dish in 3D
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details & Status */}
        <div className="space-y-6">
          {/* Item Details */}
          <div className="card">
            <h2 className="text-2xl hero-title font-bold text-slate-100 mb-4">
              {menuItem.name}
            </h2>
            {menuItem.description && (
              <p className="text-slate-400 mb-4">{menuItem.description}</p>
            )}
            <div className="space-y-2 text-slate-300 border-b border-slate-700 pb-4 mb-4">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {menuItem.category || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Price:</span> $
                {(menuItem.price || 0).toFixed(2)}
              </p>
              {menuItem.calories && (
                <p>
                  <span className="font-semibold">Calories:</span>{" "}
                  {menuItem.calories}
                </p>
              )}
            </div>
            <Link
              href={`/dashboard/menu`}
              className="btn-secondary w-full text-center text-sm"
            >
              Edit Item
            </Link>
          </div>

          {/* 3D Model Status */}
          <div className="card">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              3D Model Status
            </h3>
            <div className="space-y-4">
              {menuItem.model3DUrl ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-300 text-sm">
                  ✓ 3D model is available for display
                </div>
              ) : (
                <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-3 text-slate-300 text-sm">
                  No 3D model currently uploaded. You can upload one to showcase
                  your dish in interactive 3D.
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-outline w-full text-sm disabled:opacity-50"
              >
                {refreshing ? "Checking..." : "🔄 Refresh"}
              </button>
            </div>
          </div>

          {/* AR Preview */}
          <div className="card">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              AR Preview
            </h3>
            {menuItem.model3DUrl ? (
              <button className="btn-primary w-full">📱 View in AR</button>
            ) : (
              <button disabled className="btn-secondary w-full opacity-50">
                📱 View in AR (disabled)
              </button>
            )}
            <p className="text-sm text-slate-400 mt-3">
              {menuItem.model3DUrl
                ? "Available now with 3D model"
                : "Upload a 3D model to enable AR preview"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
