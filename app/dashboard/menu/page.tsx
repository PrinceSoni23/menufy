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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8"
      >
        <div className="flex items-center gap-4 mb-4">
          {restaurant?.imageUrl && (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {restaurant?.name}
            </h1>
            <p className="text-slate-400">
              Manage your digital menu and QR code
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-2"
      >
        {[
          { id: "menu" as const, label: "📋 Menu Items", icon: "🍽️" },
          { id: "qrcode" as const, label: "🎟️ QR Code", icon: "📱" },
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-amber-400 text-amber-950 shadow-lg shadow-orange-500/30"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
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
