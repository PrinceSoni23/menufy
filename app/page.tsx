"use client";

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
import {
  ShoppingBag,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  QrCode,
  Smartphone,
  Gift,
  BadgeCheck,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const FloatingDishBackground = dynamic(
  () =>
    import("@/components/3d/FloatingDishBackground").then(
      mod => mod.FloatingDishBackground,
    ),
  { ssr: false },
);

const InteractivePizza = dynamic(
  () =>
    import("@/components/3d/InteractivePizza").then(
      mod => mod.InteractivePizza,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-110 rounded-[2rem] border border-white/70 bg-white/35 backdrop-blur-xl animate-pulse" />
    ),
  },
);

const features = [
  {
    number: "01",
    title: "End-to-End Ordering",
    description:
      "From QR scan to checkout, guests can browse dishes, customize orders, and complete purchases in one smooth journey.",
    icon: ShoppingBag,
    imageSrc: "/features/Customer_scanning.jpeg",
    imageAlt: "Stylish plated appetizer on a menu image",
    glow: "radial-gradient(circle, rgba(255, 151, 108, 0.24), transparent 60%)",
    iconBg: "bg-[#ffe5d5]/90 text-[#c25a3b]",
    ctaColor: "text-[#c25a3b] hover:text-[#a24e4e]",
  },
  {
    number: "02",
    title: "Personalized Dining",
    description:
      "Support custom dishes, modifiers, preferences, and multilingual menus so every order feels clear and convenient.",
    icon: Sparkles,
    imageSrc: "/features/Guest.jpeg",
    imageAlt: "Premium menu dish photo",
    glow: "radial-gradient(circle, rgba(249, 199, 188, 0.24), transparent 55%)",
    iconBg: "bg-[#ffe7e0]/90 text-[#c16143]",
    ctaColor: "text-[#c16143] hover:text-[#a24e4e]",
  },
  {
    number: "03",
    title: "Smarter Insights",
    description:
      "Track scans, item views, conversion, repeat visits, and top-performing dishes so owners can act on real behavior.",
    icon: BarChart3,
    imageSrc: "/features/Analytics.jpeg",
    imageAlt: "Dining table with menu analytics ambiance",
    glow: "radial-gradient(circle, rgba(94, 147, 255, 0.2), transparent 60%)",
    iconBg: "bg-[#eef5ff]/90 text-[#2352b5]",
    ctaColor: "text-[#2352b5] hover:text-[#1d3f83]",
  },
  {
    number: "04",
    title: "Fast Owner Control",
    description:
      "Manage availability, pricing, seasonal specials, and menu content effortlessly from one centralized dashboard in just minutes.",
    icon: SlidersHorizontal,
    imageSrc: "/features/Restaurant_owner.jpeg",
    imageAlt: "Cocktails and menu controls in a restaurant setting",
    glow: "radial-gradient(circle, rgba(129, 191, 127, 0.2), transparent 60%)",
    iconBg: "bg-[#e6f6e8]/90 text-[#3f7b4f]",
    ctaColor: "text-[#3f7b4f] hover:text-[#2d5f3c]",
  },
  {
    number: "05",
    title: "QR Code Menu",
    description:
      "Guests scan a single code and access a premium digital menu instantly on any device and can order the dishes .",
    icon: QrCode,
    imageSrc: "/features/Hand_scanning_QR.jpeg",
    imageAlt: "QR code menu experience on a mobile device",
    glow: "radial-gradient(circle, rgba(255, 197, 96, 0.2), transparent 60%)",
    iconBg: "bg-[#fff1dc]/90 text-[#c87f3b]",
    ctaColor: "text-[#c87f3b] hover:text-[#a24e4e]",
  },
  {
    number: "06",
    title: "AR Dish Views",
    description:
      "Let guests preview dishes in augmented reality before they order for a more confident experience.",
    icon: Smartphone,
    imageSrc: "/features/AR.jpeg",
    imageAlt: "Augmented reality dish preview on a mobile screen",
    glow: "radial-gradient(circle, rgba(142, 191, 255, 0.2), transparent 60%)",
    iconBg: "bg-[#e6f2ff]/90 text-[#3b6fa2]",
    ctaColor: "text-[#3b6fa2] hover:text-[#1d4d7b]",
  },
  {
    number: "07",
    title: "Loyalty & Offers",
    description:
      "Reward repeat guests with personalized offers, promotions, and loyalty perks right in the menu experience.",
    icon: Gift,
    imageSrc: "/features/Loyalty_offers.jpeg",
    imageAlt: "Special offer and loyalty badge for guests",
    glow: "radial-gradient(circle, rgba(255, 221, 155, 0.2), transparent 60%)",
    iconBg: "bg-[#fff4dc]/90 text-[#b36d32]",
    ctaColor: "text-[#b36d32] hover:text-[#8c4a2b]",
  },
  {
    number: "08",
    title: "Kitchen Live Updates",
    description:
      "Keep guests informed with real-time kitchen status, order progress, and availability updates.",
    icon: BadgeCheck,
    imageSrc: "/features/Live_kitchen_updates.jpeg",
    imageAlt: "Real-time kitchen updates and availability status",
    glow: "radial-gradient(circle, rgba(167, 226, 180, 0.2), transparent 60%)",
    iconBg: "bg-[#e7f5eb]/90 text-[#3f7b47]",
    ctaColor: "text-[#3f7b47] hover:text-[#2d5f39]",
  },
];

