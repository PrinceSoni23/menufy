"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const FloatingDishBackground = dynamic(
  () =>
    import("@/components/3d/FloatingDishBackground").then(
      mod => mod.FloatingDishBackground,
    ),
  { ssr: false },
);

const heroHighlights = [
  {
    label: "Scan to AR",
    value: "3 seconds",
  },
  {
    label: "Menu accuracy",
    value: "True portion size",
  },
  {
    label: "Adoption friction",
    value: "Zero app installs",
  },
];

const coreFeatures = [
  {
    title: "3D Menu Visualization",
    description:
      "Ultra-realistic 3D models with zoom, rotation, and lighting so every plate feels tangible.",
    accent: "🍔",
  },
  {
    title: "Web-Based AR",
    description:
      "Open in any modern browser. Scan a QR code, place the dish on the table, decide instantly.",
    accent: "📱",
  },
  {
    title: "Cinematic Food Preview",
    description:
      "Steam, melt, gloss, and texture animations turn your menu into a moment.",
    accent: "🎥",
  },
  {
    title: "AI-Powered 3D Conversion",
    description:
      "Upload a photo and our AI reconstructs the dish with accurate textures and geometry.",
    accent: "🧠",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track views, conversions, and engagement time to optimize what really sells.",
    accent: "📊",
  },
  {
    title: "Smart Digital Menu",
    description:
      "QR-first menus that update in minutes. No reprints, no delays.",
    accent: "🧾",
  },
  {
    title: "Upselling & Highlighting",
    description:
      "Spotlight premium items, bundles, and add-ons with interactive AR placements.",
    accent: "💸",
  },
  {
    title: "Social Sharing",
    description:
      "Guests share dishes in AR for organic reach and instant brand lift.",
    accent: "🌐",
  },
  {
    title: "Multi-Outlet Control",
    description:
      "Manage every branch from one dashboard with consistent visuals.",
    accent: "🏪",
  },
  {
    title: "Performance First",
    description:
      "Optimized 3D assets and CDN delivery for lightning fast load times.",
    accent: "⚡",
  },
];

const customerBenefits = [
  "No expectation vs reality mismatch.",
  "Visual portion size and ingredients at a glance.",
  "Interactive ordering for groups.",
  "Trust and transparency with every dish.",
];

const restaurantBenefits = [
  "Higher conversion rates with visual menus.",
  "Lower refunds and fewer complaints.",
  "Differentiation that drives attention.",
  "Repeat orders powered by a memorable experience.",
  "Cost savings from digital updates.",
];

const steps = [
  {
    title: "Scan",
    description: "Guests scan the QR code from the table or storefront.",
  },
  {
    title: "View",
    description: "They explore the dish in 3D and place it in AR instantly.",
  },
  {
    title: "Order",
    description: "Confidence leads to faster, higher-value decisions.",
  },
];

const impactStats = [
  { value: "2.4x", label: "Conversion lift on featured dishes" },
  { value: "38%", label: "Higher premium item adoption" },
  { value: "4.7s", label: "Average AR engagement time" },
  { value: "0", label: "App installs required" },
];

