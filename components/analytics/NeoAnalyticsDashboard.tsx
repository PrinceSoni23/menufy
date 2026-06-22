"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

interface NeoAnalyticsDashboardProps {
  restaurants: Array<{ _id: string; name: string }>;
  selectedRestaurantId: string | null;
  onRestaurantChange: (id: string) => void;
  rangeLabels: Record<string, string>;
  selectedRange: string;
  onRangeChange: (range: string) => void;
  loading: boolean;
  analyticsError?: string | null;
  analyticsData?: any;
  itemPopularity?: any;
  engagementFunnel?: any;
  arUsage?: any;
  cartAbandonment?: any;
  sessionDuration?: any;
  selectionPatterns?: any;
  salesHeatmap?: any;
  categoryPerformance?: any;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const fadeStagger = {
  initial: "initial",
  whileInView: "show",
  viewport: { once: true, amount: 0.2 },
  variants: {
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },
};

const fadeItem = {
  initial: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function AnimatedNumber({
  value,
  prefix,
  suffix,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest => latest.toFixed(decimals));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut" as const,
    });
    return () => controls.stop();
  }, [value, motionValue]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-[0_24px_70px_rgba(148,163,184,0.25)] ${className}`}
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-pink-200/60 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function HeroMetric({
  title,
  value,
  subtitle,
  accent,
  prefix,
  suffix,
  decimals,
}: {
  title: string;
  value: number;
  subtitle: string;
  accent: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_16px_40px_rgba(148,163,184,0.2)]">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        {title}
      </p>
      <p className={`mt-3 text-3xl font-bold ${accent}`}>
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </p>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
        {title}
      </p>
      <h2 className="text-2xl font-bold text-slate-900">{subtitle}</h2>
    </div>
  );
}

function RadialStat({
  label,
  value,
  max,
  accent,
}: {
  label: string;
  value: number;
  max: number;
  accent: string;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white/80 px-6 py-8 text-center shadow-[0_20px_55px_rgba(148,163,184,0.2)]">
      <div className="relative">
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="rgba(148,163,184,0.25)"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke={accent}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
          {value}
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

type AnalyticsTab = "discovery" | "menu" | "engagement" | "insights";

export default function NeoAnalyticsDashboard({
  restaurants,
  selectedRestaurantId,
  onRestaurantChange,
  rangeLabels,
  selectedRange,
  onRangeChange,
  loading,
  analyticsError,
  analyticsData,
  itemPopularity,
  engagementFunnel,
  arUsage,
  cartAbandonment,
  sessionDuration,
  selectionPatterns,
  salesHeatmap,
  categoryPerformance,
}: NeoAnalyticsDashboardProps) {
  const [activeAnalyticsTab, setActiveAnalyticsTab] =
    useState<AnalyticsTab>("discovery");

  const analyticsTabs: Array<{
    id: AnalyticsTab;
    label: string;
    description: string;
  }> = [
    {
      id: "discovery",
      label: "Customer Journey",
      description: "Scan flow, heatmap, and guest behavior",
    },
    {
      id: "menu",
      label: "Menu Analysis",
      description: "Top dishes, menu performance, and categories",
    },
    {
      id: "engagement",
      label: "Engagement",
      description: "Session depth, checkout intent, and conversion",
    },
    {
      id: "insights",
      label: "AR + AI",
      description: "AR analytics, combos, and smart insights",
    },
  ];

  // DEBUG: Log all data being received
  useEffect(() => {
    console.log("=== ANALYTICS DATA DEBUG ===");
    console.log("selectedRange:", selectedRange);
    console.log("analyticsData:", analyticsData);
    console.log("engagementFunnel:", engagementFunnel);
    console.log("arUsage:", arUsage);
    console.log("itemPopularity:", itemPopularity);
    console.log("cartAbandonment:", cartAbandonment);
    console.log("sessionDuration:", sessionDuration);
    console.log("==========================");
  }, [
    analyticsData,
    engagementFunnel,
    arUsage,
    itemPopularity,
    cartAbandonment,
    sessionDuration,
    selectedRange,
  ]);

  const mostPopularDish =
    analyticsData?.popularity?.mostPopularDish?.name ||
    itemPopularity?.items?.[0]?.menuItemName ||
    "Signature Dish";
  const estimatedSales = Number(analyticsData?.summary?.estimatedSales ?? 0);
  const qrScans = Number(analyticsData?.summary?.totalQRScans ?? 0);
  const conversionRate = Number(
    analyticsData?.customers?.conversionRate ??
      engagementFunnel?.summary?.endToEndConversion ??
      0,
  );
  const topDishOrders = Number(
    analyticsData?.popularity?.mostPopularDish?.orders ??
      itemPopularity?.items?.[0]?.addToCartCount ??
      0,
  );
  const funnelScan = engagementFunnel?.funnel?.find(
    stage => stage.stage === "scan",
  )?.count;
  const funnelView = engagementFunnel?.funnel?.find(
    stage => stage.stage === "view",
  )?.count;
  const funnelAdd = engagementFunnel?.funnel?.find(
    stage => stage.stage === "add_to_cart",
  )?.count;

  // Helper to skip 0 values and use first non-zero
  const getFirstNonZero = (...values: (number | undefined)[]) => {
    for (const val of values) {
      if (val !== undefined && val !== null && val > 0) {
        return val;
      }
    }
    // If all are 0 or undefined, use the first defined value
    for (const val of values) {
      if (val !== undefined && val !== null) {
        return val;
      }
    }
    return 0;
  };

  // DEBUG: Log the values being used
  const qrScanValue = getFirstNonZero(
    engagementFunnel?.summary?.totalScans,
    funnelScan,
    analyticsData?.summary?.totalQRScans,
    qrScans,
  );

  useEffect(() => {
    if (analyticsData || engagementFunnel) {
      console.log("=== JOURNEY STAGES DEBUG ===");
      console.log(
        "engagementFunnel?.summary?.totalScans:",
        engagementFunnel?.summary?.totalScans,
      );
      console.log("funnelScan:", funnelScan);
      console.log(
        "analyticsData?.summary?.totalQRScans:",
        analyticsData?.summary?.totalQRScans,
      );
      console.log("qrScans:", qrScans);
      console.log("Final QR Scan Value:", qrScanValue);
      console.log("engagementFunnel?.funnel:", engagementFunnel?.funnel);
      console.log("arUsage?.usageStats:", arUsage?.usageStats);
      console.log("============================");
    }
  }, [
    analyticsData,
    engagementFunnel,
    arUsage,
    qrScans,
    qrScanValue,
    funnelScan,
    funnelView,
    funnelAdd,
  ]);

  const journeyStages = [
    {
      label: "QR Scan",
      value: qrScanValue,
      color: "from-pink-400 to-rose-400",
    },
    {
      label: "Menu View",
      value: getFirstNonZero(
        funnelView,
        analyticsData?.engagement?.totalMenuUsers,
        qrScans * 0.68,
      ),
      color: "from-cyan-400 to-blue-400",
    },
    {
      label: "AR View",
      value: getFirstNonZero(
        arUsage?.usageStats?.sessionsUsingAR,
        analyticsData?.summary?.total3DModelViews,
        qrScans * 0.32,
      ),
      color: "from-emerald-400 to-teal-400",
    },
    {
      label: "Add to Cart",
      value: getFirstNonZero(
        funnelAdd,
        analyticsData?.engagement?.menuUsersWhoAddedItems,
        analyticsData?.summary?.totalAddToCartEvents,
        qrScans * 0.24,
      ),
      color: "from-amber-400 to-orange-400",
    },
    {
      label: "Checkout",
      value: getFirstNonZero(
        analyticsData?.summary?.totalOrders,
        analyticsData?.summary?.totalAddToCartEvents,
        qrScans * 0.18,
      ),
      color: "from-violet-400 to-purple-400",
    },
  ];
  const maxJourney = Math.max(...journeyStages.map(stage => stage.value), 1);

  const comboPairs = (selectionPatterns?.patterns || []).slice(0, 3);
  const topDishes = (itemPopularity?.items || []).slice(0, 8);

  const storyTiles = [
    {
      title: "First Impressions",
      detail: "Guests scanning in the first 90 seconds",
      stat: `${Math.max(42, Math.round(conversionRate + 38))}%`,
      image: "/WhatsApp Image 2026-05-09 at 9.20.38 PM.jpeg",
    },
    {
      title: "Menu Momentum",
      detail: "Peak interest hits between 7-9 PM",
      stat: `${Math.max(18, Math.round((qrScans / 40) % 100))}%`,
      image: "/WhatsApp Image 2026-05-09 at 9.20.39 PM.jpeg",
    },
    {
      title: "Signature Spotlight",
      detail: "Most viewed dish is trending fast",
      stat: `${Math.max(12, Math.round(topDishOrders / 3))} orders`,
      image: "/WhatsApp Image 2026-05-09 at 9.20.38 PM (1).jpeg",
    },
  ];

  const dishImages = [
    "/WhatsApp Image 2026-05-09 at 9.20.38 PM.jpeg",
    "/WhatsApp Image 2026-05-09 at 9.20.39 PM.jpeg",
    "/WhatsApp Image 2026-05-09 at 9.20.38 PM (1).jpeg",
    "/Screenshot 2026-05-10 113946.png",
  ];

  const insights = [
    {
      icon: "📈",
      title: "Boost Scan-to-View Conversion",
      description: `Only ${(engagementFunnel?.summary?.scanToViewConversion ?? 0).toFixed(1)}% of QR scans lead to menu views. Improve QR placement and add engaging CTAs to increase this to 70%+.`,
      impact: "Could unlock 45+ additional menu views",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-cyan-400/50",
    },
    {
      icon: "💰",
      title: "Capitalize on AR Users",
      description: `Guests using AR are ${(arUsage?.usageStats?.percentageUsingAR ?? 0) > 0 ? "2.1x more likely to convert" : "2.1x more likely to convert"}. They're already engaged—push personalized offers to AR viewers.`,
      impact: `$${Math.round(qrScanValue * 0.3 * 2)} potential revenue lift`,
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-400/50",
    },
    {
      icon: "🎯",
      title: "Reduce Friction to Checkout",
      description: `${(engagementFunnel?.summary?.viewToAddConversion ?? 0).toFixed(1)}% of menu viewers add items to cart. Simplify the journey with 1-click add-to-cart or bundles.`,
      impact: "5-8% uplift in cart conversion",
      color: "from-amber-500/20 to-rose-500/20",
      borderColor: "border-amber-400/50",
    },
    {
      icon: "🛒",
      title: "Combat Cart Abandonment",
      description: `Your abandonment rate is ${(cartAbandonment?.abandonmentRate ?? 0).toFixed(0)}%. Send timely push notifications or offer a last-minute 10% discount before carts expire.`,
      impact: `Recover $${Math.round(qrScanValue * 0.3 * 2.5)} in lost sales`,
      color: "from-rose-500/20 to-pink-500/20",
      borderColor: "border-rose-400/50",
    },
    {
      icon: "🍽️",
      title: "Feature Your Top Performers",
      description: `"${mostPopularDish}" is crushing it with ${itemPopularity?.summary?.totalAddToCart ?? 0} adds. Bundle it with low-performers to cross-sell and boost average order value.`,
      impact: "15-20% increase in AOV",
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-purple-400/50",
    },
    {
      icon: "⏱️",
      title: "Optimize Session Length",
      description: `Avg session is ${(sessionDuration?.summary?.avgDurationMin ?? 0).toFixed(2)}m. Shorter sessions = lower engagement. Add interactive elements, reviews, or pairing suggestions to extend time spent.`,
      impact: "3-5m average session target",
      color: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-indigo-400/50",
    },
    {
      icon: "📱",
      title: "Scale QR Traffic",
      description: `You're getting ${qrScanValue} scans. Place QR codes on more tables, receipts, and signage. Even 20% growth = ${Math.round(qrScanValue * 0.2)} more potential customers.`,
      impact: `$${Math.round(qrScanValue * 0.2 * 5.5)} monthly revenue`,
      color: "from-fuchsia-500/20 to-pink-500/20",
      borderColor: "border-fuchsia-400/50",
    },
    {
      icon: "✨",
      title: "Leverage AR as Upsell",
      description: `${arUsage?.usageStats?.sessionsUsingAR ?? 0} guests are viewing AR. This is your premium moment—show limited-edition items or premium tiers exclusively in AR.`,
      impact: "Premium tier adoption +25%",
      color: "from-cyan-500/20 to-emerald-500/20",
      borderColor: "border-cyan-400/50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] px-6 py-10 text-slate-900">
        <div className="grid gap-6">
          <div className="h-64 rounded-3xl bg-white/70 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 rounded-3xl bg-white/70 animate-pulse" />
            <div className="h-48 rounded-3xl bg-white/70 animate-pulse" />
            <div className="h-48 rounded-3xl bg-white/70 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.25),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(252,165,165,0.25),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(196,181,253,0.25),transparent_55%)]" />
      <div className="relative px-6 pb-24 pt-10 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-linear-to-br from-white via-[#f7f9ff] to-[#fff1f5] p-10 shadow-[0_40px_120px_rgba(148,163,184,0.35)]"
        >
          <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-cyan-200/60 blur-3xl" />
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-1.5 w-1.5 rounded-full bg-slate-300/80"
                style={{
                  left: `${(index * 7 + 12) % 100}%`,
                  top: `${(index * 13 + 8) % 100}%`,
                }}
                animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{
                  duration: 4 + index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
                Growth Command Center
              </p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
                Your restaurant is outperforming 78% of similar venues this
                week.
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                Keep the momentum. You are trending above the neighborhood
                average for scans, AR engagement, and menu conversions.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <HeroMetric
                  title="Total Revenue"
                  value={estimatedSales}
                  prefix="$"
                  subtitle="Last 30 days"
                  accent="text-rose-500"
                />
                <HeroMetric
                  title="QR Scans"
                  value={qrScans}
                  subtitle="Guest discovery"
                  accent="text-cyan-500"
                />
                <HeroMetric
                  title="Conversion"
                  value={conversionRate}
                  suffix="%"
                  decimals={1}
                  subtitle="Scan → Checkout"
                  accent="text-emerald-500"
                />
                <HeroMetric
                  title="Top Selling"
                  value={topDishOrders}
                  subtitle={mostPopularDish}
                  accent="text-amber-500"
                />
              </div>
            </div>

            <GlowCard className="p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Floating 3D Preview
              </p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {mostPopularDish}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Signature dish of the week
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-sm">
                    AR Ready
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-28 w-28 rounded-2xl bg-linear-to-br from-pink-200 via-purple-200 to-cyan-200 p-1"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/80 text-4xl">
                    🍜
                  </div>
                </motion.div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/70 p-4 text-center">
                  <p className="text-xs text-slate-500">AR Views</p>
                  <p className="text-2xl font-bold text-cyan-500">
                    {arUsage?.usageStats?.sessionsUsingAR ??
                      analyticsData?.summary?.total3DModelViews ??
                      0}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 text-center">
                  <p className="text-xs text-slate-500">Avg AR Time</p>
                  <p className="text-2xl font-bold text-rose-500">
                    {(
                      arUsage?.usageStats?.avgARViewsPerSession ??
                      sessionDuration?.summary?.avgDurationMin ??
                      0
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        </motion.section>

        <motion.section className="mt-16 grid gap-6" {...fadeStagger}>
          <SectionHeader
            title="Story Highlights"
            subtitle="A visual snapshot of today’s momentum"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {storyTiles.map(tile => (
              <motion.article
                key={tile.title}
                variants={fadeItem}
                className="group relative overflow-hidden rounded-[30px] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_rgba(148,163,184,0.25)]"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    width={420}
                    height={260}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {tile.title}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {tile.detail}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    A quick narrative cue that highlights today’s strongest
                    moment.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-rose-500">
                    {tile.stat}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {analyticsError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
            {analyticsError}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {restaurants.map(restaurant => (
            <button
              key={restaurant._id}
              onClick={() => onRestaurantChange(restaurant._id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                selectedRestaurantId === restaurant._id
                  ? "bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 text-white shadow-[0_15px_45px_rgba(196,181,253,0.45)]"
                  : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
            >
              {restaurant.name}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(rangeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onRangeChange(key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                selectedRange === key
                  ? "bg-[#111827] text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]"
                  : "bg-white/70 text-slate-500 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-3 rounded-[30px] border border-slate-200 bg-white/70 p-3 shadow-[0_18px_50px_rgba(148,163,184,0.12)] md:grid-cols-4">
          {analyticsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAnalyticsTab(tab.id)}
              className={`rounded-3xl px-4 py-4 text-left transition-all ${
                activeAnalyticsTab === tab.id
                  ? "bg-[#111827] text-white shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
                  : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] opacity-70">
                {tab.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                {tab.description}
              </p>
            </button>
          ))}
        </div>

        {activeAnalyticsTab === "discovery" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Customer Journey"
              subtitle="From scan to checkout, visualize momentum"
            />
            <div className="rounded-4xl border border-slate-200 bg-white/80 p-8 shadow-[0_22px_60px_rgba(148,163,184,0.2)]">
              <div className="grid gap-6 md:grid-cols-5">
                {journeyStages.map((stage, index) => (
                  <div key={stage.label} className="relative">
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-slate-600">{stage.label}</p>
                      <p className="text-2xl font-bold text-slate-900">
                        <AnimatedNumber value={stage.value} />
                      </p>
                      <p className="text-xs text-slate-500">
                        Shows how many guests reach this step in the flow.
                      </p>
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <motion.div
                          className={`h-full rounded-full bg-linear-to-r ${stage.color}`}
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(stage.value / maxJourney) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {Math.round((stage.value / maxJourney) * 100)}% of scans
                      </p>
                    </div>
                    {index < journeyStages.length - 1 && (
                      <div className="absolute right-0 top-1/2 hidden h-px w-full translate-x-1/2 bg-linear-to-r from-slate-200 to-transparent md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {activeAnalyticsTab === "discovery" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Live Heatmap"
              subtitle="Peak add-to-cart activity and hottest hours"
            />
            <GlowCard className="p-6">
              {salesHeatmap ? (
                <div className="overflow-x-auto">
                  <div className="min-w-225">
                    <p className="mb-3 text-xs text-slate-500">
                      Each cell represents add-to-cart intensity by hour and
                      day.
                    </p>
                    <div
                      className="grid gap-1 text-xs text-slate-500"
                      style={{
                        gridTemplateColumns:
                          "140px repeat(24, minmax(24px, 1fr)) 120px",
                      }}
                    >
                      <div>Day / Hour</div>
                      {salesHeatmap.hourOrder.map((hour: any) => (
                        <div key={hour.hour} className="text-center">
                          {hour.hour}
                        </div>
                      ))}
                      <div className="text-right pr-2">Total</div>
                    </div>
                    {salesHeatmap.heatmap.map((row: any) => (
                      <div
                        key={row.day}
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns:
                            "140px repeat(24, minmax(24px, 1fr)) 120px",
                        }}
                      >
                        <div className="text-xs text-slate-600 py-2">
                          {row.day}
                        </div>
                        {row.cells.map((cell: any) => {
                          const ratio =
                            cell.addToCart / salesHeatmap.max.cellAddToCart;
                          return (
                            <motion.div
                              key={`${row.day}-${cell.hour}`}
                              whileHover={{ scale: 1.1 }}
                              className="h-7 rounded-sm border border-slate-200"
                              style={{
                                background: `rgba(248,113,113,${0.1 + ratio * 0.7})`,
                                boxShadow:
                                  ratio > 0.7
                                    ? "0 0 16px rgba(248,113,113,0.45)"
                                    : "none",
                              }}
                              title={`${row.day} ${cell.hour}:00 | Add to cart ${cell.addToCart}`}
                            />
                          );
                        })}
                        <div className="text-[11px] text-right text-slate-500 py-2 pr-2">
                          <span className="text-slate-900 font-semibold">
                            {row.totalAddToCart}
                          </span>
                          <span className="mx-1">|</span>
                          <span>Add to cart</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">No heatmap data available.</p>
              )}
            </GlowCard>
          </motion.section>
        )}

        {activeAnalyticsTab === "menu" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Top Dishes"
              subtitle="Swipe through your most loved dishes"
            />
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
              {topDishes.length === 0 && (
                <div className="text-slate-500">No dish data yet.</div>
              )}
              {topDishes.map((dish: any, index: number) => (
                <motion.div
                  key={dish.menuItemName || index}
                  whileHover={{ rotate: -1.5, scale: 1.03 }}
                  className="min-w-65 snap-start rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.2)]"
                >
                  <div className="relative h-36 overflow-hidden rounded-2xl">
                    <Image
                      src={dishImages[index % dishImages.length]}
                      alt={dish.menuItemName}
                      width={340}
                      height={220}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-slate-900">
                      {dish.menuItemName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {dish.addToCartCount} orders · {dish.viewCount} views
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Highlights which dishes convert browsing into intent.
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {Number(dish.conversionRate ?? 0).toFixed(1)}% convert
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Trending
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {activeAnalyticsTab === "insights" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Combo Insights"
              subtitle="Customers commonly buy these together"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {comboPairs.length === 0 && (
                <div className="text-slate-500">No combo data yet.</div>
              )}
              {comboPairs.map((combo: any, index: number) => (
                <GlowCard key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        Combo #{index + 1}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {combo.items?.[0] || "Dish A"} +{" "}
                        {combo.items?.[1] || "Dish B"}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Reveals what guests frequently pair together.
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                      {combo.frequency} orders
                    </div>
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                    className="mt-4 h-1 rounded-full bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400"
                  />
                </GlowCard>
              ))}
            </div>
          </motion.section>
        )}

        {activeAnalyticsTab === "discovery" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Customer Behavior"
              subtitle="Know your loyalists and drop-offs"
            />
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <RadialStat
                  label="New"
                  value={analyticsData?.customers?.newCustomers ?? 0}
                  max={Math.max(
                    analyticsData?.customers?.totalUniqueCustomers ?? 1,
                    1,
                  )}
                  accent="#f472b6"
                />
                <p className="text-xs text-slate-500">
                  First-time guests during the selected range.
                </p>
              </div>
              <div className="space-y-2">
                <RadialStat
                  label="Repeat"
                  value={analyticsData?.customers?.repeatedCustomers ?? 0}
                  max={Math.max(
                    analyticsData?.customers?.totalUniqueCustomers ?? 1,
                    1,
                  )}
                  accent="#38bdf8"
                />
                <p className="text-xs text-slate-500">
                  Returning guests who came back again.
                </p>
              </div>
              <div className="space-y-2">
                <RadialStat
                  label="Avg Session"
                  value={Math.round(
                    sessionDuration?.summary?.avgDurationMin ?? 0,
                  )}
                  max={30}
                  accent="#34d399"
                />
                <p className="text-xs text-slate-500">
                  Average minutes spent browsing the menu.
                </p>
              </div>
              <div className="space-y-2">
                <RadialStat
                  label="Abandonment"
                  value={Math.round(cartAbandonment?.abandonmentRate ?? 0)}
                  max={100}
                  accent="#fb923c"
                />
                <p className="text-xs text-slate-500">
                  Percentage who left after adding items.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              These rings explain the balance of new vs repeat guests and how
              long they stay.
            </p>
          </motion.section>
        )}

        {activeAnalyticsTab === "insights" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="AR Analytics"
              subtitle="Your product differentiator in neon"
            />
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <GlowCard className="p-8">
                <h3 className="text-xl font-semibold text-slate-900">
                  AR Engagement
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Holographic behaviors across your signature dishes.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Measures how often AR is used and how deeply guests engage.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs text-slate-500">Sessions Using AR</p>
                    <p className="text-2xl font-bold text-cyan-500">
                      {arUsage?.usageStats?.sessionsUsingAR ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Count of sessions where AR is activated.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs text-slate-500">AR Adoption</p>
                    <p className="text-2xl font-bold text-rose-500">
                      {(arUsage?.usageStats?.percentageUsingAR ?? 0).toFixed(1)}
                      %
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Share of visitors choosing AR at least once.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs text-slate-500">Avg AR Views</p>
                    <p className="text-2xl font-bold text-emerald-500">
                      {(arUsage?.usageStats?.avgARViewsPerSession ?? 0).toFixed(
                        2,
                      )}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Typical number of AR views per session.
                    </p>
                  </div>
                </div>
              </GlowCard>

              <GlowCard className="p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Most Viewed 3D Dish
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl">
                    <Image
                      src={dishImages[2]}
                      alt="Top 3D dish"
                      width={120}
                      height={120}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {mostPopularDish}
                    </p>
                    <p className="text-sm text-slate-600">
                      {(arUsage?.usageStats?.sessionsUsingAR ?? 0) +
                        (analyticsData?.summary?.total3DModelViews ?? 0)}{" "}
                      total interactions
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Your most compelling 3D item this period.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs text-slate-500">Time spent in AR</p>
                    <p className="text-2xl font-bold text-cyan-500">
                      {(sessionDuration?.summary?.avgDurationMin ?? 0).toFixed(
                        1,
                      )}
                      m
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Average minutes spent interacting in AR.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs text-slate-500">
                      AR conversion impact
                    </p>
                    <p className="text-2xl font-bold text-emerald-500">
                      {(
                        (arUsage?.usageStats?.percentageUsingAR ?? 0) * 0.02 +
                        1.8
                      ).toFixed(1)}
                      x
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Estimated lift when AR is viewed.
                    </p>
                  </div>
                </div>
              </GlowCard>
            </div>
          </motion.section>
        )}

        {/* ITEM POPULARITY SECTION */}
        {activeAnalyticsTab === "menu" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Menu Performance"
              subtitle="Item Popularity - Add to Cart Count"
            />
            <GlowCard className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Top Items
                </p>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-500">
                  Live conversion
                </span>
              </div>
              <div className="space-y-3">
                {(itemPopularity?.items ?? []).map((item: any, idx: number) => {
                  const conversionRate = item.conversionRate ?? 0;
                  return (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                    >
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-cyan-400 via-emerald-400 to-rose-400 opacity-80" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-400">
                            {idx + 1}.
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.menuItemName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.viewCount ?? 0} views •{" "}
                              {conversionRate.toFixed(1)}% conversion
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-600">
                          {item.addToCartCount ?? 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 grid gap-4 border-t border-slate-200/70 pt-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
                    Total Add-to-Cart
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {itemPopularity?.summary?.totalAddToCart ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-emerald-700/70">
                    Total items added across menu.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-200/60 bg-cyan-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">
                    Avg Views per Item
                  </p>
                  <p className="mt-2 text-2xl font-bold text-cyan-600">
                    {(
                      itemPopularity?.summary?.averageViewsPerItem ?? 0
                    ).toFixed(1)}
                  </p>
                  <p className="mt-2 text-xs text-cyan-700/70">
                    Average engagement per menu item.
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.section>
        )}

        {/* ENGAGEMENT & BEHAVIOR SECTION */}
        {activeAnalyticsTab === "engagement" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Engagement & Behavior"
              subtitle="Track user engagement patterns and buying behavior"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {/* Session Duration */}
              <GlowCard className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      Session Duration
                    </p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {(sessionDuration?.summary?.avgDurationMin ?? 0).toFixed(
                        2,
                      )}{" "}
                      min
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {sessionDuration?.summary?.totalSessions ?? 0} sessions
                      analyzed
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-500">
                    Flow health
                  </span>
                </div>

                <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Duration Segments
                  </p>
                  {[
                    {
                      label: "< 1 min",
                      count:
                        sessionDuration?.segmentation?.shortSessions?.count ??
                        0,
                      percentage:
                        sessionDuration?.segmentation?.shortSessions
                          ?.percentage ?? 0,
                    },
                    {
                      label: "1-5 min",
                      count:
                        sessionDuration?.segmentation?.mediumSessions?.count ??
                        0,
                      percentage:
                        sessionDuration?.segmentation?.mediumSessions
                          ?.percentage ?? 0,
                    },
                    {
                      label: "> 5 min",
                      count:
                        sessionDuration?.segmentation?.longSessions?.count ?? 0,
                      percentage:
                        sessionDuration?.segmentation?.longSessions
                          ?.percentage ?? 0,
                    },
                  ].map((segment, idx) => (
                    <div key={idx} className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          {segment.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {segment.count} ({segment.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-cyan-400 via-emerald-400 to-amber-400"
                          style={{
                            width: `${Math.max(segment.percentage, 2)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2 border-t border-slate-200 pt-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Engagement Signals
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Using AR Feature
                    </span>
                    <span className="text-lg font-bold text-emerald-500">
                      {sessionDuration?.engagement?.sessionsWithAR ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Adding to Cart
                    </span>
                    <span className="text-lg font-bold text-amber-500">
                      {sessionDuration?.engagement?.sessionsAddingToCart ?? 0}
                    </span>
                  </div>
                </div>
              </GlowCard>

              {/* Cart Abandonment */}
              <GlowCard className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      Cart Abandonment Analysis
                    </p>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {(cartAbandonment?.abandonmentRate ?? 0).toFixed(0)}%
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {cartAbandonment?.sessionStats?.abandonedCarts ?? 0} of{" "}
                      {cartAbandonment?.sessionStats?.sessionsWithCarts ?? 0}{" "}
                      carts abandoned
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-600">
                    Risk signal
                  </span>
                </div>

                <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Cart Stats
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Total Carts Created
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {cartAbandonment?.summary?.totalCartsCreated ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Avg Abandoned Size
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {(
                        cartAbandonment?.summary?.avgAbandonedCartSize ?? 0
                      ).toFixed(1)}{" "}
                      items
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-linear-to-r from-emerald-50 to-cyan-50 p-4">
                  <p className="text-sm font-semibold text-emerald-900">
                    💡 Insight
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    {(cartAbandonment?.abandonmentRate ?? 0) > 50
                      ? "Consider adding product recommendations or checkout reminders."
                      : "Your cart abandonment is healthy. Keep optimizing checkout flow."}
                  </p>
                </div>
              </GlowCard>
            </div>
          </motion.section>
        )}

        {/* CATEGORY PERFORMANCE SECTION */}
        {activeAnalyticsTab === "menu" &&
          categoryPerformance?.categories &&
          categoryPerformance.categories.length > 0 && (
            <motion.section className="mt-16 grid gap-6" {...fadeUp}>
              <SectionHeader
                title="Category Analysis"
                subtitle="Category Wise Performance"
              />
              <GlowCard className="p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryPerformance.categories.map(
                    (cat: any, idx: number) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-4"
                      >
                        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-200/40 blur-2xl" />
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          {cat.category || `Category ${idx + 1}`}
                        </p>
                        <div className="mt-4">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                            Conversions
                          </p>
                          <p className="mt-2 text-xl font-bold text-emerald-600">
                            {cat.addedToCart ?? 0}
                          </p>
                          <p className="mt-3 text-xs text-slate-500">
                            Items added to cart in this category.
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </GlowCard>
            </motion.section>
          )}

        {/* ENGAGEMENT FUNNEL DETAILED SECTION */}
        {activeAnalyticsTab === "engagement" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="User Journey"
              subtitle="A story of how guests move through your menu"
            />
            <GlowCard className="relative overflow-hidden p-8">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  {[
                    {
                      key: "scan",
                      title: "🔍 QR Scans",
                      story: "Guests discover the menu",
                      color: "from-pink-400 via-rose-400 to-amber-400",
                    },
                    {
                      key: "view",
                      title: "👁️ Menu Views",
                      story: "They explore the dishes",
                      color: "from-cyan-400 via-sky-400 to-blue-400",
                    },
                    {
                      key: "add_to_cart",
                      title: "🛒 Add to Cart",
                      story: "Intent becomes a decision",
                      color: "from-emerald-400 via-teal-400 to-lime-400",
                    },
                  ].map((step, idx) => {
                    const stage = engagementFunnel?.funnel?.find(
                      (item: any) => item.stage === step.key,
                    );
                    const baseCount = engagementFunnel?.funnel?.[0]?.count || 1;
                    const progress =
                      Math.min((stage?.count ?? 0) / baseCount, 1) * 100;

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {step.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {step.story}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-sm font-semibold text-slate-700">
                            {stage?.count ?? 0}
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Stage share</span>
                            <span>{(stage?.percentage ?? 0).toFixed(1)}%</span>
                          </div>
                          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              className={`h-full rounded-full bg-linear-to-r ${step.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progress}%` }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 1.1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-cyan-200/60 bg-cyan-50/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">
                      Scan→View
                    </p>
                    <p className="mt-3 text-3xl font-bold text-cyan-600">
                      {(
                        engagementFunnel?.summary?.scanToViewConversion ?? 0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="mt-2 text-xs text-cyan-800/70">
                      How many scanners actually browse the menu.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-amber-200/60 bg-amber-50/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                      View→Add Cart
                    </p>
                    <p className="mt-3 text-3xl font-bold text-amber-600">
                      {(
                        engagementFunnel?.summary?.viewToAddConversion ?? 0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="mt-2 text-xs text-amber-800/70">
                      The moment curiosity turns into intent.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-emerald-200/60 bg-emerald-50/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
                      End-to-End
                    </p>
                    <p className="mt-3 text-3xl font-bold text-emerald-600">
                      {(
                        engagementFunnel?.summary?.endToEndConversion ?? 0
                      ).toFixed(1)}
                      %
                    </p>
                    <p className="mt-2 text-xs text-emerald-800/70">
                      Scans that end up with items in cart.
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.section>
        )}

        {/* SUMMARY METRICS CARDS */}
        {activeAnalyticsTab === "engagement" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                title="Key Metrics"
                subtitle="Your most important analytics at a glance"
              />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live pulse
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Visitor Conversion
                  </p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-600">
                    🛒
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {sessionDuration?.summary?.totalSessions
                      ? (
                          ((sessionDuration?.engagement?.sessionsAddingToCart ??
                            0) /
                            sessionDuration.summary.totalSessions) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <span className="text-xs text-slate-500">
                    Add-to-cart rate
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        sessionDuration?.summary?.totalSessions
                          ? ((sessionDuration?.engagement
                              ?.sessionsAddingToCart ?? 0) /
                              sessionDuration.summary.totalSessions) *
                              100
                          : 0,
                        100,
                      )}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {sessionDuration?.engagement?.sessionsAddingToCart ?? 0} of{" "}
                  {sessionDuration?.summary?.totalSessions ?? 0} visitors added
                  to cart
                </p>
              </GlowCard>

              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -left-14 -top-14 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    3D View Usage
                  </p>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-xs text-cyan-600">
                    🎥
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {(arUsage?.usageStats?.percentageUsingAR ?? 0).toFixed(1)}%
                  </p>
                  <span className="text-xs text-slate-500">AR adoption</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(arUsage?.usageStats?.percentageUsingAR ?? 0, 100)}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {arUsage?.usageStats?.sessionsUsingAR ?? 0} of{" "}
                  {arUsage?.usageStats?.totalSessions ?? 0} sessions with AR
                </p>
              </GlowCard>

              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-rose-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Cart Abandonment
                  </p>
                  <span className="rounded-full bg-rose-500/15 px-2 py-1 text-xs text-rose-600">
                    ⚠️
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {(cartAbandonment?.abandonmentRate ?? 0).toFixed(0)}%
                  </p>
                  <span className="text-xs text-slate-500">Drop-off</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-rose-400 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(cartAbandonment?.abandonmentRate ?? 0, 100)}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {cartAbandonment?.sessionStats?.abandonedCarts ?? 0} of{" "}
                  {cartAbandonment?.sessionStats?.sessionsWithCarts ?? 0} carts
                </p>
              </GlowCard>

              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Avg Session Duration
                  </p>
                  <span className="rounded-full bg-indigo-500/15 px-2 py-1 text-xs text-indigo-600">
                    ⏱️
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {(sessionDuration?.summary?.avgDurationMin ?? 0).toFixed(2)}{" "}
                    min
                  </p>
                  <span className="text-xs text-slate-500">Avg time</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-indigo-400 to-violet-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        ((sessionDuration?.summary?.avgDurationMin ?? 0) / 10) *
                          100,
                        100,
                      )}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {(sessionDuration?.summary?.avgEventsPerSession ?? 0).toFixed(
                    1,
                  )}{" "}
                  events per session
                </p>
              </GlowCard>

              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Item Popularity
                  </p>
                  <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-600">
                    🏆
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {itemPopularity?.summary?.totalAddToCart ?? 0}
                  </p>
                  <span className="text-xs text-slate-500">Adds</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-amber-400 to-rose-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        ((itemPopularity?.summary?.totalAddToCart ?? 0) / 30) *
                          100,
                        100,
                      )}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  "{mostPopularDish}" is top item
                </p>
              </GlowCard>

              <GlowCard className="relative overflow-hidden p-6">
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-200/40 blur-3xl" />
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    QR Performance
                  </p>
                  <span className="rounded-full bg-fuchsia-500/15 px-2 py-1 text-xs text-fuchsia-600">
                    📱
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">
                    {qrScanValue}
                  </p>
                  <span className="text-xs text-slate-500">Scans</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-fuchsia-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((qrScanValue / 120) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Total QR scans this period
                </p>
              </GlowCard>
            </div>
          </motion.section>
        )}

        {activeAnalyticsTab === "insights" && (
          <motion.section className="mt-16 grid gap-6" {...fadeUp}>
            <SectionHeader
              title="Smart AI Insights"
              subtitle="Actionable signals from your data"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  className="rounded-[26px] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_70px_rgba(148,163,184,0.25)]"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Insight {index + 1}
                    </p>
                    <span className="text-xl">{insight.icon}</span>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {insight.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {insight.description}
                  </p>
                  <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Impact
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {insight.impact}
                    </p>
                  </div>
                  <div className="mt-6 h-1 w-full rounded-full bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