const personas = [
  {
    role: "For New Brands",
    headline: "Launch a polished dining experience from day one",
    subtext:
      "Turn a first scan into a confident ordering journey with premium visuals, clear menus, and a seamless path from discovery to checkout.",
    benefit: "Professional presentation without a big team",
  },
  {
    role: "For Growing Restaurants",
    headline: "Scale faster with less manual work",
    subtext:
      "Update items, manage availability, support custom orders, and review guest behavior from one simple dashboard as your business grows.",
    benefit: "Operational clarity at every location",
  },
  {
    role: "For Premium Concepts",
    headline: "Make every interaction feel premium and intentional",
    subtext:
      "Pair immersive visuals with smart ordering flows, personalization, and insights that support both guest delight and revenue growth.",
    benefit: "Brand experience that supports business results",
  },
];

const steps = [
  {
    number: "1",
    title: "Open the menu",
    description:
      "Guests scan a QR code and land in a premium, mobile-first experience that feels fast and effortless.",
  },
  {
    number: "2",
    title: "Explore and personalize",
    description:
      "Customers browse dishes, view 3D previews, and customize orders with modifiers, preferences, and clear options.",
  },
  {
    number: "3",
    title: "Complete the order",
    description:
      "The flow continues smoothly into checkout so guests can move from curiosity to purchase without friction.",
  },
  {
    number: "4",
    title: "Learn and improve",
    description:
      "Owners see what guests engage with most and use analytics to refine menus, offers, and conversion paths.",
  },
];

const proofMetrics = [
  { value: "31%", label: "Average order value lift", icon: "📈" },
  { value: "4.2x", label: "More repeat visits from QR menus", icon: "🔄" },
  { value: "78%", label: "Higher mobile engagement", icon: "📱" },
  { value: "3.1s", label: "Faster dish decision time", icon: "⚡" },
];

const testimonials = [
  {
    quote:
      "After 8 years in business, menuffy made us look premium in a way we never could before. Customers ask about our menu design more than our food.",
    author: "Ari Kapoor",
    role: "Founder, Ember Dining House",
    highlight: true,
  },
  {
    quote:
      "We switched from basic QR menus. The order confidence went up immediately. Same customers, 40% higher average bill.",
    author: "Sofia Mendes",
    role: "Operations Lead, Palm & Plate",
  },
  {
    quote:
      "It's genuinely impressive. Even other restaurateurs ask us who designed it. That's the kind of credibility this tool builds.",
    author: "Ethan Liu",
    role: "Marketing Director, Harbor Kitchens",
  },
];

