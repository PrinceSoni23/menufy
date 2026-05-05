"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRestaurant } from "@/hooks/useRestaurant";
import { showToast } from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";
import MenuManager from "@/components/dashboard/MenuManager";
import QRCodeManager from "@/components/dashboard/QRCodeManager";

export default function MenuPage() {
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

  if (!restaurantId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12 text-center"
      >
        <div className="text-4xl mb-4">🏪</div>
        <h3 className="text-xl font-bold text-slate-100 mb-2">
          Select a Restaurant
        </h3>
        <p className="text-slate-400">
          Please select a restaurant from the sidebar to manage its menu and QR
          code
        </p>
      </motion.div>
    );
  }

  const restaurant = restaurants.find((r: any) => r._id === restaurantId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 overflow-visible">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {restaurant?.imageUrl ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="relative w-24 h-24 rounded-2xl object-cover border-2 border-slate-800 shadow-xl"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-xl">
              🏪
            </div>
          )}
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              {restaurant?.name}
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">
              Restaurant Management & Digital Menu
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-inner"
      >
        {[
          { id: "menu" as const, label: "Culinary Menu", icon: "✨" },
          { id: "qrcode" as const, label: "QR Portal", icon: "📱" },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-orange-400/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="tracking-wide">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <div className="bg-transparent mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
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
    </div>
  );
}