const visionPoints = [
  "An AR dining ecosystem that connects discovery, ordering, and loyalty.",
  "Real-time personalization for every guest and every table.",
  "A new standard where menus become immersive experiences.",
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const radialGradient = useMotionTemplate`radial-gradient(1200px circle at ${springX}% ${springY}%, rgba(160, 112, 77, 0.16), rgba(245, 237, 227, 0) 70%)`;

  const heroQuote = useMemo(
    () =>
      "We don\u2019t just show food. We make people experience it before they order.",
    [],
  );

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#cce5ff] via-[#fff1cf] to-[#e7d3d3] relative isolate overflow-x-hidden"
      onMouseMove={event => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        mouseX.set((event.clientX / width) * 100);
        mouseY.set((event.clientY / height) * 100);
      }}
    >
      <FloatingDishBackground />
      <Header skipAuth />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: radialGradient }}
      />

      <div className="relative z-10">
        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="uppercase tracking-[0.32em] text-sm font-semibold text-[#8c3b3b]">
                About menuffy
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-serif font-black bg-gradient-to-r from-[#555842] via-[#555842] to-[#8b6f47] bg-clip-text text-transparent leading-tight italic">
                See your food before you order it.
              </h1>
              <p className="text-lg sm:text-xl text-[#7c4b4b] max-w-xl">
                We transform flat menus into immersive 3D and AR experiences so
                guests order with confidence and restaurants grow with clarity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard?mode=demo" className="btn-primary">
                  Start the demo
                </Link>
                <Link
                  href="/dashboard?mode=demo#menu"
                  className="px-6 py-3 rounded-full border border-[#a24e4e] text-[#7c2f2f] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition"
                >
                  Explore the demo
                </Link>
              </div>
              <p className="text-base italic text-[#8c3b3b] max-w-xl">
                {heroQuote}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="space-y-6">
                <motion.div
                  style={{ y: y1 }}
                  className="rounded-3xl p-8 bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_30px_80px_rgba(124,47,47,0.18)]"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                        Impact snapshot
                      </span>
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="grid gap-4">
                      {heroHighlights.map(item => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/70 border border-white/70"
                        >
                          <span className="text-sm text-[#7c4b4b]">
                            {item.label}
                          </span>
                          <span className="font-semibold text-[#7c2f2f]">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div
                    style={{ y: y2 }}
                    whileHover={{ y: -6 }}
                    className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(124,47,47,0.18)] aspect-[4/5]"
                  >
                    <Image
                      src="/Screenshot 2026-04-20 122225.png"
                      alt="3D menu demo preview"
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#7c2f2f]">
                      3D demo
                    </div>
                  </motion.div>
                  <motion.div
                    style={{ y: y2 }}
                    whileHover={{ y: -6 }}
                    className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(124,47,47,0.18)] aspect-[4/5]"
                  >
                    <Image
                      src="/Interior Design_Interior Design Service_e-design_Custom Mood Board_Decorating.jpeg"
                      alt="AR dining scene mockup"
                      fill
                      sizes="(max-width: 640px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#7c2f2f]">
                      AR scene
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-10 -right-6 w-48 h-48 rounded-full bg-gradient-to-br from-[#a24e4e] via-[#d08b7c] to-[#fff1cf] blur-0 shadow-[0_25px_60px_rgba(162,78,78,0.35)]"
              />
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-8 rounded-3xl bg-white/70 border border-white/70 shadow-[0_25px_70px_rgba(124,47,47,0.12)]"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                The problem
              </p>
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-4">
                Menus are static, vague, and uninspiring.
              </h2>
              <p className="text-[#7c4b4b] mt-4">
                Customers guess what a dish looks like. Restaurants lose orders
                because the experience begins with uncertainty.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#a24e4e] via-[#a24e4e] to-[#7c2f2f] text-[#fff1cf] shadow-[0_25px_70px_rgba(124,47,47,0.25)]"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffe4c0]">
                The solution
              </p>
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl mt-4">
                A try-before-you-buy menu.
              </h2>
              <p className="mt-4">
                menuffy turns every dish into an immersive preview so guests
                decide faster, spend more, and remember the brand.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                  Core platform
                </p>
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-4">
                  Every feature designed to remove doubt.
                </h2>
              </div>
              <span className="text-sm text-[#7c4b4b]">
                Psychology: clarity increases order confidence.
              </span>
            </div>

            <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 rounded-3xl bg-white/70 border border-white/70 shadow-[0_20px_60px_rgba(124,47,47,0.12)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{feature.accent}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-[#8c3b3b]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#7c2f2f] mt-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#7c4b4b] mt-3">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/70 border border-white/70"
            >
              <h3 className="text-2xl font-semibold text-[#7c2f2f]">
                How it helps customers
              </h3>
              <ul className="mt-5 space-y-3 text-[#7c4b4b]">
                {customerBenefits.map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#a24e4e]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#fff1cf] via-[#f9e2d0] to-[#cce5ff] border border-white/70"
            >
              <h3 className="text-2xl font-semibold text-[#7c2f2f]">
                How it helps restaurants grow
              </h3>
              <ul className="mt-5 space-y-3 text-[#7c4b4b]">
                {restaurantBenefits.map(item => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#a24e4e]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                  How it works
                </p>
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-4">
                  Scan. View. Order.
                </h2>
              </div>
              <span className="text-sm text-[#7c4b4b]">
                Designed for zero friction adoption.
              </span>
            </div>

            <div className="grid gap-6 mt-10 sm:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-3xl bg-white/70 border border-white/70 shadow-[0_20px_60px_rgba(124,47,47,0.12)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-semibold text-[#a24e4e]">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-[#7c2f2f]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[#7c4b4b]">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-14">
          <div className="max-w-6xl mx-auto rounded-[32px] bg-gradient-to-br from-[#a24e4e] via-[#8c3b3b] to-[#7c2f2f] text-[#fff1cf] p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#ffd9b0]">
                  Proof of impact
                </p>
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl mt-4">
                  Restaurants use menuffy to grow faster.
                </h2>
              </div>
              <Link
                href="/dashboard?mode=demo#analytics"
                className="px-6 py-3 rounded-full bg-[#fff1cf] text-[#7c2f2f] font-semibold hover:bg-white transition"
              >
                View the dashboard
              </Link>
            </div>

            <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-3xl bg-white/10 border border-white/15 p-5"
                >
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-sm mt-2 text-[#ffd9b0]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                Vision for the future
              </p>
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-4">
                Building the next era of dining.
              </h2>
              <p className="text-[#7c4b4b] mt-4">
                We imagine a world where every menu is immersive, every dish is
                shareable, and every decision is confident. menuffy is the
                infrastructure layer that makes it real.
              </p>
              <ul className="mt-6 space-y-3 text-[#7c4b4b]">
                {visionPoints.map(point => (
                  <li key={point} className="flex gap-3">
                    <span className="text-[#a24e4e]">✦</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="rounded-3xl bg-white/70 border border-white/70 p-6 shadow-[0_20px_60px_rgba(124,47,47,0.12)]">
                <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                  Platform impact
                </p>
                <h3 className="text-2xl font-semibold text-[#7c2f2f] mt-3">
                  Empowering every restaurant team.
                </h3>
                <p className="text-[#7c4b4b] mt-3">
                  From single-location cafes to multi-outlet groups, teams get a
                  consistent, premium menu experience without extra tools.
                </p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-[#fff1cf] via-[#ffe7d1] to-[#cce5ff] border border-white/70 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                  Positioning
                </p>
                <p className="text-xl font-semibold text-[#7c2f2f] mt-3">
                  We make people experience food before they order.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 pb-20">
          <div className="max-w-6xl mx-auto rounded-[36px] bg-white/70 border border-white/70 p-10 shadow-[0_30px_80px_rgba(124,47,47,0.18)]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                  Ready to experience it?
                </p>
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-4">
                  Bring your menu to life.
                </h2>
                <p className="text-[#7c4b4b] mt-3">
                  Join restaurants using immersive menus to drive more confident
                  orders.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard?mode=demo" className="btn-primary">
                  Start the demo
                </Link>
                <Link
                  href="/dashboard?mode=demo#walkthrough"
                  className="px-6 py-3 rounded-full border border-[#a24e4e] text-[#7c2f2f] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition"
                >
                  Book a walkthrough
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
