"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";
import { MenuItem } from "@/lib/types";
import { DashboardLoader } from "@/components/common/DashboardLoader";
import {
  ArrowLeft,
  Eye,
  ImageIcon,
  Layers3,
  RefreshCw,
  Sparkles,
  Smartphone,
} from "lucide-react";

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
    return <DashboardLoader message="Loading menu item..." />;
  }

  if (!menuItem) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-rose-600">Menu item not found</p>
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left: Image & Conversion Status */}
        <div className="space-y-4 lg:col-span-2">
          {/* Image */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ImageIcon className="h-4 w-4 text-violet-500" />
              2D Image
            </div>
            {menuItem.imageUrl2D ? (
              <img
                src={menuItem.imageUrl2D}
                alt={menuItem.name}
                className="w-full max-h-80 object-cover rounded-2xl"
              />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* 3D Model */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Layers3 className="h-4 w-4 text-violet-500" />
              3D Model
            </div>
            {menuItem.model3DUrl ? (
              <div className="flex h-64 items-center justify-center rounded-2xl bg-linear-to-br from-violet-50 via-white to-sky-50 text-center">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    3D model uploaded
                  </p>
                  <p className="text-xs text-slate-500">
                    {menuItem.model3DUrl}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                <p className="text-slate-600">No 3D model uploaded yet</p>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Upload a .glb, .gltf, or .obj file to display your dish in 3D
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details & Status */}
        <div className="space-y-4">
          {/* Item Details */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
                  Menu Item
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
                  {menuItem.name}
                </h2>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Ready
              </div>
            </div>
            {menuItem.description && (
              <p className="mb-4 text-sm text-slate-600">
                {menuItem.description}
              </p>
            )}
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Category:</span>{" "}
              {menuItem.category || "N/A"}
            </p>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Price:</span> $
              {(menuItem.price || 0).toFixed(2)}
            </p>
            {menuItem.calories && (
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Calories:</span>{" "}
                {menuItem.calories}
              </p>
            )}
            <Link
              href={`/dashboard/menu`}
              className="btn-secondary mt-4 w-full text-center text-sm"
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
