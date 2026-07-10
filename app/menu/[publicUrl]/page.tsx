"use client";

import { createElement, useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import { DashboardLoader } from "@/components/common/DashboardLoader";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, Order, OrderStatus } from "@/lib/types";
import Script from "next/script";
import { API_BASE_URL } from "@/lib/constants";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  getCachedResponse,
  putCachedResponse,
  fetchViaProxy,
} from "@/lib/mediaCache";

const API_BASE =
  API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type CachedPublicMenuData = {
  publicUrl: string;
  restaurantId: string;
  restaurant: any;
  menuItems: MenuItem[];
  timestamp: number;
};

const PUBLIC_MENU_CACHE_PREFIX = "public-menu-cache-v1";
const PUBLIC_MENU_CACHE_TTL = 1000 * 60 * 5;

const getPublicMenuCacheKey = (publicUrl: string) =>
  `${PUBLIC_MENU_CACHE_PREFIX}:${publicUrl.toLowerCase()}`;

const readCachedMenuPayload = (
  publicUrl: string,
): CachedPublicMenuData | null => {
  if (typeof window === "undefined") return null;

  try {
    const key = getPublicMenuCacheKey(publicUrl);
    const raw =
      window.sessionStorage.getItem(key) || window.localStorage.getItem(key);

    if (!raw) return null;

    const payload = JSON.parse(raw) as CachedPublicMenuData;
    if (!payload?.restaurantId || !Array.isArray(payload.menuItems))
      return null;
    if (Date.now() - payload.timestamp > PUBLIC_MENU_CACHE_TTL) {
      window.sessionStorage.removeItem(key);
      window.localStorage.removeItem(key);
      return null;
    }

    return payload;
  } catch (error) {
    console.warn("Failed to read cached public menu payload", error);
    return null;
  }
};

const writeCachedMenuPayload = (
  publicUrl: string,
  payload: CachedPublicMenuData,
) => {
  if (typeof window === "undefined") return;

  try {
    const key = getPublicMenuCacheKey(publicUrl);
    const serialized = JSON.stringify(payload);
    window.sessionStorage.setItem(key, serialized);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn("Failed to write cached public menu payload", error);
  }
};

const trackAnalyticsEvent = (
  payload: Record<string, unknown>,
  baseUrl = API_BASE,
) => {
  if (typeof window === "undefined") return;

  const endpoint = `${baseUrl}/analytics/track`;
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(error => {
      console.warn("Failed to track analytics event:", error);
    });
  } catch (error) {
    console.warn("Failed to track analytics event:", error);
  }
};

const DEFAULT_MENU_BACKGROUND = "/download%20(5).jpeg";
const CATEGORY_BACKGROUNDS: Array<{ match: RegExp; src: string }> = [
  { match: /\b(starter|appetizer|snack|salad)s?\b/i, src: "/starters.jpeg" },
  { match: /\b(main|mains|main course|entree|entrees)\b/i, src: "/mains.jpeg" },
  {
    match: /\b(dessert|desserts|sweet|sweets|cake|pastry)\b/i,
    src: "/desserts.jpeg",
  },
  {
    match:
      /\b(drink|drinks|beverage|beverages|juice|soda|coffee|tea|mocktail|cocktail|beer|wine|smoothie)\b/i,
    src: "/drinks.jpeg",
  },
];

const getMenuBackgroundImage = (category?: string | null) => {
  const normalizedCategory = category?.trim() || "";
  if (!normalizedCategory) return DEFAULT_MENU_BACKGROUND;

  const matchedBackground = CATEGORY_BACKGROUNDS.find(({ match }) =>
    match.test(normalizedCategory),
  );

  return matchedBackground?.src || DEFAULT_MENU_BACKGROUND;
};

const MenuBackdrop = ({ category }: { category?: string | null }) => {
  // Kept for compatibility with existing category-based background logic,
  // but rendered as a quiet cream backdrop to match the reference UI
  // (a clean, bright surface rather than a hazy photo backdrop).
  void category;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FBF8F2]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(31,75,63,0.07) 0, transparent 32%), radial-gradient(circle at 100% 10%, rgba(217,183,102,0.10) 0, transparent 28%)",
        }}
      />
    </div>
  );
};

const createStableId = (prefix: "device" | "session") =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getOrderStatusMessage = (status: OrderStatus) => {
  if (status === "confirmed") {
    return "Your order was accepted by the restaurant.";
  }

  if (status === "preparing") {
    return "The restaurant has started preparing your order.";
  }

  if (status === "completed") {
    return "Your order has been completed.";
  }

  if (status === "cancelled") {
    return "Your order was cancelled.";
  }

  return "Your order is waiting for confirmation.";
};

// Subcomponents