const plans = [
  {
    name: "Growth",
    price: "$29.99",
    discountedPrice: "$19.99",
    duration: "/month",
    description: "For scaling restaurants",
    features: [
      "Unlimited dishes & pages",
      "End-to-end ordering flow",
      "Custom dish options & modifiers",
      "Advanced analytics dashboard",
      "Priority support",
      "Custom domain",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "Contact sales",
    description: "For multi-location businesses",
    features: [
      "White-label solution",
      "Multi-branch menu management",
      "Advanced reporting & insights",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
];

const stats = [
  { number: "100%", label: "Browser-Based " },
  { number: "1", label: "QR, Total access" },
  { number: "2.4x", label: "Average conversion lift" },
  { number: "360°", label: "AR Food Preview" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -45]);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const radialGradient = useMotionTemplate`radial-gradient(1200px circle at ${springX}% ${springY}%, rgba(160, 112, 77, 0.15), rgba(245, 237, 227, 0) 70%)`;

  return (
    <main
      id="main-content"
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
        <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-12 sm:pt-20 sm:pb-20">
          <div className="relative z-10 max-w-7xl mx-auto grid gap-10 lg:gap-14 lg:grid-cols-[1fr_1.08fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 space-y-6 max-w-2xl sm:space-y-7"
            >
              <div className="pointer-events-none absolute -inset-x-4 -inset-y-4 -z-10 rounded-[2rem] border border-white/55 bg-white/28 backdrop-blur-md shadow-[0_18px_50px_rgba(124,47,47,0.08)] sm:hidden" />
              <p className="uppercase tracking-[0.34em] text-[0.72rem] font-semibold text-[#7c2f2f] sm:text-[#7c4b4b]">
                The menuffy platform
              </p>
              <h1 className="hero-title not-italic text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem] tracking-[-0.06em] text-[#5d2d2d] sm:text-transparent sm:bg-gradient-to-r sm:from-[#1f2937] sm:via-[#6d5b3d] sm:to-[#a24e4e] sm:bg-clip-text">
                Make ordering feel like an experience, not a guess.
              </h1>
              <p className="text-base sm:text-xl text-[#5a443a] sm:text-[#5f4a40] max-w-xl leading-7 sm:leading-8">
                Menuffy helps restaurants present dishes beautifully, support
                custom orders, guide guests through checkout, and turn menu
                engagement into actionable analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 pt-2 sm:pt-3 md:pt-4 w-full sm:w-auto justify-center sm:justify-start items-center sm:items-start text-center sm:text-left">
                <Link
                  href="/book-demo"
                  className="btn-primary w-full sm:w-auto"
                >
                  Book a Demo
                </Link>
                {/* <Link
                  href="/book-demo"
                  className="px-6 py-3 rounded-full border border-[#a24e4e]/30 bg-white/70 backdrop-blur-md text-[#5d2d2d] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition shadow-[0_12px_30px_rgba(124,47,47,0.08)] text-center"
                >
                  Access your dashboard
                </Link> */}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:flex sm:flex-wrap sm:gap-4 sm:text-sm text-[#6f5a4d] pt-2">
                {stats.map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-2xl sm:rounded-full bg-white/72 border border-white/75 px-3 py-3 sm:px-4 sm:py-2.5 backdrop-blur-md shadow-[0_10px_30px_rgba(124,47,47,0.08)]"
                  >
                    <span className="font-semibold text-[#5d2d2d]">
                      {stat.number}
                    </span>{" "}
                    {stat.label}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="relative lg:pl-6 mx-auto w-full max-w-[28rem] lg:max-w-none"
            >
              <div className="absolute -inset-4 sm:-inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.75),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(162,78,78,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(204,229,255,0.45),transparent_40%)] blur-2xl opacity-70 sm:opacity-80" />
              <div className="relative rounded-[2rem] sm:rounded-[2.5rem] border border-white/70 bg-white/45 backdrop-blur-xl p-3 sm:p-5 shadow-[0_24px_70px_rgba(124,47,47,0.14)] sm:shadow-[0_40px_120px_rgba(124,47,47,0.16)]">
                <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/80 bg-[#fff9f0] aspect-[3/4] sm:aspect-[4/5] shadow-[0_20px_60px_rgba(124,47,47,0.18)] sm:shadow-[0_30px_80px_rgba(124,47,47,0.22)]">
                  <video
                    src="/vids.mp4"
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140b0b]/40 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
                    <div className="rounded-full border border-white/50 bg-white/80 px-2.5 py-1 text-[0.62rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-[#5d2d2d] backdrop-blur-md">
                      Signature menu
                    </div>
                    <div className="rounded-full border border-white/50 bg-[#fff1cf]/85 px-2.5 py-1 text-[0.62rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#5d2d2d] backdrop-blur-md">
                      AR ready
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:bottom-5 sm:left-5 sm:right-5 sm:gap-3 sm:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[1.1rem] sm:rounded-[1.4rem] border border-white/45 bg-black/22 p-3 sm:p-4 backdrop-blur-xl text-[#fff8f0] shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
                      <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[#f7d6b9]">
                        First impression
                      </p>
                      <p className="mt-2 text-[0.95rem] sm:text-xl font-semibold leading-tight">
                        Cinematic product storytelling with luxury-grade depth.
                      </p>
                    </div>
                    <div className="rounded-[1.1rem] sm:rounded-[1.4rem] border border-white/45 bg-white/88 p-3 sm:p-4 backdrop-blur-xl text-[#5d2d2d] shadow-[0_16px_50px_rgba(0,0,0,0.12)]">
                      <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[#8c3b3b]">
                        Scan to order
                      </p>
                      <p className="mt-2 text-xl sm:text-2xl font-semibold">
                        +31%
                      </p>
                      <p className="text-xs sm:text-sm text-[#6f5a4d]">
                        Higher average order value
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  style={{ y: y2 }}
                  whileHover={{ y: -10, rotate: 0 }}
                  className="absolute -bottom-4 right-2 w-[52%] max-w-[240px] rotate-[8deg] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-2 shadow-[0_24px_70px_rgba(124,47,47,0.2)] sm:-bottom-8 sm:right-10 sm:w-[42%]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                    <Image
                      src="/download (5).jpeg"
                      alt="Luxury dining interior mockup"
                      fill
                      sizes="(max-width: 1024px) 45vw, 18vw"
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  style={{ y: y1 }}
                  whileHover={{ y: -8 }}
                  className="absolute -left-4 top-8 hidden sm:block w-[38%] max-w-[220px] rounded-[1.5rem] border border-white/75 bg-white/78 p-3 backdrop-blur-xl shadow-[0_18px_60px_rgba(124,47,47,0.16)]"
                >
                  <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[#8c3b3b]">
                    Premium Experience
                  </p>
                  <div className="mt-3 rounded-[1.1rem] bg-[linear-gradient(135deg,rgba(255,241,207,0.95),rgba(231,211,211,0.82),rgba(204,229,255,0.8))] p-4 text-[#5d2d2d] shadow-inner">
                    <p className="text-sm font-semibold leading-snug">
                      A premium, interactive menu that leaves a lasting first
                      impression.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 pb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-[36px] p-6 sm:p-8 lg:p-10"
              style={{ perspective: "1000px" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                    Interactive 3D menu
                  </p>
                  <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-3">
                    Rotate, zoom, and inspect every ingredient.
                  </h2>
                </div>
                <Link
                  href="/menu/kitchen"
                  className="px-6 py-3 rounded-full border border-[#a24e4e] text-[#7c2f2f] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition"
                >
                  Try the full demo menu
                </Link>
              </div>
              <div
                className="relative w-full h-80 sm:h-96 md:h-[28rem] lg:h-[34rem]"
                style={{ perspective: "1000px" }}
              >
                <InteractivePizza />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-12 bg-[#F1E6D3]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <p className="text-sm uppercase tracking-[0.32em] text-[#a15944]">
                SIGNATURE EXPERIENCE
              </p>
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#241b18] mt-4">
                Designed to feel as good as it performs.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6d5e57] sm:text-base">
                Everything you need to deliver a delightful dining experience
                and run your restaurant smarter.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_28px_110px_rgba(124,47,47,0.12)]"
                >
                  <div className="relative h-64 overflow-hidden rounded-[32px] bg-slate-100">
                    <div className="absolute inset-0">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/15" />
                    </div>
                    {/* <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-sm font-semibold text-[#241b18] shadow-sm">
                      {feature.number}
                    </div> */}
                    {/* <div className="absolute inset-x-4 top-16 rounded-[28px] border border-white/80 bg-white/85 p-4 shadow-[0_24px_68px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                      <div className="h-9 rounded-[22px] bg-slate-100" />
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#f3e4db]" />
                        <div className="h-3 w-3 rounded-full bg-[#f3e4db]" />
                        <div className="h-3 w-3 rounded-full bg-[#f3e4db]" />
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="h-12 rounded-[20px] bg-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]" />
                        <div className="h-10 rounded-[18px] bg-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]" />
                        <div className="h-10 rounded-[18px] bg-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]" />
                      </div>
                    </div> */}
                    <div
                      className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full opacity-90 transition duration-500 group-hover:scale-105"
                      style={{ background: feature.glow }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 bg-white px-6 pb-6 pt-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg}`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#241b18]">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#6d5e57]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span
                        className={`text-sm font-semibold ${feature.ctaColor}`}
                      >
                        Explore
                      </span>
                      <span className={`text-lg font-bold ${feature.ctaColor}`}>
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-[#6d5e57]">
                And Many more such features..Built for restaurants. Loved by
                guests. <span className="text-[#d65a45]">♥</span>
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f]">
                Built for restaurants that want more than a static menu.
              </h2>
              <p className="text-[#7c4b4b] mt-4 max-w-3xl">
                From first-time launches to multi-location groups, menuffy
                brings premium presentation, smoother ordering, personalization,
                and real analytics into one platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {personas.map((persona, i) => (
                <motion.div
                  key={persona.role}
                  initial={{ opacity: 0, y: 24, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, rotateX: 4, scale: 1.02 }}
                  className="rounded-3xl bg-gradient-to-br from-[#fff1cf]/90 to-[#e7d3d3]/90 border border-white/70 p-6 sm:p-7"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8c3b3b]">
                    {persona.role}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#7c2f2f] mt-3">
                    {persona.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-[#7c4b4b] mt-3">
                    {persona.subtext}
                  </p>
                  <p className="text-sm font-semibold text-[#7c2f2f] mt-5">
                    {persona.benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f]">
                Scan. Personalize. Order. Learn.
              </h2>
              <p className="text-[#7c4b4b] mt-4 max-w-3xl">
                A frictionless flow that turns curiosity into confident
                purchases and gives owners the insight to improve every step.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="rounded-3xl bg-white/70 border border-white/70 p-6 sm:p-7 shadow-[0_20px_60px_rgba(124,47,47,0.12)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-semibold text-[#a24e4e]">
                      {step.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#7c2f2f]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-[#7c4b4b]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto rounded-[32px] bg-gradient-to-br from-[#a24e4e] via-[#8c3b3b] to-[#7c2f2f] text-[#fff1cf] p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#ffd9b0]">
                  Proof of impact
                </p>
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl mt-4">
                  Restaurants grow smarter with menuffy.
                </h2>
              </div>
              <Link
                href="/book-demo"
                className="px-6 py-3 rounded-full bg-[#fff1cf] text-[#7c2f2f] font-semibold hover:bg-white transition"
              >
                View the dashboard
              </Link>
            </div>

            <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {proofMetrics.map(metric => (
                <div
                  key={metric.label}
                  className="rounded-3xl bg-white/10 border border-white/15 p-5"
                >
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <p className="text-sm mt-2 text-[#ffd9b0]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f]">
                Loved by premium brands.
              </h2>
              <p className="text-[#7c4b4b] mt-4 max-w-3xl mx-auto">
                Restaurants that care about their brand experience see real
                conversion lift.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={
                    testimonial.highlight
                      ? "rounded-3xl bg-gradient-to-br from-[#fff1cf]/70 to-[#cce5ff]/70 border border-[#7c2f2f]/30 p-6 sm:p-8"
                      : "rounded-3xl bg-white/70 border border-white/70 p-6 sm:p-8"
                  }
                >
                  <p className="text-base sm:text-lg text-[#7c4b4b] leading-relaxed mb-4 sm:mb-6 font-medium">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#7c2f2f]/10">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br from-[#7c2f2f] via-[#8b6f47] to-[#cce5ff] shrink-0 shadow-md" />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#7c2f2f] text-sm sm:text-base">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-[#7c4b4b]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 sm:px-6 lg:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f]">
                Simple, fair pricing.
              </h2>
              <p className="text-[#7c4b4b] mt-4 max-w-3xl mx-auto">
                Scale from free to enterprise with clear, flexible plans.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-stretch">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className={
                    plan.highlight
                      ? "h-full rounded-3xl bg-gradient-to-br from-[#a24e4e]/15 to-[#cce5ff]/15 border-2 border-[#a24e4e] p-8 sm:p-10 shadow-[0_25px_70px_rgba(124,47,47,0.2)] flex flex-col"
                      : "h-full rounded-3xl bg-white/70 border border-white/70 p-8 sm:p-10 flex flex-col"
                  }
                >
                  {plan.highlight && (
                    <div className="inline-flex items-center rounded-full bg-[#a24e4e] text-white px-3 py-1 text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8c3b3b]">
                      {plan.name}
                    </p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <h3 className="text-3xl sm:text-4xl font-semibold text-[#7c2f2f]">
                        {plan.discountedPrice || plan.price}
                      </h3>
                      <span className="text-lg sm:text-xl text-[#7c4b4b] line-through">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#7c4b4b] mt-1 font-semibold">
                      {plan.duration}
                    </p>
                    <p className="text-sm sm:text-base text-[#7c4b4b] mt-3">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mt-6 mb-6 pb-6 border-b border-[#7c2f2f]/10 flex-1">
                    {plan.features.map(feature => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 sm:gap-3 text-[#7c4b4b]"
                      >
                        <span className="text-[#a24e4e] text-lg mt-0.5 shrink-0 font-bold">
                          ✓
                        </span>
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/book-demo"
                    className={
                      plan.highlight
                        ? "btn-primary w-full flex justify-center text-sm sm:text-base"
                        : "btn-secondary w-full flex justify-center text-sm sm:text-base"
                    }
                  >
                    Get started
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm sm:text-base text-[#7c4b4b] mb-3">
                Questions? We are happy to walk you through it.
              </p>
              <Link
                href="/book-demo"
                className="text-[#7c2f2f] text-sm sm:text-base font-semibold hover:text-[#7c2f2f] transition"
              >
                Book a walkthrough →
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 pb-20">
          <div className="max-w-6xl mx-auto rounded-[36px] bg-white/70 border border-white/70 p-10 shadow-[0_30px_80px_rgba(124,47,47,0.18)]">
            {/* <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="rounded-[36px] p-6 sm:p-8 lg:p-10"
              style={{ perspective: "1000px" }}
            > */}
            {/* <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8c3b3b]">
                    Interactive 3D menu
                  </p>
                  <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f] mt-3">
                    Rotate, zoom, and inspect every ingredient.
                  </h2>
                </div>
                <Link
                  href="/dashboard?mode=demo#menu"
                  className="px-6 py-3 rounded-full border border-[#a24e4e] text-[#7c2f2f] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition"
                >
                  Try the full menu
                </Link>
              </div>
              <div
                className="relative w-full h-auto sm:h-96 md:h-[28rem] lg:h-[34rem]"
                style={{ perspective: "1000px" }}
              >
                <InteractivePizza />
              </div> */}
            {/* </motion.div> */}

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl text-[#7c2f2f]">
                  Bring your full dining experience online.
                </h2>
                <p className="text-[#7c4b4b] mt-3">
                  Join restaurants using immersive menus, smart ordering flows,
                  <br />
                  and analytics to create better guest experiences and stronger
                  results.
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center justify-start gap-3 sm:gap-4">
                <Link
                  href="/book-demo"
                  className="btn-primary whitespace-nowrap"
                >
                  Ask the demo
                </Link>
                <Link
                  href="/menu/kitchen"
                  className="whitespace-nowrap px-6 py-3 rounded-full border border-[#a24e4e] text-[#7c2f2f] font-semibold hover:bg-[#a24e4e] hover:text-[#fff1cf] transition"
                >
                  Explore demo Menu
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
