"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Check,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3,
  QrCode,
  Box,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import type { Plan, GatewayInfo, GatewayId } from "@/lib/types";
import { JsonLd } from "@/components/seo/JsonLd";

// ─── Feature List ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Box, label: "Unlimited 3D Model Uploads" },
  { icon: BarChart3, label: "Advanced Analytics & Reports" },
  { icon: QrCode, label: "QR Code Generation" },
  { icon: Users, label: "Multi-Restaurant Management" },
  { icon: Shield, label: "Priority Support" },
  { icon: Zap, label: "Real-time Dashboard" },
];

// ─── Feature Comparison ────────────────────────────────────────────────────────
const COMPARISON_FEATURES = [
  { feature: "Restaurants", free: "1", premium: "Unlimited" },
  { feature: "Menu Items", free: "20", premium: "Unlimited" },
  { feature: "3D Models", free: false, premium: true },
  { feature: "QR Code Generation", free: false, premium: true },
  { feature: "Analytics Dashboard", free: false, premium: true },
  { feature: "AR Preview", free: false, premium: true },
  { feature: "Priority Support", free: false, premium: true },
  { feature: "Custom Branding", free: false, premium: true },
  { feature: "API Access", free: false, premium: true },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Owner, Spice Garden",
    avatar: "RS",
    rating: 5,
    text: "menuffy transformed our restaurant. Customers love the 3D previews and QR scanning. Revenue up 40%.",
  },
  {
    name: "Priya Mehta",
    role: "Manager, The Urban Bite",
    avatar: "PM",
    rating: 5,
    text: "The analytics are incredibly detailed. I know exactly which dishes are trending every hour.",
  },
  {
    name: "Arun Kapoor",
    role: "Chef & Owner, Tandoor Tales",
    avatar: "AK",
    rating: 5,
    text: "Setup was super easy. My staff could manage the digital menu without any training.",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel anytime. Your access remains active until the end of the billing period. No questions asked.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a limited free tier with 1 restaurant and 20 menu items. Upgrade anytime to unlock all features.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept all major cards, UPI, net banking, wallets (via Razorpay/PayU), and PayPal for international payments.",
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. All payments are processed by certified PCI-DSS compliant gateways. We never store your card details.",
  },
  {
    q: "What happens when my subscription expires?",
    a: "Your data is preserved. You lose access to premium features but can reactivate anytime by renewing.",
  },
  {
    q: "Can I switch between monthly and yearly?",
    a: "Yes. You can switch plans at renewal time. Yearly plans offer a 17% discount.",
  },
];

// ─── Currency Toggle ───────────────────────────────────────────────────────────
type CurrencyMode = "INR" | "USD";

