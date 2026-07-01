"use client";

import { createElement, useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";
import MenuCarousel from "@/components/MenuCarousel";
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
  const backgroundImage = getMenuBackgroundImage(category);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={backgroundImage}
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.50] scale-105 blur-[1px]"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-br from-white/78 via-white/66 to-emerald-50/72" />
      <div
        className="absolute inset-0 opacity-[0.82]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(16,185,129,0.18) 0, transparent 34%), radial-gradient(circle at top right, rgba(251,191,36,0.12) 0, transparent 28%), radial-gradient(circle at bottom, rgba(244,114,182,0.08) 0, transparent 30%)",
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

    trackModelView();
  }, [activeTab, selectedDish?._id]);

  // Load data
  useEffect(() => {
    const loadMenuData = async () => {
      if (!publicUrl) {
        setError("Invalid menu URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Scroll to top when page loads
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

        const qrCodeToken = qrData.data?.qrCode?.code;
        if (qrCodeToken) {
          try {
            await fetch(`${API_BASE}/qrcode/scan/${qrCodeToken}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                deviceId: deviceIdRef.current,
                sessionId: sessionIdRef.current,
              }),
            });
          } catch (scanError) {
            console.warn("Failed to track QR scan:", scanError);
          }
        }

        if (trackedMenuViewRef.current !== rId) {
          trackedMenuViewRef.current = rId;
          try {
            await fetch(`${API_BASE}/analytics/track`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                restaurantId: rId,
                eventType: "view_menu",
                deviceType: "Web",
                sessionId: sessionIdRef.current,
                deviceId: deviceIdRef.current,
              }),
            });
          } catch (menuViewError) {
            console.warn("Failed to track menu view:", menuViewError);
          }
        }

        try {
          const restaurantRes = await fetch(
            `${API_BASE}/restaurants/public/${publicUrl}`,
          );
          if (restaurantRes.ok) {
            const restaurantData = await restaurantRes.json();
            setRestaurant(restaurantData?.data || restaurantData);
          }
        } catch (err) {
          console.warn("Could not load restaurant details:", err);
        }

        const menuResponse = await fetch(`${API_BASE}/menu/public/${rId}`);
        const menuData = await menuResponse.json();
        if (!menuResponse.ok) {
          throw new Error(menuData.message || "Failed to load menu items");
        }
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
        // Debug: list first few media URLs to ensure server returned public URLs
        console.log(
          "[Menu] sample media URLs",
          normalizedItems.slice(0, 5).map(it => ({
            id: it._id,
            image: it.imageUrl2D,
            model: it.model3DUrl,
          })),
        );
        setMenuItems(normalizedItems as MenuItem[]);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || "Failed to load menu";
        setError(errorMsg);
        showToast(errorMsg, "error");
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
      fetch(`${API_BASE}/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          eventType: "add_to_cart",
          deviceType: "Web",
          sessionId: sessionIdRef.current,
          deviceId: deviceIdRef.current,
          menuItemId: item._id,
        }),
      }).catch(error => {
        console.warn("Failed to track add to cart:", error);
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
      fetch(`${API_BASE}/menu/${item._id}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          deviceId: deviceIdRef.current,
          deviceType: "Web",
        }),
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
      <>
        <MenuSkeleton />
        <div className="fixed inset-0 z-50 pointer-events-none">
          <LoadingCinematic />
        </div>
      </>
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

      <div className="relative z-10 min-h-screen bg-linear-to-br from-white/30 via-amber-50/20 to-rose-50/20 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden pb-40">
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.32]"
            style={{
              backgroundImage:
                "radial-gradient(circle at top left, rgba(16,185,129,0.14) 0, transparent 28%), radial-gradient(circle at top right, rgba(251,191,36,0.18) 0, transparent 22%), radial-gradient(circle at 12% 78%, rgba(244,114,182,0.14) 0, transparent 18%), radial-gradient(circle at bottom right, rgba(34,197,94,0.12) 0, transparent 26%), radial-gradient(circle at 68% 20%, rgba(59,130,246,0.10) 0, transparent 18%), linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)",
              backgroundSize: "auto, auto, auto, 24px 24px, 24px 24px",
            }}
          />
          <motion.div
            className="absolute top-20 left-6 sm:left-12 w-28 h-28 rounded-full bg-amber-300/30 blur-3xl"
            animate={{ y: [0, 18, 0], x: [0, 10, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-36 right-10 sm:right-16 w-24 h-24 rounded-full bg-rose-300/26 blur-3xl"
            animate={{ y: [0, -16, 0], x: [0, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Animated background gradients */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/26 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/18 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-140 mx-auto lg:max-w-5xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative pt-8 pb-4 px-4 sm:px-6 text-left border-b border-slate-200/55"
          >
            <div className="absolute -top-4 right-4 hidden sm:block w-28 h-28 rounded-full bg-linear-to-br from-emerald-200/25 via-amber-200/20 to-rose-200/20 blur-3xl" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200/70 bg-linear-to-r from-emerald-50/80 via-amber-50/80 to-rose-50/80 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-3 shadow-none backdrop-blur-sm">
              <motion.span
                className="h-2 w-2 rounded-full bg-linear-to-r from-emerald-500 via-amber-400 to-rose-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Freshly curated menu
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight bg-linear-to-r from-slate-900 via-emerald-700 to-rose-600 bg-clip-text text-transparent drop-shadow-[0_10px_24px_rgba(244,114,182,0.08)]"
            >
              {restaurant?.name || "Premium Menu"}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.65, duration: 0.55 }}
              className="h-1 w-28 bg-linear-to-r from-emerald-400 via-amber-400 to-rose-400 rounded-full shadow-[0_0_22px_rgba(244,114,182,0.24)]"
            />
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Fast delivery", value: "10-15 min" },
                { label: "Freshly made", value: "Daily" },
                { label: "Top rated", value: "4.5+" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.85 + idx * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.04,
                    y: -4,
                    rotate: idx === 1 ? 1.5 : -1.5,
                  }}
                  className="rounded-3xl border border-white/70 bg-linear-to-br from-white/60 via-white/50 to-amber-50/45 px-3 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl hover:bg-white/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-amber-500" : "bg-rose-500"}`}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                  <motion.p
                    className={`mt-1 text-sm font-black ${idx === 0 ? "text-emerald-700" : idx === 1 ? "text-amber-700" : "text-rose-700"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + idx * 0.12, duration: 0.4 }}
                  >
                    {stat.value}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.header>

          {/* Sticky Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="sticky top-0 z-40 bg-transparent border-b border-transparent py-3.5 px-4 shadow-none backdrop-blur-0"
          >
            <div className="max-w-140 mx-auto lg:max-w-5xl space-y-2.5 relative">
              <div className="absolute inset-x-8 -top-3 h-8 bg-linear-to-r from-emerald-200/0 via-amber-200/18 to-rose-200/0 blur-2xl pointer-events-none" />
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for paneer, thali, biryani..."
                  className="w-full rounded-full border border-white/70 bg-white/80 py-3.25 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                />
                <svg
                  className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.3}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </motion.div>

              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                <button
                  onClick={() => setVegOnly(prev => !prev)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.17em] border transition-all ${vegOnly ? "bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 border-emerald-500 text-white shadow-sm" : "bg-white/60 border-slate-200/60 text-slate-500 hover:border-emerald-200 hover:text-emerald-700"}`}
                >
                  Classy dishes
                </button>
                <span className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] bg-linear-to-r from-amber-50/90 to-yellow-50/90 border border-amber-100 text-amber-700 shadow-[0_6px_18px_rgba(251,191,36,0.10)]">
                  Sleek picks
                </span>
                <span className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] bg-linear-to-r from-rose-50/90 to-pink-50/90 border border-rose-100 text-rose-700 shadow-[0_6px_18px_rgba(244,114,182,0.10)]">
                  Fast prep
                </span>
                <span className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] bg-linear-to-r from-teal-50/90 to-cyan-50/90 border border-teal-100 text-teal-700 shadow-[0_6px_18px_rgba(45,212,191,0.10)]">
                  Fresh drop
                </span>
              </div>
            </div>
          </motion.div>

          {!searchQuery && categories.length > 0 && (
            <div className="px-4 pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-700">
                  Popular categories
                </p>
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-[0.22em]">
                  Swipe
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {categories.map((cat, idx) => {
                  const sampleItem = menuItems.find(
                    item => (item.category || "Other") === cat,
                  );
                  const isActive = cat === currentCategory;
                  return (
                    <motion.button
                      key={`rail-${cat}`}
                      onClick={() => handleTurnPage(categories.indexOf(cat))}
                      className="shrink-0 flex flex-col items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.08 }}
                      whileHover={{
                        y: -8,
                        scale: 1.12,
                        rotate: idx % 2 === 0 ? 2 : -2,
                      }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <div
                        className={`w-18 h-18 rounded-full border-4 ${isActive ? "border-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.10),0_18px_36px_rgba(16,185,129,0.22)]" : "border-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.20)]"} bg-linear-to-br from-white via-white to-amber-50/50 overflow-hidden relative transition-all duration-300`}
                      >
                        {sampleItem?.imageUrl2D ? (
                          <img
                            src={sampleItem.imageUrl2D}
                            alt={cat}
                            className="w-full h-full object-cover will-change-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-emerald-100 via-amber-100 to-rose-100 flex items-center justify-center text-emerald-700 font-black">
                            {cat.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-4 border-emerald-500"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        )}
                      </div>
                      <motion.span
                        className={`text-sm font-semibold whitespace-nowrap transition-colors ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}
                        animate={
                          isActive ? { fontWeight: 700 } : { fontWeight: 600 }
                        }
                      >
                        {cat}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          <div className="relative mt-12 px-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Choose your craving
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-900 mt-1">
                  Handpicked from the menu
                </p>
              </div>
              <div className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur-md">
                {displayItems.length} items
              </div>
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
                  <MenuCarousel
                    items={displayItems}
                    onSelect={handleSelectDish}
                    addToCart={addToCart}
                  />
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
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-4 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-105 z-40 bg-emerald-600 border border-emerald-700 text-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.40)] flex justify-between items-center backdrop-blur-xl hover:shadow-[0_24px_60px_rgba(16,185,129,0.50)] transition-shadow"
              >
                <motion.div className="pl-2" whileHover={{ x: 4 }}>
                  <motion.p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest mb-1">
                    Items in Cart
                  </motion.p>
                  <motion.p
                    className="font-bold text-2xl text-white"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    ₹{cartTotal.toFixed(0)}
                  </motion.p>
                </motion.div>
                <motion.button
                  onClick={() => setCheckoutOpen(true)}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors shadow-lg"
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 8px 20px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Checkout ({cartItemCount})
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

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
