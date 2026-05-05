"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const RotatingBoxComponent = dynamic(() => import("./RotatingBox"), {
  loading: () => (
    <div className="w-full h-full bg-linear-to-b from-slate-800 to-slate-900" />
  ),
});

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section
        suppressHydrationWarning
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center pt-24"
      >
        <div className="text-center max-w-5xl mx-auto px-4">
          <span className="fancy-pill mb-6">Future of Dining Visuals</span>
          <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Turn Every Dish Into a
            <span className="gradient-text block mt-2">Living 3D Story</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A bold, cinematic menu experience for modern restaurants. Guests
            scan, explore and connect with your food before the first bite.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="btn-primary px-8 py-4">
              Launch My Menu
            </Link>
            <Link href="#features" className="btn-secondary px-8 py-4">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 opacity-25">
        <Suspense fallback={<div className="w-full h-full bg-slate-800" />}>
          <RotatingBoxComponent />
        </Suspense>
      </div>

      <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-[92%] h-32 gradient-bg blur-3xl opacity-45" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fancy-pill mb-6"
          >
            Future of Dining Visuals
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Turn Every Dish Into a
            <span className="gradient-text block mt-2">Living 3D Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            A bold, cinematic menu experience for modern restaurants. Guests
            scan, explore and connect with your food before the first bite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/register" className="btn-primary px-8 py-4">
              Launch My Menu
            </Link>
            <Link href="#features" className="btn-secondary px-8 py-4">
              Explore Features
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="grid grid-cols-3 gap-4 text-sm sm:text-base text-slate-400 glass-panel rounded-2xl p-4"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-orange-200">
                100+
              </div>
              <div>Monthly AI Conversions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-200">
                0%
              </div>
              <div>Setup Complexity</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-teal-200">
                5 min
              </div>
              <div>Go Live Time</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

