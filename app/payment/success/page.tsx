"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Download,
  Calendar,
  Shield,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import type { GatewayId } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gateway = searchParams.get("gateway") as GatewayId | null;
  const orderId = searchParams.get("token") || searchParams.get("orderId"); // PayPal uses "token"
  const txnid = searchParams.get("txnid"); // PayU txnid

  const { verifyPayment, fetchStatus, status } = useSubscription();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const runVerification = async () => {
      // PayU success is handled by backend webhook redirect
      // We just need to refresh status
      if (gateway === "payu" && txnid) {
        const freshStatus = await fetchStatus();
        if (!isCancelled && freshStatus?.subscriptionStatus === "active") {
          setVerified(true);
        } else if (!isCancelled) {
          setError(
            "Payment is not confirmed yet. Please refresh this page in a moment.",
          );
        }
        if (!isCancelled) setVerifying(false);
        return;
      }

      // PayPal — verify after redirect
      if (gateway === "paypal" && orderId) {
        try {
          const result = await verifyPayment({
            gateway: "paypal",
            orderId,
            paymentId: orderId,
          });
          if (!isCancelled) {
            setInvoiceNumber(result.invoiceNumber);
            setExpiresAt(result.expiresAt);
            setVerified(true);
          }
        } catch (err: unknown) {
          const msg =
            err instanceof Error ? err.message : "Verification failed";
          if (!isCancelled) setError(msg);
        } finally {
          if (!isCancelled) setVerifying(false);
        }
        return;
      }

      // Already verified (Razorpay verifyPayment was called inline)
      const freshStatus = await fetchStatus();
      if (!isCancelled && freshStatus?.subscriptionStatus === "active") {
        setVerified(true);
      } else if (!isCancelled) {
        setError(
          "Payment is not confirmed yet. Please refresh this page in a moment.",
        );
      }
      if (!isCancelled) setVerifying(false);
    };

    runVerification();

    return () => {
      isCancelled = true;
    };
  }, [fetchStatus, gateway, orderId, txnid, verifyPayment]);

  const expirySource = expiresAt ?? status?.subscriptionEndDate ?? null;
  const formattedExpiry = expirySource
    ? new Date(expirySource).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (verifying) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Verifying your payment...
          </h2>
          <p className="text-slate-400 text-sm">
            Please wait, do not close this page
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Verification Failed
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/pricing")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success banner */}
          <div className="bg-linear-to-r from-green-500 to-emerald-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              Payment Successful!
            </h1>
            <p className="text-green-100">Your subscription is now active</p>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="space-y-4 mb-8">
              {invoiceNumber && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Invoice</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {invoiceNumber}
                  </span>
                </div>
              )}

              {formattedExpiry && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Valid Until</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {formattedExpiry}
                  </span>
                </div>
              )}

              {gateway && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Payment via</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 capitalize">
                    {gateway}
                  </span>
                </div>
              )}
            </div>

            {/* What's unlocked */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-green-800 mb-2">
                You now have access to:
              </p>
              <ul className="space-y-1">
                {[
                  "Owner Dashboard",
                  "Analytics & Reports",
                  "Restaurant Management",
                  "Menu & 3D Models",
                  "QR Code Generation",
                ].map(f => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-green-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-green-200"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
