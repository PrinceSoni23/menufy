"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Crown,
  Calendar,
  CreditCard,
  RefreshCw,
  Repeat,
  XCircle,
  Receipt,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import type { Invoice } from "@/lib/types";

const PLAN_LABELS: Record<string, string> = {
  monthly_inr: "Monthly (₹2,000/month)",
  monthly_usd: "Monthly ($20/month)",
  yearly_inr: "Yearly (₹20,000/year)",
  yearly_usd: "Yearly ($200/year)",
};

const GATEWAY_LABELS: Record<string, string> = {
  razorpay: "Razorpay",
  paypal: "PayPal",
  payu: "PayU",
};

function StatusBadge({ status }: { status: string }) {
  const configs: Record<
    string,
    { color: string; icon: typeof CheckCircle; label: string }
  > = {
    active: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
      label: "Active",
    },
    expired: {
      color: "bg-red-100 text-red-700",
      icon: AlertCircle,
      label: "Expired",
    },
    cancelled: {
      color: "bg-slate-100 text-slate-600",
      icon: XCircle,
      label: "Cancelled",
    },
    pending: {
      color: "bg-amber-100 text-amber-700",
      icon: RefreshCw,
      label: "Pending",
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const currencySymbol = invoice.currency === "INR" ? "₹" : "$";
  const date = new Date(invoice.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Receipt className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <p className="font-medium text-slate-800 text-sm">
            {invoice.invoiceNumber}
          </p>
          <p className="text-xs text-slate-400">
            {date} • {GATEWAY_LABELS[invoice.gateway] || invoice.gateway}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-800">
          {currencySymbol}
          {invoice.amountDisplay.toLocaleString()}
        </p>
        <span className="text-xs text-green-600 font-medium">Paid</span>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const {
    status,
    invoices,
    isLoading,
    fetchStatus,
    fetchInvoices,
    cancelSubscription,
    isActive,
    daysRemaining,
  } = useSubscription();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    fetchInvoices();
  }, [fetchStatus, fetchInvoices]);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    setActionError(null);
    try {
      await cancelSubscription(cancelReason);
      setActionSuccess(
        "Subscription cancelled. You retain access until your billing period ends.",
      );
      setShowCancelConfirm(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to cancel subscription";
      setActionError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const expiryFormatted = status?.subscriptionEndDate
    ? new Date(status.subscriptionEndDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const startFormatted = status?.subscriptionStartDate
    ? new Date(status.subscriptionStartDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  if (isLoading && !status) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Subscription</h1>
          <p className="text-slate-500 mt-1">
            Manage your plan, billing, and invoices
          </p>
        </div>

        {/* Success/error alerts */}
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-4 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            {actionSuccess}
          </motion.div>
        )}
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {actionError}
          </motion.div>
        )}

        {/* Current subscription card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Current Plan</h2>
                <p className="text-sm text-slate-400">Subscription details</p>
              </div>
            </div>
            {status && <StatusBadge status={status.subscriptionStatus} />}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium uppercase mb-1">
                Plan
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {status?.subscriptionPlan
                  ? PLAN_LABELS[status.subscriptionPlan] ||
                    status.subscriptionPlan
                  : "No active plan"}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium uppercase mb-1">
                Gateway
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {status?.paymentGateway
                  ? GATEWAY_LABELS[status.paymentGateway] ||
                    status.paymentGateway
                  : "—"}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium uppercase mb-1">
                Started
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {startFormatted}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <p className="text-xs text-slate-400 font-medium uppercase">
                  Expires
                </p>
              </div>
              <p className="font-semibold text-slate-700 text-sm">
                {expiryFormatted}
              </p>
              {isActive && daysRemaining <= 7 && (
                <p className="text-xs text-orange-500 mt-0.5 font-medium">
                  {daysRemaining}d remaining
                </p>
              )}
            </div>
          </div>

          {/* Auto-renew toggle */}
          {isActive && status?.isRecurring && (
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl mb-4">
              <div className="flex items-center gap-3">
                <Repeat className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    Auto-Renew
                  </p>
                  <p className="text-xs text-slate-400">
                    {status.autoRenew
                      ? "Legacy recurring subscription detected. Changes require support intervention."
                      : "Recurring billing management is not available in this build."}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                Support managed
              </span>
            </div>
          )}

          {/* Actions */}
          {isActive ? (
            <div className="flex gap-3">
              <Link
                href="/pay-setup-cost"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all text-sm"
              >
                <CreditCard className="w-4 h-4" />
                Upgrade Plan
              </Link>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex items-center gap-2 border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 px-4 rounded-2xl transition-all text-sm"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : (
            <Link
              href="/pay-setup-cost"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all w-full"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Subscription
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Cancel confirm modal */}
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Cancel Subscription?
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  You will keep access until <strong>{expiryFormatted}</strong>.
                  No refund will be issued.
                </p>
              </div>

              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Optional: Tell us why you're cancelling..."
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm text-slate-700 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-orange-300 mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-600 font-semibold py-3 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl transition-colors"
                >
                  {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Invoices */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Payment History
          </h2>

          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No invoices yet</p>
            </div>
          ) : (
            <div>
              {invoices.map(invoice => (
                <InvoiceRow key={invoice._id} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