// ─── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  isYearly,
  isSelected,
  onSelect,
  onOpenGatewayPicker,
}: {
  plan: Plan;
  isYearly: boolean;
  isSelected: boolean;
  onSelect: (plan: Plan) => void;
  onOpenGatewayPicker: (plan: Plan) => void;
}) {
  const savings = isYearly ? 17 : 0;
  const monthlyEquivalent = isYearly
    ? Math.round(plan.amount / 12)
    : plan.amount;
  const currencySymbol = plan.currency === "INR" ? "₹" : "$";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(plan)}
      className={`relative cursor-pointer rounded-3xl border-2 p-8 transition-all duration-300 ${
        isSelected
          ? "border-orange-400 bg-linear-to-br from-orange-50 to-amber-50 shadow-xl shadow-orange-100"
          : "border-slate-200 bg-white hover:border-orange-200 hover:shadow-lg"
      }`}
    >
      {/* Recommended badge for yearly */}
      {isYearly && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            BEST VALUE — SAVE {savings}%
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
        <p className="text-slate-500 text-sm">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-extrabold text-slate-900">
            {currencySymbol}
            {plan.amount.toLocaleString()}
          </span>
          <span className="text-slate-400 mb-1.5">
            /{isYearly ? "year" : "month"}
          </span>
        </div>
        {isYearly && (
          <p className="text-sm text-orange-600 font-medium mt-1">
            {currencySymbol}
            {monthlyEquivalent}/month equivalent
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isSelected ? "bg-orange-500" : "bg-slate-200"
              }`}
            >
              <Check
                className={`w-3 h-3 ${isSelected ? "text-white" : "text-slate-600"}`}
              />
            </div>
            <span className="text-slate-600 text-sm">{label}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onSelect(plan);
          onOpenGatewayPicker(plan);
        }}
        className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 ${
          isSelected
            ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300"
            : "border-2 border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-600"
        }`}
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-slate-200 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5">
        <p className="font-semibold text-slate-700">{q}</p>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { plans, gateways, fetchPlans, isLoading } = useSubscription();
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>("INR");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [gatewayModalPlan, setGatewayModalPlan] = useState<Plan | null>(null);

  const openGatewayPicker = (plan: Plan) => {
    setGatewayModalPlan(plan);
  };

  const closeGatewayPicker = () => {
    setGatewayModalPlan(null);
  };

  const compatibleGateways: GatewayInfo[] = gatewayModalPlan
    ? gateways.filter(g => g.currencies.includes(gatewayModalPlan.currency))
    : [];

  const getGatewayLabel = (gatewayId: GatewayId): string => {
    if (gatewayId === "razorpay") return "Razorpay";
    if (gatewayId === "paypal") return "PayPal";
    return "PayU";
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const filteredPlans = plans.filter(
    p => p.currency === currencyMode && p.duration === billingCycle,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-orange-50 to-amber-50 pt-24 pb-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Simple, transparent pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mb-4 leading-tight"
          >
            One plan. Full access.
            <span className="block bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              No hidden fees.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg mb-6 max-w-xl mx-auto"
          >
            Get unlimited access to all features. Cancel anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 flex justify-center"
          >
            <Link
              href="/pay-setup-cost"
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              Pay setup cost with Razorpay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
          >
            {/* Currency toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
              {(["INR", "USD"] as CurrencyMode[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrencyMode(c)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currencyMode === c
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {c === "INR" ? "₹ INR" : "$ USD"}
                </button>
              ))}
            </div>

            {/* Billing cycle toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
              {(["monthly", "yearly"] as const).map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`relative px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    billingCycle === cycle
                      ? "bg-linear-to-r from-orange-500 to-amber-500 text-white shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                  {cycle === "yearly" && (
                    <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      Save 17%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Plans ─────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPlans.length === 0 ? (
          <p className="text-center text-slate-400">
            No plans available for selected currency.
          </p>
        ) : (
          <div
            className={`grid gap-8 ${filteredPlans.length > 1 ? "md:grid-cols-2" : "max-w-sm mx-auto"}`}
          >
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isYearly={plan.duration === "yearly"}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={setSelectedPlan}
                onOpenGatewayPicker={openGatewayPicker}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Gateway Picker Modal ───────────────────────────────── */}
      {gatewayModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Choose Payment Gateway
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Selected plan: {gatewayModalPlan.displayName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeGatewayPicker}
                className="w-9 h-9 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close gateway picker"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              {compatibleGateways.length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-700 text-sm">
                  No payment gateway is currently configured for{" "}
                  {gatewayModalPlan.currency}. Please try again later.
                </div>
              ) : (
                compatibleGateways.map(gateway => (
                  <Link
                    key={gateway.id}
                    href={`/payment/method?planId=${gatewayModalPlan.id}&gatewayId=${gateway.id}`}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 hover:border-orange-300 hover:bg-orange-50/40 transition-all"
                    onClick={closeGatewayPicker}
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {getGatewayLabel(gateway.id)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {gateway.supportsRecurring
                          ? "Supports auto-renew"
                          : "One-time payment"}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={closeGatewayPicker}
                className="w-full border border-slate-300 text-slate-700 py-3 rounded-2xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Feature Comparison ────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
          Compare plans
        </h2>
        <div className="rounded-3xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
            <div className="p-4 font-semibold text-slate-600">Feature</div>
            <div className="p-4 font-semibold text-slate-600 text-center border-l border-slate-200">
              Free
            </div>
            <div className="p-4 font-semibold text-orange-600 text-center border-l border-slate-200">
              Premium
            </div>
          </div>
          {COMPARISON_FEATURES.map(({ feature, free, premium }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
            >
              <div className="p-4 text-slate-700 text-sm font-medium">
                {feature}
              </div>
              <div className="p-4 text-center border-l border-slate-200">
                {typeof free === "boolean" ? (
                  free ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-slate-300 text-lg">—</span>
                  )
                ) : (
                  <span className="text-sm text-slate-600">{free}</span>
                )}
              </div>
              <div className="p-4 text-center border-l border-slate-200">
                {typeof premium === "boolean" ? (
                  premium ? (
                    <Check className="w-5 h-5 text-orange-500 mx-auto" />
                  ) : (
                    <span className="text-slate-300 text-lg">—</span>
                  )
                ) : (
                  <span className="text-sm font-semibold text-orange-600">
                    {premium}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="bg-linear-to-br from-slate-50 to-orange-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Loved by restaurant owners
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <motion.div
                key={t.name}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {t.name}
                    </p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQS.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="bg-linear-to-r from-orange-500 to-amber-500 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Start growing your restaurant today
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join thousands of restaurant owners using menuffy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pay-setup-cost"
              className="bg-white text-orange-600 font-bold py-4 px-8 rounded-2xl hover:bg-orange-50 transition-all duration-200 shadow-xl"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              View Plans
            </Link>
            <Link
              href="/register"
              className="border-2 border-white/60 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/10 transition-all duration-200"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