const IntroCinematic = ({ onComplete }: { onComplete: () => void }) => {
  const particleCount = 12;
  const particles = Array.from({ length: particleCount });

  return (
    <motion.div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-transparent overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.8, delay: 0.55, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent"></div>

      {/* Animated background elements */}
      <motion.div
        className="absolute w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Particle burst on emoji */}
        <AnimatePresence>
          {particles.map((_, i) => {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, x],
                  y: [0, y],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 1.4,
                  delay: 2.0,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </AnimatePresence>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-28 h-28 border-2 border-emerald-400 rounded-full flex items-center justify-center p-2 mb-8 shadow-2xl shadow-emerald-200/50 bg-white/90 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-6xl will-change-transform"
          >
            🍽️
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4"
        >
          {"MENU".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, rotate: -20 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                delay: 0.3 + i * 0.08,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="h-1 w-40 bg-linear-to-r from-emerald-400 via-green-500 to-teal-400 rounded-full shadow-lg shadow-emerald-400/50"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-slate-600 mt-6 font-semibold tracking-[0.2em] text-xs"
        >
          EXPLORE CULINARY EXCELLENCE
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const LoadingCinematic = () => {
  const chips = ["Fresh picks", "Fast prep", "Gen-Z vibes"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/50 text-slate-900">
      <MenuBackdrop category={null} />
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(16,185,129,0.16) 0, transparent 30%), radial-gradient(circle at top right, rgba(59,130,246,0.10) 0, transparent 26%), radial-gradient(circle at bottom center, rgba(34,197,94,0.12) 0, transparent 28%)",
          }}
        />
        <motion.div
          className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl"
          animate={{ y: [0, 28, 0], x: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-36 -right-20 w-96 h-96 rounded-full bg-sky-300/15 blur-3xl"
          animate={{ y: [0, -24, 0], x: [0, -16, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-4xl border border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_30px_120px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-slate-200/70">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">
              Preparing your menu
            </div>
            <div className="mt-6 flex items-center gap-5">
              <motion.div
                className="relative w-24 h-24 shrink-0 rounded-full bg-linear-to-br from-white via-emerald-50 to-emerald-100 border border-emerald-200 shadow-[0_16px_50px_rgba(16,185,129,0.22)] flex items-center justify-center"
                animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute inset-2 rounded-full border border-emerald-300/70"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border border-dashed border-emerald-300/70"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-4xl"
                >
                  🍽️
                </motion.span>
              </motion.div>

              <div className="min-w-0 flex-1">
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900"
                >
                  Crafting a premium food experience
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="mt-2 text-sm sm:text-base text-slate-600 font-semibold max-w-xl"
                >
                  Loading the freshest dishes, the best visuals, and a smooth
                  flow designed to feel instant, polished, and made for Gen-Z.
                </motion.p>
              </div>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-7 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {["Fast", "Fresh", "Bold"].map((label, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.08, duration: 0.5 }}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-4 text-center shadow-sm"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                    {label}
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-linear-to-r from-emerald-300 via-emerald-500 to-teal-400" />
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {[74, 88, 64].map((width, idx) => (
                <motion.div
                  key={width}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.08, duration: 0.45 }}
                  className="h-16 rounded-3xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 border border-emerald-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-emerald-400 via-green-500 to-teal-400"
                        initial={{ width: "24%" }}
                        animate={{ width: `${width}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.7 + idx * 0.12,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {chips.map((chip, idx) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.85 + idx * 0.08, duration: 0.45 }}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-7">
            <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-400 via-green-500 to-teal-400"
                initial={{ x: "-20%", width: "20%" }}
                animate={{ x: ["-20%", "120%"], width: ["20%", "26%", "20%"] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MenuSkeleton = () => {
  const shimmerClasses =
    "relative overflow-hidden bg-slate-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.7s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/80 before:to-transparent";

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/40 text-slate-900">
      <MenuBackdrop category={null} />
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(16,185,129,0.12) 0, transparent 30%), radial-gradient(circle at top right, rgba(59,130,246,0.08) 0, transparent 26%), radial-gradient(circle at bottom center, rgba(34,197,94,0.10) 0, transparent 28%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-140 mx-auto lg:max-w-5xl px-4 sm:px-6 pt-8 pb-40 animate-pulse">
        <div className="rounded-4xl border border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_30px_120px_rgba(15,23,42,0.08)] p-4 sm:p-6">
          <div className="h-5 w-44 rounded-full bg-emerald-100" />
          <div className="mt-5 h-12 w-3/4 max-w-xl rounded-3xl bg-slate-100" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-slate-100" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map(idx => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="h-3 w-16 rounded-full bg-slate-200" />
                <div className="mt-3 h-2 rounded-full bg-emerald-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-4xl border border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.06)] p-4 sm:p-5">
          <div className="h-4 w-36 rounded-full bg-slate-100" />
          <div className="mt-4 h-14 rounded-full bg-slate-100" />
          <div className="mt-4 flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-10 w-20 rounded-full bg-slate-100" />
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-4xl border border-white/80 bg-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.06)] p-4 sm:p-5">
          <div className="h-4 w-40 rounded-full bg-slate-100" />
          <div className="mt-4 flex gap-3 overflow-hidden pb-1">
            {[1, 2, 3, 4, 5].map(idx => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="h-18 w-18 rounded-full bg-slate-100" />
                <div className="h-3 w-14 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className="overflow-hidden rounded-4xl border border-white/80 bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="aspect-4/3 bg-slate-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                <div className="h-3 w-1/2 rounded-full bg-slate-100" />
                <div className="h-3 w-full rounded-full bg-slate-100" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-14 rounded-full bg-slate-100" />
                  <div className="h-9 w-16 rounded-full bg-emerald-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-6 h-18 rounded-4xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(16,185,129,0.16)]" />
      </div>
    </div>
  );
};

export default function PublicMenuPage() {
  const params = useParams();
  const publicUrl = params?.publicUrl as string;

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [introDone, setIntroDone] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState(1);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "3d">("details");
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [guestOrder, setGuestOrder] = useState<Order | null>(null);
  const [orderPopup, setOrderPopup] = useState<{
    order: Order;
    message: string;
  } | null>(null);
  const [trackedGuestOrderId, setTrackedGuestOrderId] = useState<string | null>(
    null,
  );
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    customerPhone: "",
    customerRemark: "",
    customerCookingRequest: "",
  });
  const [vegOnly, setVegOnly] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const modelViewerRef = useRef<any>(null);
  const trackedArViewRef = useRef<string | null>(null);
  const trackedMenuViewRef = useRef<string | null>(null);
  const trackedOrderStatusRef = useRef<OrderStatus | null>(null);
  const deviceIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>("");
  // Note: scans will be sent on every public menu load/refresh

  const orderTrackingStorageKey = restaurantId
    ? `ar-menu-guest-order-${restaurantId}`
    : null;

  const persistGuestOrder = (order: Order | null) => {
    if (typeof window === "undefined" || !orderTrackingStorageKey) return;

    if (!order) {
      localStorage.removeItem(orderTrackingStorageKey);
      return;
    }

    localStorage.setItem(
      orderTrackingStorageKey,
      JSON.stringify({ orderId: order._id, status: order.status }),
    );
  };

  const getOrderItemSummary = (order: Order) => {
    const names = (order.lineItems || [])
      .map(item => item.name)
      .filter(Boolean);

    if (names.length === 0) {
      return order.orderNumber || `Order ${order._id.slice(-6).toUpperCase()}`;
    }

    if (names.length === 1) {
      return names[0];
    }

    if (names.length === 2) {
      return `${names[0]} and ${names[1]}`;
    }

    return `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
  };

  const showGuestOrderUpdate = (order: Order, message: string) => {
    setGuestOrder(order);
    setOrderPopup({ order, message });
    showToast(message, "success", 0);
    persistGuestOrder(order);
    setTrackedGuestOrderId(order._id);
  };

  const openAddMoreItems = () => {
    setCheckoutOpen(false);
    setSelectedDish(null);
    showToast("Add another item whenever you're ready", "info", 2500);
  };

  useEffect(() => {
    if (!deviceIdRef.current) {
      const storageKey = "ar-menu-device-id";
      const existing = localStorage.getItem(storageKey);
      if (existing && existing !== "undefined" && existing !== "null") {
        deviceIdRef.current = existing;
      } else {
        const created = createStableId("device");
        localStorage.setItem(storageKey, created);
        deviceIdRef.current = created;
      }
    }

    if (!sessionIdRef.current) {
      sessionIdRef.current = createStableId("session");
    }

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }
  }, []);

  const getOrCreateDeviceId = () => {
    if (typeof window === "undefined") return "server";

    const storageKey = "ar-menu-device-id";
    const existing = localStorage.getItem(storageKey);
    if (existing && existing !== "undefined" && existing !== "null") {
      return existing;
    }

    const created = createStableId("device");
    localStorage.setItem(storageKey, created);
    return created;
  };

  // Resolve model reference (filename or full URL) to a public URL
  const resolveModelUrl = (ref?: string) => {
    if (!ref) return "";
    if (/^https?:\/\//i.test(ref)) return ref;
    if (/^data:/i.test(ref)) return ref;
    const apiRoot = API_BASE.replace(/\/api\/?$/i, "");
    // If value already looks like an uploads path, join with apiRoot
    if (ref.startsWith("/uploads") || ref.startsWith("uploads/")) {
      const r = ref.startsWith("/") ? `${apiRoot}${ref}` : `${apiRoot}/${ref}`;
      console.log("[3D Model] resolved (uploads path)", { ref, resolved: r });
      return r;
    }

    // If the ref looks like a filename, determine whether it's a model or image
    const ext = (ref.split("?")[0].match(/\.[0-9a-zA-Z]+$/) || [
      "",
    ])[0].toLowerCase();
    if (ext === ".glb" || ext === ".gltf" || ext === ".obj") {
      const resolvedModel = `${apiRoot}/uploads/3d-models/${ref}`;
      console.log("[3D Model] resolved (filename -> 3d-models)", {
        ref,
        resolved: resolvedModel,
      });
      return resolvedModel;
    }

    // Default to images path for other filename-like refs
    const resolved = `${apiRoot}/uploads/images/${ref}`;
    console.log("[3D Model] resolved (filename -> images)", { ref, resolved });
    return resolved;
  };

  // Client-side cached URLs for selected dish media (blob URLs when proxied)
  const [cachedImageSrc, setCachedImageSrc] = useState<string | null>(null);
  const [cachedModelSrc, setCachedModelSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let imageBlobUrl: string | null = null;
    let modelBlobUrl: string | null = null;

    async function loadCached() {
      if (cancelled) return;
      setCachedImageSrc(null);
      setCachedModelSrc(null);
      if (!selectedDish) return;

      const apiBase = API_BASE.replace(/\/$/, "");

      if (selectedDish.imageUrl2D) {
        try {
          if (cancelled) return;
          const cachedImage = await getCachedResponse(selectedDish.imageUrl2D);
          if (cancelled) return;
          if (cachedImage) {
            console.info(
              `[MenuPage] image FRONTEND CACHE -> ${selectedDish.name}`,
            );
            const blob = await cachedImage.blob();
            imageBlobUrl = URL.createObjectURL(blob);
            if (!cancelled) setCachedImageSrc(imageBlobUrl);
          } else {
            const resp = await fetchViaProxy(apiBase, selectedDish.imageUrl2D);
            if (cancelled) return;
            if (resp.ok) {
              const sourceLabel =
                resp.headers.get("X-Media-Source") || "cloudinary";
              console.info(
                `[MenuPage] image ${sourceLabel.toUpperCase()} -> ${selectedDish.name}`,
              );
              await putCachedResponse(selectedDish.imageUrl2D, resp.clone());
              if (cancelled) return;
              const blob = await resp.blob();
              imageBlobUrl = URL.createObjectURL(blob);
              if (!cancelled) setCachedImageSrc(imageBlobUrl);
            } else {
              console.warn(
                `[MenuPage] image proxy failed -> direct source ${selectedDish.name}`,
              );
              if (!cancelled) setCachedImageSrc(selectedDish.imageUrl2D);
            }
          }
        } catch (err) {
          if (!cancelled) {
            console.warn(
              `[MenuPage] image fetch error -> direct source ${selectedDish.name}`,
              err,
            );
            setCachedImageSrc(selectedDish.imageUrl2D);
          }
        }
      }

      if (selectedDish.model3DUrl) {
        try {
          if (cancelled) return;
          const cachedModel = await getCachedResponse(selectedDish.model3DUrl);
          if (cancelled) return;
          if (cachedModel) {
            console.info(
              `[MenuPage] model FRONTEND CACHE -> ${selectedDish.name}`,
            );
            const blob = await cachedModel.blob();
            modelBlobUrl = URL.createObjectURL(blob);
            if (!cancelled) setCachedModelSrc(modelBlobUrl);
          } else {
            const resp = await fetchViaProxy(apiBase, selectedDish.model3DUrl);
            if (cancelled) return;
            if (resp.ok) {
              const sourceLabel =
                resp.headers.get("X-Media-Source") || "cloudinary";
              console.info(
                `[MenuPage] model ${sourceLabel.toUpperCase()} -> ${selectedDish.name}`,
              );
              await putCachedResponse(selectedDish.model3DUrl, resp.clone());
              if (cancelled) return;
              const blob = await resp.blob();
              modelBlobUrl = URL.createObjectURL(blob);
              if (!cancelled) setCachedModelSrc(modelBlobUrl);
            } else {
              console.warn(
                `[MenuPage] model proxy failed -> direct source ${selectedDish.name}`,
              );
              if (!cancelled) setCachedModelSrc(selectedDish.model3DUrl);
            }
          }
        } catch (err) {
          if (!cancelled) {
            console.warn(
              `[MenuPage] model fetch error -> direct source ${selectedDish.name}`,
              err,
            );
            setCachedModelSrc(selectedDish.model3DUrl);
          }
        }
      }
    }

    loadCached();

    return () => {
      cancelled = true;
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
      if (modelBlobUrl) URL.revokeObjectURL(modelBlobUrl);
    };
  }, [selectedDish]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      deviceIdRef.current = getOrCreateDeviceId();
      // sessionId is per-page-load (new on hard refresh)
      sessionIdRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  }, []);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top on mount and route change
  useEffect(() => {
    // Scroll immediately
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Also scroll again after a tiny delay to override any animations
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);

      // And one more time after paint
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, [introDone]);

  useEffect(() => {
    if (
      !restaurantId ||
      typeof window === "undefined" ||
      !orderTrackingStorageKey
    ) {
      return;
    }

    const rawTracking = localStorage.getItem(orderTrackingStorageKey);
    if (!rawTracking) {
      setGuestOrder(null);
      trackedOrderStatusRef.current = null;
      return;
    }

    try {
      const parsed = JSON.parse(rawTracking) as {
        orderId?: string;
        status?: OrderStatus;
      };
      if (parsed.status) {
        trackedOrderStatusRef.current = parsed.status;
      }
      if (parsed.orderId) {
        setTrackedGuestOrderId(parsed.orderId);
      }
    } catch {
      localStorage.removeItem(orderTrackingStorageKey);
      setGuestOrder(null);
      trackedOrderStatusRef.current = null;
    }
  }, [restaurantId, orderTrackingStorageKey]);

  useEffect(() => {
    if (!restaurantId || !trackedGuestOrderId) {
      return;
    }

    const fetchGuestOrder = async () => {
      try {
        const orderQuery = `&orderId=${encodeURIComponent(trackedGuestOrderId)}`;
        const response = await fetch(
          `${API_BASE}${API_ENDPOINTS.ORDER_GUEST_STATUS}?restaurantId=${encodeURIComponent(restaurantId)}${orderQuery}`,
        );
        const payload = await response.json();
        const order = payload?.data as Order | null;

        if (!order) {
          return;
        }

        const previousStatus = trackedOrderStatusRef.current;
        trackedOrderStatusRef.current = order.status;
        setGuestOrder(order);

        if (previousStatus !== order.status) {
          if (order.status === "confirmed") {
            showGuestOrderUpdate(
              order,
              "Your order was accepted by the restaurant.",
            );
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to load guest order status:", error);
      }
    };

    void fetchGuestOrder();
    const interval = window.setInterval(() => {
      void fetchGuestOrder();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [restaurantId, trackedGuestOrderId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setModelLoadError(null);
      setModelLoading(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedDish?._id, selectedDish?.model3DUrl, activeTab]);

  useEffect(() => {
    const trackModelView = async () => {
      if (!selectedDish?._id || activeTab !== "3d") return;
      if (trackedArViewRef.current === selectedDish._id) return;

      trackedArViewRef.current = selectedDish._id;

      try {
        await fetch(`${API_BASE}/menu/${selectedDish._id}/ar-view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            deviceType: "Web",
            deviceId: deviceIdRef.current,
          }),
        });
      } catch (error) {
        console.warn("Failed to track 3D model view:", error);
      }
    };

    void trackModelView();
  }, [activeTab, selectedDish?._id]);

  useEffect(() => {
    if (typeof window === "undefined" || !publicUrl || !restaurantId) return;

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        trackAnalyticsEvent({
          restaurantId,
          eventType: "view_menu",
          deviceType: "Web",
          sessionId: sessionIdRef.current,
          deviceId: deviceIdRef.current,
          source: "pageshow",
        });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [publicUrl, restaurantId]);

  // Load data
  useEffect(() => {
    const loadMenuData = async () => {
      if (!publicUrl) {
        setError("Invalid menu URL");
        setLoading(false);
        return;
      }

      const cachedPayload = readCachedMenuPayload(publicUrl);
      if (cachedPayload) {
        setRestaurantId(cachedPayload.restaurantId);
        setRestaurant(cachedPayload.restaurant);
        setMenuItems(cachedPayload.menuItems);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
        setError(null);

        const qrResponse = await fetch(
          `${API_BASE}/qrcode/public/${publicUrl}`,
        );
        const qrData = await qrResponse.json();
        if (!qrResponse.ok || !qrData.data?.restaurantId) {
          throw new Error(qrData.message || "Restaurant not found");
        }

        const rId = qrData.data.restaurantId;
        setRestaurantId(rId);

        trackAnalyticsEvent({
          restaurantId: rId,
          eventType: "view_menu",
          deviceType: "Web",
          sessionId: sessionIdRef.current,
          deviceId: deviceIdRef.current,
          source: "load",
        });

        const qrCodeToken = qrData.data?.qrCode?.code;
        if (qrCodeToken) {
          void fetch(`${API_BASE}/qrcode/scan/${qrCodeToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId: deviceIdRef.current,
              sessionId: sessionIdRef.current,
            }),
            keepalive: true,
          }).catch(scanError => {
            console.warn("Failed to track QR scan:", scanError);
          });
        }

        const [restaurantResult, menuResult] = await Promise.allSettled([
          fetch(`${API_BASE}/restaurants/public/${publicUrl}`),
          fetch(`${API_BASE}/menu/public/${rId}`),
        ]);

        let nextRestaurant: any = null;
        if (
          restaurantResult.status === "fulfilled" &&
          restaurantResult.value.ok
        ) {
          const restaurantData = await restaurantResult.value.json();
          nextRestaurant = restaurantData?.data || restaurantData;
          setRestaurant(nextRestaurant);
        } else if (restaurantResult.status === "fulfilled") {
          console.warn(
            "Could not load restaurant details:",
            restaurantResult.value.status,
          );
        }

        if (menuResult.status === "fulfilled" && menuResult.value.ok) {
          const menuData = await menuResult.value.json();
          const items = menuData?.data?.menuItems || menuData?.data || [];
          const itemsArray = Array.isArray(items) ? items : [];
          const typedItems = itemsArray as Array<{
            _id?: string;
            id?: string;
            name?: string;
            category?: string;
            price?: number;
            imageUrl2D?: string;
            model3DUrl?: string | null;
          }>;
          const normalizedItems = typedItems.map((item, index) => ({
            ...item,
            _id:
              item._id?.trim() ||
              item.id?.trim() ||
              `menu-item-${rId}-${index}-${(item.name || "item").replace(/\s+/g, "-").toLowerCase()}-${(item.category || "cat").replace(/\s+/g, "-").toLowerCase()}-${Math.round(Number(item.price || 0))}`,
          }));

          console.log("[Menu]", {
            itemCount: normalizedItems.length,
            itemsWithModels: normalizedItems.filter(item => item.model3DUrl)
              .length,
          });
          console.log(
            "[Menu] sample media URLs",
            normalizedItems.slice(0, 5).map(it => ({
              id: it._id,
              image: it.imageUrl2D,
              model: it.model3DUrl,
            })),
          );

          setMenuItems(normalizedItems as MenuItem[]);
          writeCachedMenuPayload(publicUrl, {
            publicUrl,
            restaurantId: rId,
            restaurant: nextRestaurant,
            menuItems: normalizedItems as MenuItem[],
            timestamp: Date.now(),
          });
        } else {
          throw new Error(
            menuResult.status === "fulfilled"
              ? "Failed to load menu items"
              : "Menu request failed",
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load menu";
        if (!cachedPayload) {
          setError(errorMsg);
          showToast(errorMsg, "error");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [publicUrl]);

  // Data processing
  const categories = Array.from(
    new Set(menuItems.map(item => item.category || "Other")),
  ).sort();
  const currentCategory = categories[selectedCategoryIndex] || "all";

  const handleTurnPage = (idx: number) => {
    if (idx === selectedCategoryIndex) return;
    setTurnDirection(idx > selectedCategoryIndex ? 1 : -1);
    setSelectedCategoryIndex(idx);
  };

  // Filtered items logic
  let displayItems = menuItems.filter(
    item => item.category === currentCategory,
  );
  if (searchQuery) {
    displayItems = menuItems.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }
  if (vegOnly) {
    displayItems = displayItems.filter(item => !!item.isVegetarian);
  }

  // Animation Variants
  const pageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? 30 : -30,
      x: dir > 0 ? 50 : -50,
      scale: 0.95,
      filter: "blur(4px)",
    }),
    center: {
      opacity: 1,
      rotateY: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      rotateY: dir < 0 ? 30 : -30,
      x: dir < 0 ? 50 : -50,
      scale: 0.95,
      filter: "blur(4px)",
      transition: { duration: 0.4 },
    }),
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i =>
          i.item._id === item._id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { item, qty: 1 }];
    });
    if (restaurantId) {
      trackAnalyticsEvent({
        restaurantId,
        eventType: "add_to_cart",
        deviceType: "Web",
        sessionId: sessionIdRef.current,
        deviceId: deviceIdRef.current,
        menuItemId: item._id,
      });
    }
    showToast(`${item.name} added`, "success");
    setSelectedDish(null);
    setCheckoutOpen(true);
  };

  const increaseCartQty = (itemId: string) => {
    setCart(prev =>
      prev.map(entry =>
        entry.item._id === itemId ? { ...entry, qty: entry.qty + 1 } : entry,
      ),
    );
  };

  const decreaseCartQty = (itemId: string) => {
    setCart(prev =>
      prev
        .map(entry =>
          entry.item._id === itemId ? { ...entry, qty: entry.qty - 1 } : entry,
        )
        .filter(entry => entry.qty > 0),
    );
  };

  const cartTotal = cart.reduce(
    (acc, curr) => acc + curr.item.price * curr.qty,
    0,
  );
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.qty, 0);

  const submitGuestOrder = async () => {
    if (!restaurantId) {
      showToast("Restaurant details are not available", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (checkoutForm.customerName.trim().length < 2) {
      showToast("Please enter your name", "error");
      return;
    }

    if (!/^[0-9+\-()\s]{8,20}$/.test(checkoutForm.customerPhone.trim())) {
      showToast("Please enter a valid mobile number", "error");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await fetch(`${API_BASE}/orders/guest-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          sessionId: sessionIdRef.current,
          customerName: checkoutForm.customerName.trim(),
          customerPhone: checkoutForm.customerPhone.trim(),
          customerRemark: checkoutForm.customerRemark.trim(),
          customerCookingRequest: checkoutForm.customerCookingRequest.trim(),
          items: cart.map(entry => ({
            menuItemId: entry.item._id,
            quantity: entry.qty,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to place order");
      }

      const placedOrder = payload.data as Order;

      trackedOrderStatusRef.current = placedOrder.status;
      setTrackedGuestOrderId(placedOrder._id);
      showGuestOrderUpdate(
        placedOrder,
        "Your order has been placed successfully.",
      );
      showToast("Order placed successfully", "success");

      setCart([]);
      setCheckoutOpen(false);
      setCheckoutForm({
        customerName: "",
        customerPhone: "",
        customerRemark: "",
        customerCookingRequest: "",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      showToast(message, "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleSelectDish = (item: MenuItem) => {
    if (restaurantId) {
      trackAnalyticsEvent({
        restaurantId,
        eventType: "view_menu_item",
        deviceType: "Web",
        sessionId: sessionIdRef.current,
        deviceId: deviceIdRef.current,
        menuItemId: item._id,
      });

      void fetch(`${API_BASE}/menu/${item._id}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          deviceId: deviceIdRef.current,
          deviceType: "Web",
        }),
        keepalive: true,
      }).catch(error => {
        console.warn("Failed to track menu item view:", error);
      });
    }
    setSelectedDish(item);
  };

  const openModelView = () => {
    if (selectedDish?._id) {
      trackedArViewRef.current = null;
    }
    setActiveTab("3d");
    setModelLoading(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <DashboardLoader message="Loading menu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="text-5xl border border-red-200 rounded-full p-4 mb-6 bg-red-50">
          ⚠️
        </div>
        <h2 className="text-slate-900 text-3xl font-bold mb-2">Oops!</h2>
        <p className="text-slate-600 text-lg mb-8 font-medium text-center">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 border-2 border-emerald-500 text-emerald-600 rounded-full uppercase tracking-wider text-sm font-bold hover:bg-emerald-500 hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <MenuBackdrop category={currentCategory} />
      {!introDone && <IntroCinematic onComplete={() => setIntroDone(true)} />}

      <div className="relative z-10 min-h-screen bg-[#FBF8F2] text-slate-900 font-sans selection:bg-emerald-800 selection:text-white overflow-x-hidden pb-40">
        <div className="max-w-140 mx-auto lg:max-w-5xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative pt-8 pb-6 px-4 sm:px-6"
          >
            <div className="w-full flex justify-center mb-6 pointer-events-auto">
              <div className="relative w-full max-w-3xl">
                <div className="absolute left-0 right-0 top-0 -translate-y-3">
                  <div className="mx-auto w-full max-w-3xl h-4 bg-emerald-100 rounded-full shadow-inner" />
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-6 h-6 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M12 2c1.5 2.2 4.5 5 6.5 6.5-1.2 2-4.3 4.6-6.5 6.5-2.2-1.9-4.9-4.9-6.5-6.5C7.1 7 10.5 3.9 12 2z"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>

                  <div className="inline-flex items-center gap-4 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-3xl shadow-lg border border-emerald-50">
                    <h2
                      className="text-center font-extrabold italic tracking-tight text-2xl sm:text-3xl text-[#123b2f]"
                      style={{
                        fontFamily:
                          "'Plus Jakarta Sans', ui-sans-serif, system-ui",
                      }}
                    >
                      {restaurant?.name || ""}
                    </h2>
                  </div>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-6 h-6 text-emerald-500 rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M12 2c1.5 2.2 4.5 5 6.5 6.5-1.2 2-4.3 4.6-6.5 6.5-2.2-1.9-4.9-4.9-6.5-6.5C7.1 7 10.5 3.9 12 2z"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute left-0 right-0 bottom-0 translate-y-3">
                  <div className="mx-auto w-full max-w-3xl h-2 bg-emerald-50 rounded-full opacity-80" />
                </div>
              </div>
            </div>
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1F4B3F]">
                  <span className="text-base">🌿</span>
                  <span className="font-serif italic tracking-wide">
                    Good food, good mood
                  </span>
                </div>

                <div className="space-y-2 max-w-xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium italic tracking-tight leading-[1.05] text-slate-950">
                    Freshly made.
                    <br />
                    Especially for <span className="text-[#1F4B3F]">you.</span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: "🕐", label: "Fast Delivery", value: "10-15 min" },
                    { icon: "🌿", label: "Freshly Made", value: "Daily" },
                    { icon: "⭐", label: "Top Rated", value: "4.5+" },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm"
                    >
                      <span className="text-base">{stat.icon}</span>
                      <div className="leading-tight">
                        <p className="text-[10px] font-medium text-slate-400">
                          {stat.label}
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-full border border-slate-200 bg-white shadow-sm px-2 py-2 flex items-center gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <input
                      aria-label="Search menu"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search for paneer, thali, biryani..."
                      className="w-full rounded-full bg-transparent pl-11 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg
                        className="w-4.5 h-4.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 21l-5.2-5.2" />
                        <circle cx="10" cy="10" r="6" />
                      </svg>
                    </span>
                  </div>
                  <button
                    aria-label="Filter menu"
                    className="h-10 w-10 shrink-0 rounded-full bg-[#1F4B3F] text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <svg
                      className="w-4.5 h-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
                <img
                  src={getMenuBackgroundImage(currentCategory)}
                  alt="Hero"
                  className="w-full h-[340px] sm:h-[400px] object-cover"
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-4 shadow-xl">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#1F4B3F]">
                      Today&apos;s Special{" "}
                      <span className="text-red-500">♥</span>
                    </p>
                    <p className="mt-1.5 text-base font-bold text-slate-900">
                      {menuItems[0]?.name || "Tiramisu"}
                    </p>
                    <p className="text-lg font-black text-[#1F4B3F]">
                      ₹{menuItems[0]?.price ?? 345}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {[0, 1, 2, 3].map(dot => (
                    <span
                      key={dot}
                      className={`h-1.5 rounded-full transition-all ${
                        dot === 1 ? "w-4 bg-[#1F4B3F]" : "w-1.5 bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.header>

          {!searchQuery && categories.length > 0 && (
            <div className="px-4 pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-bold text-slate-900">
                  Popular categories
                </p>
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#1F4B3F]">
                  View all
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 4l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="mb-3 flex gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                  Classy dishes
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                  Sleek picks
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                  Fast prep
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-emerald-100 text-emerald-700 text-xs font-semibold shadow-sm">
                  Fresh drop
                </span>
              </div>

              <div className="flex gap-5 overflow-x-auto overflow-y-visible hide-scrollbar pb-2 pl-3 pt-2">
                {categories.map((cat, idx) => {
                  const sampleItem = menuItems.find(
                    item => (item.category || "Other") === cat,
                  );
                  const itemCount = menuItems.filter(
                    item => (item.category || "Other") === cat,
                  ).length;
                  const isActive = cat === currentCategory;
                  return (
                    <motion.button
                      key={`rail-${cat}`}
                      onClick={() => handleTurnPage(categories.indexOf(cat))}
                      className="shrink-0 flex flex-col items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.08 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <div
                        className={`relative w-16 h-16 rounded-full overflow-hidden ${isActive ? "ring-4 ring-emerald-500 ring-offset-2 shadow-lg" : "ring-1 ring-slate-200 ring-offset-2"} transition-all duration-300`}
                      >
                        {sampleItem?.imageUrl2D ? (
                          <img
                            src={sampleItem.imageUrl2D}
                            alt={cat}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-emerald-100 via-amber-100 to-rose-100 flex items-center justify-center text-emerald-700 font-black">
                            {cat.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        {/* small badge removed to show image cleanly */}
                      </div>
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${isActive ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {cat}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          <div className="relative mt-10 px-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-base font-bold text-slate-900">
                {searchQuery ? "Search results" : "Recommended for you"}
              </p>
              <button
                onClick={() => cart.length > 0 && setCheckoutOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1F4B3F] shadow-sm"
              >
                {cartItemCount} items
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </button>
            </div>
            <AnimatePresence custom={turnDirection} mode="wait">
              <motion.div
                key={searchQuery ? "search" : currentCategory}
                custom={turnDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="origin-center"
              >
                {displayItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {displayItems.map((item, idx) => {
                      const cartEntry = cart.find(
                        entry => entry.item._id === item._id,
                      );
                      const accent = idx % 4 === 1;
                      const badge =
                        idx % 4 === 0
                          ? "Bestseller"
                          : idx % 4 === 1
                            ? "Chef's Choice"
                            : null;

                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx, 8) * 0.05 }}
                          whileHover={{ y: -4 }}
                          className={`group rounded-[1.75rem] overflow-hidden border shadow-sm hover:shadow-lg transition-shadow ${
                            accent
                              ? "border-[#1F4B3F] bg-[#1F4B3F] text-white"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectDish(item)}
                            className="relative block w-full aspect-square overflow-hidden"
                          >
                            <img
                              src={item.imageUrl2D || "/placeholder.jpg"}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span
                              className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
                              aria-hidden="true"
                            >
                              ♥
                            </span>
                            {badge && (
                              <span
                                className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                  idx % 4 === 0
                                    ? "bg-amber-400 text-amber-950"
                                    : "bg-white/95 text-[#1F4B3F]"
                                }`}
                              >
                                {idx % 4 === 0 ? "⭐" : ""} {badge}
                              </span>
                            )}
                          </button>

                          <div className="p-3.5 space-y-1.5">
                            <p
                              className={`text-sm font-bold truncate ${accent ? "text-white" : "text-slate-900"}`}
                            >
                              {item.name}
                            </p>
                            <p
                              className={`text-xs leading-snug line-clamp-2 ${accent ? "text-white/75" : "text-slate-500"}`}
                            >
                              {item.description || "Freshly prepared for you"}
                            </p>
                            <p
                              className={`text-sm font-black ${accent ? "text-white" : "text-slate-900"}`}
                            >
                              ₹{Number(item.price).toFixed(0)}
                            </p>

                            {cartEntry ? (
                              <div
                                className={`mt-1 flex items-center justify-between rounded-full px-1 py-1 ${accent ? "bg-white/15" : "bg-slate-50"}`}
                              >
                                <button
                                  onClick={() => decreaseCartQty(item._id)}
                                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold ${accent ? "bg-white/20 text-white" : "bg-white text-slate-700 border border-slate-200"}`}
                                >
                                  -
                                </button>
                                <span
                                  className={`text-sm font-bold ${accent ? "text-white" : "text-slate-900"}`}
                                >
                                  {cartEntry.qty}
                                </span>
                                <button
                                  onClick={() => increaseCartQty(item._id)}
                                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold ${accent ? "bg-white/20 text-white" : "bg-white text-slate-700 border border-slate-200"}`}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className={`mt-1 w-full rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                  accent
                                    ? "bg-white text-[#1F4B3F] hover:bg-white/90"
                                    : "bg-slate-900/5 text-slate-800 hover:bg-slate-900/10"
                                }`}
                              >
                                Add to cart
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M6 6h15l-1.5 9h-12z" />
                                  <circle cx="9" cy="20" r="1" />
                                  <circle cx="18" cy="20" r="1" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-24 text-center"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-slate-500 font-bold text-xl">
                      No dishes found in this category
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedDish && (
              <motion.div
                key="selected-dish-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/45 backdrop-blur-sm p-0 sm:p-4"
              >
                <div
                  className="absolute inset-0"
                  onClick={() => setSelectedDish(null)}
                ></div>
                <motion.div
                  initial={{ y: "100%", scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: "100%", scale: 0.95 }}
                  transition={{ type: "spring", damping: 28, stiffness: 200 }}
                  className="relative z-10 w-full max-w-2xl bg-white sm:rounded-4xl rounded-t-4xl overflow-hidden border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col"
                >
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDish(null)}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-800/90 border border-slate-700 p-3 rounded-full text-white transition-all shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>

                  <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <div className="relative h-[38vh] sm:h-[48vh] bg-slate-100 flex items-center justify-center overflow-hidden p-3 pt-14 sm:pt-12">
                      <AnimatePresence mode="wait">
                        {activeTab === "details" ? (
                          <motion.img
                            key="image"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={
                              cachedImageSrc ||
                              selectedDish.imageUrl2D ||
                              "/placeholder.jpg"
                            }
                            alt={selectedDish.name}
                            className="w-full h-full object-cover rounded-3xl"
                          />
                        ) : (
                          <motion.div
                            key="3d"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full rounded-3xl overflow-hidden"
                          >
                            {selectedDish.model3DUrl ? (
                              modelLoadError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 font-semibold px-6 text-center bg-slate-100">
                                  <span className="text-4xl mb-4">⚠️</span>
                                  <p className="uppercase tracking-wider text-sm text-emerald-700 mb-2 font-bold">
                                    3D Model Load Error
                                  </p>
                                  <p className="text-sm max-w-md leading-relaxed text-gray-600">
                                    {modelLoadError}
                                  </p>
                                </div>
                              ) : (
                                <div className="relative w-full h-full">
                                  {modelLoading && (
                                    <motion.div
                                      initial={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm z-10"
                                    >
                                      <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-16 h-16">
                                          <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-emerald-200"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                              duration: 2,
                                              repeat: Infinity,
                                              ease: "linear",
                                            }}
                                          />
                                          <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500"
                                            animate={{ rotate: -360 }}
                                            transition={{
                                              duration: 1.5,
                                              repeat: Infinity,
                                              ease: "linear",
                                            }}
                                          />
                                        </div>
                                        <p className="text-emerald-700 text-sm font-bold tracking-wider uppercase">
                                          Loading 3D Model...
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                  {createElement("model-viewer", {
                                    ref: modelViewerRef,
                                    src:
                                      cachedModelSrc ||
                                      resolveModelUrl(selectedDish.model3DUrl),
                                    "auto-rotate": true,
                                    "camera-controls": true,
                                    "shadow-intensity": "1",
                                    ar: true,
                                    "ar-modes": "webxr scene-viewer quick-look",
                                    style: {
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "#f3f4f6",
                                    },
                                    "environment-image": "neutral",
                                    "auto-rotate-delay": "100",
                                    "rotation-per-second": "30deg",
                                    onBeforeRender: () => {
                                      if (!modelLoading) {
                                        console.log(
                                          "[3D Model] Rendering started",
                                        );
                                        setModelLoading(true);
                                      }
                                    },
                                    onLoad: () => {
                                      console.log(
                                        "[3D Model] Successfully loaded",
                                      );
                                      setModelLoading(false);
                                    },
                                    onError: (e: unknown) => {
                                      console.error(
                                        "[3D Model] Load failed:",
                                        e,
                                      );
                                      setModelLoading(false);
                                      setModelLoadError(
                                        "The model-viewer component failed to fetch the file. Check the Network tab for details.",
                                      );
                                    },
                                  })}
                                </div>
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-semibold">
                                <span className="text-4xl mb-4">🔮</span>
                                <p className="uppercase tracking-wider text-sm">
                                  3D model not available
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {selectedDish.arEnabled && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-white/95 backdrop-blur rounded-full border border-slate-200 shadow-lg">
                          <button
                            onClick={() => setActiveTab("details")}
                            className={`px-4 py-2 text-[11px] font-semibold rounded-full transition-all tracking-wide ${
                              activeTab === "details"
                                ? "bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            Photo
                          </button>
                          <button
                            onClick={openModelView}
                            className={`px-4 py-2 text-[11px] font-semibold rounded-full transition-all tracking-wide ${
                              activeTab === "3d"
                                ? "bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            3D View
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="px-4 pb-4 pt-2.5 md:px-5 md:pb-5 md:pt-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="rounded-3xl border border-slate-200 bg-white p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            {selectedDish.category || "Dish"}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 justify-between">
                          <div className="min-w-0">
                            <h2 className="text-[19px] leading-6 font-semibold text-slate-900 truncate">
                              {selectedDish.name}
                            </h2>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600">
                              <span
                                className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                  selectedDish.isVegetarian
                                    ? "border-green-600"
                                    : "border-green-600"
                                }`}
                                aria-label={
                                  selectedDish.isVegetarian
                                    ? "Vegetarian"
                                    : "Non-vegetarian"
                                }
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    selectedDish.isVegetarian
                                      ? "bg-green-600"
                                      : "bg-green-600"
                                  }`}
                                />
                              </span>
                              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 font-medium text-[10px] flex items-center gap-1">
                                <span className="text-[10px] leading-none">
                                  ★
                                </span>
                                4.2
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-1.5">
                            <div className="rounded-md border border-yellow-500 bg-yellow-400 px-2.5 py-1.5 text-right shadow-[0_2px_0_rgba(161,98,7,0.25)]">
                              <div className="text-[8px] uppercase tracking-wider text-yellow-950 font-semibold">
                                Price
                              </div>
                              <div className="flex items-end justify-end gap-1.5 leading-none">
                                <span className="text-[10px] text-slate-600 line-through">
                                  ₹
                                  {Math.round(
                                    Number(selectedDish.price) * 1.25,
                                  )}
                                </span>
                                <span className="text-[18px] font-bold text-slate-900">
                                  ₹{Number(selectedDish.price).toFixed(0)}
                                </span>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => addToCart(selectedDish)}
                              className="min-w-21 bg-emerald-600 text-white py-2 px-4 rounded-xl font-semibold tracking-wide text-[11px] hover:bg-emerald-700 transition-all"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                            >
                              Add
                            </motion.button>
                          </div>
                        </div>

                        <p className="text-[12px] leading-5 text-slate-600">
                          {selectedDish.description ||
                            "Deliciously crafted with fresh ingredients and expert preparation."}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                              Prep Time
                            </p>
                            <p className="text-[11.5px] font-semibold text-slate-800 mt-1">
                              15-20 min
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2">
                            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                              Chef&apos;s Special
                            </p>
                            <p className="text-[11.5px] font-semibold text-slate-800 mt-1">
                              Highly Recommended
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="p-3.5 md:p-4 border-t border-slate-200 bg-white flex items-stretch gap-2 sticky bottom-0 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {activeTab === "3d" && selectedDish.model3DUrl ? (
                      <motion.button
                        onClick={() => {
                          const modelViewer = document.querySelector(
                            "model-viewer",
                          ) as
                            | (HTMLElement & { activateAR?: () => void })
                            | null;
                          modelViewer?.activateAR?.();
                        }}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-2xl font-semibold tracking-wide text-[11px] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 24px rgba(16, 185, 129, 0.28)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          className="w-4.5 h-4.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.5 13.5L12 20.5l-7.5-7V2.5h15z"
                          />
                        </svg>
                        View in AR
                      </motion.button>
                    ) : (
                      <div className="w-full h-1" />
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {checkoutOpen && cart.length > 0 && (
              <motion.div
                key="checkout-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-55 flex items-end sm:items-center justify-center bg-slate-950/45 backdrop-blur-sm p-0 sm:p-4"
              >
                <div
                  className="absolute inset-0"
                  onClick={() => setCheckoutOpen(false)}
                />
                <motion.div
                  initial={{ y: "100%", scale: 0.97 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: "100%", scale: 0.97 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-4xl sm:rounded-4xl border border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                        Checkout
                      </p>
                      <h3 className="text-xl font-black text-slate-900">
                        Confirm your order
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={openAddMoreItems}
                        disabled={placingOrder}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {placingOrder ? "Placing..." : "Add item"}
                      </button>
                      <button
                        onClick={() => setCheckoutOpen(false)}
                        className="rounded-full border border-slate-200 bg-white p-2 text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                    {cart.map((entry, idx) => {
                      const cartKey =
                        entry.item._id?.trim() ||
                        `${entry.item.name || "cart-item"}-${entry.item.price}-${idx}`;

                      return (
                        <div
                          key={cartKey}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {entry.item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ₹{Number(entry.item.price).toFixed(0)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseCartQty(entry.item._id)}
                              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-700"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold text-slate-900">
                              {entry.qty}
                            </span>
                            <button
                              onClick={() => increaseCartQty(entry.item._id)}
                              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-3">
                    <input
                      value={checkoutForm.customerName}
                      onChange={e =>
                        setCheckoutForm(prev => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-300"
                    />
                    <input
                      value={checkoutForm.customerPhone}
                      onChange={e =>
                        setCheckoutForm(prev => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                      placeholder="Mobile number"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-300"
                    />
                    <textarea
                      value={checkoutForm.customerRemark}
                      onChange={e =>
                        setCheckoutForm(prev => ({
                          ...prev,
                          customerRemark: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Remark: table number, car number, color, etc"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-300"
                    />
                    <textarea
                      value={checkoutForm.customerCookingRequest}
                      onChange={e =>
                        setCheckoutForm(prev => ({
                          ...prev,
                          customerCookingRequest: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Cooking request: extra spicy, less oil, allergen free, no onion, etc"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-300"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-sm font-semibold text-emerald-800">
                      Total ({cartItemCount} items)
                    </p>
                    <p className="text-xl font-black text-emerald-900">
                      ₹{cartTotal.toFixed(0)}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={openAddMoreItems}
                      disabled={placingOrder}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {placingOrder ? "Placing..." : "Add item"}
                    </button>
                    <button
                      onClick={() => void submitGuestOrder()}
                      disabled={placingOrder}
                      className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      {placingOrder ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {cart.length > 0 && !selectedDish && (
              <motion.div
                key="cart-summary-bar"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-4 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-[560px] z-40 bg-white border border-slate-200 text-slate-900 p-3 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.16)] flex items-center gap-4"
              >
                <div className="hidden sm:flex -space-x-3">
                  {cart.slice(0, 4).map(entry => (
                    <div
                      key={entry.item._id}
                      className="relative h-11 w-11 rounded-full ring-2 ring-white overflow-hidden bg-slate-100"
                    >
                      {entry.item.imageUrl2D ? (
                        <img
                          src={entry.item.imageUrl2D}
                          alt={entry.item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-slate-500">
                          {entry.item.name?.slice(0, 1)}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1F4B3F] text-[9px] font-bold text-white">
                        {entry.qty}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {cartItemCount} Items
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    View cart →
                  </p>
                </button>

                <motion.button
                  onClick={() => setCheckoutOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#1F4B3F] text-white hover:opacity-90 px-5 py-3 rounded-2xl font-bold text-sm transition-opacity shadow-md shrink-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Checkout • ₹{cartTotal.toFixed(0)}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="fixed bottom-1 left-1/2 -translate-x-1/2 z-30 hidden text-[11px] font-medium text-slate-400 md:block">
            🔒 Secure payments · 100% safe &amp; hygienic
          </p>

          <AnimatePresence>
            {orderPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.96, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 16 }}
                  className="w-full max-w-md rounded-3xl border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.25)]"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">
                    Order Update
                  </p>
                  <h4 className="mt-2 text-2xl font-black tracking-tighter text-slate-950">
                    {orderPopup.message}
                  </h4>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Your order
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {getOrderItemSummary(orderPopup.order)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 capitalize">
                      Status: {orderPopup.order.status}
                    </p>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => setOrderPopup(null)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
