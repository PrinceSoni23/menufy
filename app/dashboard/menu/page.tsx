"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";
import MenuManager from "@/components/dashboard/MenuManager";
import QRCodeManager from "@/components/dashboard/QRCodeManager";
import { MenuSquare, QrCode, Store } from "lucide-react";

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurant");
  const { restaurants, fetchRestaurants } = useRestaurant();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "qrcode">("menu");

  // Load restaurants on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchRestaurants();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchRestaurants]);

  useEffect(() => {
    if (loading || restaurantId || restaurants.length === 0) {
      return;
    }

    if (restaurants.length === 1) {
      router.replace(`/dashboard/menu?restaurant=${restaurants[0]._id}`);
    }
  }, [loading, restaurantId, restaurants, router]);

  const handleRestaurantSelect = (id: string) => {
    router.replace(`/dashboard/menu?restaurant=${id}`);
  };

  if (!restaurantId) {
    const visibleRestaurants = restaurants.slice(0, 2);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white/85 p-10 text-center shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-100 via-white to-emerald-100 text-violet-600">
          <Store className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-black tracking-tighter text-slate-950">
          {loading ? "Loading restaurants" : "Choose a restaurant"}
        </h3>
        <p className="mx-auto max-w-md text-sm text-slate-600">
          {loading
            ? "Fetching your restaurant list..."
            : restaurants.length === 0
              ? "Add a restaurant to unlock menu management and QR code tools."
              : restaurants.length === 1
                ? "Opening your restaurant menu now..."
                : "Select one restaurant to open its menu and QR code workspace."}
        </p>

        {!loading && restaurants.length > 1 && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {visibleRestaurants.map(restaurant => (
              <motion.button
                key={restaurant._id}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleRestaurantSelect(restaurant._id)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                  Restaurant
                </p>
                <p className="mt-1 text-base font-semibold text-slate-950">
                  {restaurant.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Open menu and QR tools
                </p>
              </motion.button>
            ))}
          </div>
        )}

        {!loading && restaurants.length > 2 && (
          <p className="mt-4 text-xs text-slate-500">
            Showing the first two restaurants. Use the sidebar if you need a
            different location.
          </p>
        )}
      </motion.div>
    );
  }

  const restaurant = restaurants.find((r: any) => r._id === restaurantId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-center gap-4">
          {restaurant?.imageUrl && (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200"
            />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              Menu Workspace
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              {restaurant?.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your digital menu and QR code
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 rounded-3xl border border-slate-200/80 bg-white/85 p-2 shadow-sm backdrop-blur-xl"
      >
        {[
          { id: "menu" as const, label: "Menu Items", icon: MenuSquare },
          { id: "qrcode" as const, label: "QR Code", icon: QrCode },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 text-white shadow-[0_14px_28px_rgba(79,70,229,0.18)]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "menu" && restaurantId && (
            <MenuManager restaurantId={restaurantId} />
          )}
          {activeTab === "qrcode" && restaurantId && (
            <QRCodeManager
              restaurantId={restaurantId}
              restaurantName={restaurant?.name || "Restaurant"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
