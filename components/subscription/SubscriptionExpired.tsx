"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  RefreshCw,
  ArrowRight,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface SubscriptionExpiredProps {
  subscriptionStatus?: string;
  subscriptionEndDate?: string | null;
  subscriptionPlan?: string | null;
}

export default function SubscriptionExpired({
  subscriptionStatus = "expired",
  subscriptionEndDate,
  subscriptionPlan,
}: SubscriptionExpiredProps) {
  const isExpired = subscriptionStatus === "expired";
  const isCancelled = subscriptionStatus === "cancelled";

  const planLabel = subscriptionPlan
    ? subscriptionPlan
        .replace("_", " ")
        .replace("inr", "(₹)")
        .replace("usd", "($)")
    : null;

  const formattedDate = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <AlertCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              {isExpired
                ? "Subscription Expired"
                : isCancelled
                  ? "Subscription Cancelled"
                  : "No Active Subscription"}
            </h1>
            <p className="text-orange-100 mt-1 text-sm">
              Renew to restore full dashboard access
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Info rows */}
            <div className="space-y-4 mb-8">
              {planLabel && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Crown className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      Current Plan
                    </p>
                    <p className="text-slate-700 font-semibold capitalize">
                      {planLabel}
                    </p>
                  </div>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                      {isExpired ? "Expired On" : "Cancelled On"}
                    </p>
                    <p className="text-slate-700 font-semibold">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Blocked features */}
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500 mb-3">
                Features requiring subscription:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Owner Dashboard",
                  "Analytics & Reports",
                  "Restaurant Management",
                  "Menu Management",
                  "QR Code Generation",
                  "3D Model Uploads",
                ].map(feature => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Link
                href="/book-demo"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5"
              >
                <RefreshCw className="w-4 h-4" />
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-demo"
                className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-sm text-slate-400 mt-4">
          Need help? Contact{" "}
          <a
            href="mailto:support@menuffy.com"
            className="text-orange-500 hover:underline"
          >
            support@menuffy.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
