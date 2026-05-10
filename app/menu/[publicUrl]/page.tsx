"use client";

import { createElement, useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { showToast } from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/lib/types";
import Script from "next/script";
import { API_BASE_URL } from "@/lib/constants";

const API_BASE =
  API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

// Subcomponents

const IntroCinematic = ({ onComplete }: { onComplete: () => void }) => {
  const particleCount = 12;
  const particles = Array.from({ length: particleCount });

  return (
    <motion.div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-linear-to-br from-white via-emerald-50 to-slate-100 overflow-hidden"
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
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/50 text-slate-900">
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
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/40 text-slate-900">
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
  const [vegOnly, setVegOnly] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const modelViewerRef = useRef<any>(null);

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

    const resolved = `${apiRoot}/uploads/images/${ref}`;
    console.log("[3D Model] resolved", { ref, resolved });
    return resolved;
  };

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setModelLoadError(null);
    setModelLoading(false);
  }, [selectedDish?._id, selectedDish?.model3DUrl, activeTab]);

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
        console.log("[Menu]", {
          itemCount: itemsArray.length,
          itemsWithModels: itemsArray.filter((i: any) => i.model3DUrl).length,
        });
        // Debug: list first few media URLs to ensure server returned public URLs
        console.log(
          "[Menu] sample media URLs",
          itemsArray.slice(0, 5).map((it: any) => ({
            id: it._id,
            image: it.imageUrl2D,
            model: it.model3DUrl,
          })),
        );
        setMenuItems(itemsArray);
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
  let currentCategory = categories[selectedCategoryIndex] || "all";

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
    showToast(`${item.name} added`, "success");
    setSelectedDish(null);
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
      {!introDone && <IntroCinematic onComplete={() => setIntroDone(true)} />}

      <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-emerald-50/30 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden pb-40">
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "radial-gradient(circle at top left, rgba(16,185,129,0.10) 0, transparent 28%), radial-gradient(circle at top right, rgba(148,163,184,0.12) 0, transparent 24%), radial-gradient(circle at bottom left, rgba(34,197,94,0.10) 0, transparent 26%), linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
              backgroundSize: "auto, auto, auto, 24px 24px, 24px 24px",
            }}
          />
          {/* Animated background gradients */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/15 rounded-full blur-3xl"
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
            className="pt-8 pb-5 px-4 sm:px-6 text-left border-b border-slate-200/80"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.25em] mb-4 shadow-sm">
              Freshly curated menu
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight"
            >
              {restaurant?.name || "Premium Menu"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm sm:text-base text-slate-600 font-semibold mb-5"
            >
              {restaurant?.description || "Discover Culinary Excellence"}
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="h-1 w-24 bg-linear-to-r from-emerald-400 to-green-500 rounded-full"
            />
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Fast delivery", value: "20-30 min" },
                { label: "Freshly made", value: "Daily" },
                { label: "Top rated", value: "4.5+" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 1.1 + idx * 0.12,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="rounded-3xl border border-slate-200 bg-white/80 px-3 py-3 shadow-sm backdrop-blur hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                  <motion.p
                    className="mt-1 text-sm font-black text-slate-900"
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
            className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-4 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
          >
            <div className="max-w-140 mx-auto lg:max-w-5xl space-y-3">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for paneer, thali, biryani..."
                  className="w-full rounded-full border border-slate-200 bg-slate-100 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
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
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.17em] border transition-colors ${vegOnly ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"}`}
                >
                  Veg only
                </button>
                <span className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] bg-white border border-slate-200 text-slate-500">
                  Sleek picks
                </span>
                <span className="shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] bg-white border border-slate-200 text-slate-500">
                  Fast prep
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
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.22em]">
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
                      whileHover={{ y: -6, scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <div
                        className={`w-18 h-18 rounded-full border-4 ${isActive ? "border-emerald-500 shadow-lg shadow-emerald-400/60" : "border-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.20)]"} bg-white overflow-hidden relative transition-all duration-300`}
                      >
                        {sampleItem?.imageUrl2D ? (
                          <img
                            src={sampleItem.imageUrl2D}
                            alt={cat}
                            className="w-full h-full object-cover will-change-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-emerald-100 to-slate-100 flex items-center justify-center text-emerald-700 font-black">
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
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400 mt-1">
                  Handpicked from the menu
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
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
                className="grid grid-cols-2 gap-4 sm:gap-5 origin-center"
              >
                {displayItems.length > 0 ? (
                  displayItems.map((item, idx) => {
                    const rowIndex = Math.floor(idx / 2);
                    const colIndex = idx % 2;
                    const staggerDelay = rowIndex * 0.12 + colIndex * 0.08;
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: staggerDelay,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -12, scale: 1.03, rotateX: 5 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedDish(item)}
                        className="group cursor-pointer perspective"
                      >
                        <motion.div
                          className="bg-white border border-slate-200 rounded-4xl overflow-hidden shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_48px_rgba(16,185,129,0.15)] hover:border-emerald-300 transition-all duration-300 flex flex-col h-full hover:bg-white relative"
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          {/* Image Container */}
                          <div className="relative h-40 sm:h-48 overflow-hidden bg-linear-to-br from-slate-100 to-emerald-50">
                            {item.imageUrl2D ? (
                              <motion.img
                                whileHover={{ scale: 1.15, rotate: 3 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                src={item.imageUrl2D}
                                alt={item.name}
                                className="w-full h-full object-cover will-change-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-emerald-300">
                                <svg
                                  className="w-20 h-20 mb-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                                  />
                                </svg>
                                <span className="text-sm font-semibold">
                                  No image
                                </span>
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 bg-linear-to-t from-slate-900/25 via-transparent to-transparent group-hover:from-slate-900/45 transition-all duration-300"
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.96 }}
                              whileHover={{ opacity: 1, scale: 1 }}
                              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_40%)] pointer-events-none"
                            />
                            <motion.div
                              className="absolute -left-10 top-0 h-full w-12 bg-white/30 blur-md"
                              animate={{ x: [-50, 210] }}
                              transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                repeatDelay: 1.5,
                                ease: "easeInOut",
                                delay: idx * 0.12,
                              }}
                            />

                            {/* Badges */}
                            <motion.div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                              {item.arEnabled && (
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-white/95 backdrop-blur border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-2 shadow-lg"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                                    />
                                  </svg>
                                  3D
                                </motion.div>
                              )}
                              {item.isVegetarian && (
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-white/95 backdrop-blur border border-green-500 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg"
                                >
                                  🌱 VEG
                                </motion.div>
                              )}
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                            <div className="mb-3">
                              <div className="flex justify-between items-start gap-3 mb-2">
                                <motion.h3 className="text-[15px] sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                                  {item.name}
                                </motion.h3>
                                <motion.span
                                  className="text-lg sm:text-xl font-black text-emerald-700 shrink-0"
                                  whileHover={{ scale: 1.3, y: -6 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                >
                                  ₹{Number(item.price).toFixed(0)}
                                </motion.span>
                              </div>
                              <motion.div
                                className="h-1 w-10 bg-linear-to-r from-emerald-400 to-green-500 rounded-full group-hover:w-full transition-all duration-300"
                                initial={{ width: "2.5rem" }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              />
                            </div>
                            <div className="flex items-end justify-between gap-3">
                              {item.description ? (
                                <p className="text-slate-500 text-[12px] sm:text-sm font-medium line-clamp-2 leading-snug pr-2">
                                  {item.description}
                                </p>
                              ) : (
                                <div />
                              )}
                              <motion.button
                                onClick={e => {
                                  e.stopPropagation();
                                  addToCart(item);
                                }}
                                className="shrink-0 px-4 py-2 rounded-full border border-slate-200 bg-white text-emerald-700 text-xs sm:text-sm font-black uppercase tracking-[0.18em] shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition-colors relative overflow-hidden"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1 }}
                              >
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1 }}
                                  className="absolute inset-0 bg-emerald-500/10"
                                />
                                ADD
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })
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
                  className="relative z-10 w-full max-w-3xl bg-linear-to-br from-white to-slate-50 sm:rounded-4xl rounded-t-4xl overflow-hidden border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col backdrop-blur-xl"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedDish(null)}
                    className="absolute top-5 right-5 z-20 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-full text-white transition-all group shadow-lg"
                  >
                    <svg
                      className="w-6 h-6"
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
                    <div className="relative h-[40vh] sm:h-[50vh] bg-linear-to-br from-slate-100 to-emerald-50 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        {activeTab === "details" ? (
                          <motion.img
                            key="image"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={selectedDish.imageUrl2D || "/placeholder.jpg"}
                            alt={selectedDish.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <motion.div
                            key="3d"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
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
                                    src: resolveModelUrl(
                                      selectedDish.model3DUrl,
                                    ),
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
                                    onError: (e: any) => {
                                      console.error(
                                        "[3D Model] Load failed:",
                                        e,
                                      );
                                      setModelLoading(false);
                                      setModelLoadError(
                                        "The model-viewer component failed to fetch the file. Check the Network tab for details.",
                                      );
                                    },
                                  } as any)}
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
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-white/95 backdrop-blur-md rounded-full border border-slate-200 shadow-xl">
                          <button
                            onClick={() => setActiveTab("details")}
                            className={`px-6 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-wider ${activeTab === "details" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-700 hover:bg-slate-50"}`}
                          >
                            Photo
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("3d");
                              setModelLoading(true);
                            }}
                            className={`px-6 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-wider ${activeTab === "3d" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-700 hover:bg-slate-50"}`}
                          >
                            3D View
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8 relative">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <motion.h2
                            className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                          >
                            {selectedDish.name}
                          </motion.h2>
                          <motion.div
                            className="flex flex-wrap gap-2 items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                          >
                            <motion.span
                              className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgb(240, 253, 250)",
                              }}
                            >
                              {selectedDish.category}
                            </motion.span>
                            {selectedDish.isVegetarian && (
                              <motion.span
                                className="text-[10px] uppercase tracking-widest font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-lg"
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "rgb(240, 253, 245)",
                                }}
                              >
                                Vegetarian
                              </motion.span>
                            )}
                          </motion.div>
                        </motion.div>
                        <motion.span
                          className="text-4xl text-emerald-700 font-bold md:text-right shrink-0"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.3,
                            duration: 0.5,
                            ease: "backOut",
                          }}
                          whileHover={{ scale: 1.15, y: -4 }}
                        >
                          ₹{Number(selectedDish.price).toFixed(0)}
                        </motion.span>
                      </div>

                      <motion.div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg">
                        <motion.p
                          className="text-slate-800 font-semibold border-l-4 border-emerald-500 pl-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {selectedDish.description ||
                            "Deliciously crafted with fresh ingredients and expert preparation."}
                        </motion.p>

                        <motion.div
                          className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-6 md:gap-12 md:items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          whileHover={{
                            borderColor: "rgb(34, 197, 94)",
                            backgroundColor: "rgb(248, 250, 245)",
                          }}
                        >
                          <motion.div
                            className="flex-1 flex flex-col gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55, duration: 0.4 }}
                          >
                            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                              Prep Time
                            </span>
                            <motion.span
                              className="font-bold text-emerald-700 text-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6, duration: 0.5 }}
                            >
                              15-20 min
                            </motion.span>
                          </motion.div>
                          <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                          <motion.div
                            className="flex-1 flex flex-col gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.4 }}
                          >
                            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                              Chef's Special
                            </span>
                            <motion.span
                              className="font-bold text-emerald-700 text-lg"
                              initial={{ opacity: 0, scale: 1 }}
                              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
                              transition={{
                                delay: 0.7,
                                duration: 0.6,
                                repeatDelay: 2,
                              }}
                            >
                              Highly Recommended ⭐
                            </motion.span>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="p-5 md:p-6 border-t border-slate-200 bg-white flex items-center justify-between gap-4 sticky bottom-0 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {activeTab === "3d" && selectedDish.model3DUrl ? (
                      <motion.button
                        onClick={() => {
                          const modelViewer = document.querySelector(
                            "model-viewer",
                          ) as any;
                          if (modelViewer && modelViewer.activateAR)
                            modelViewer.activateAR();
                        }}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-full font-bold tracking-widest text-sm md:text-base hover:bg-emerald-700 transition-colors uppercase flex items-center justify-center gap-3 shadow-lg"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 50px rgba(16, 185, 129, 0.35)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Try in AR
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => addToCart(selectedDish)}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-full font-bold tracking-widest text-sm md:text-base hover:bg-emerald-700 transition-colors uppercase flex items-center justify-center gap-2 shadow-lg"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 50px rgba(16, 185, 129, 0.35)",
                        }}
                        whileTap={{ scale: 0.95 }}
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add to Cart — ₹{Number(selectedDish.price).toFixed(0)}
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {cart.length > 0 && !selectedDish && (
              <motion.div
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
                    ₹
                    {cart
                      .reduce(
                        (acc, curr) => acc + curr.item.price * curr.qty,
                        0,
                      )
                      .toFixed(0)}
                  </motion.p>
                </motion.div>
                <motion.button
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors shadow-lg"
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 8px 20px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  View ({cart.reduce((acc, curr) => acc + curr.qty, 0)})
                </motion.button>
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
