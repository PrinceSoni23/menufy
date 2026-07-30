"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, ArrowLeft, MessageSquare } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gateway = searchParams.get("gateway") || "payment";
  const errorCode = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    BAD_REQUEST_ERROR: "Invalid payment request. Please try again.",
    PAYMENT_CANCELLED: "Payment was cancelled.",
    SIGNATURE_INVALID: "Payment verification failed for security reasons.",
    default: "Your payment could not be processed. No amount was deducted.",
  };

  const message = errorCode
    ? (errorMessages[errorCode] ?? errorMessages["default"])
    : errorMessages["default"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Error banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl font-extrabold text-white mb-1">
              Payment Failed
            </h1>
            <p className="text-red-100 text-sm">
              Don&apos;t worry — no amount was charged
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-700">{message}</p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-slate-600">
                Common reasons for failure:
              </p>
              <ul className="space-y-2">
                {[
                  "Insufficient balance in account",
                  "Card declined by bank",
                  "Payment timeout",
                  "Network connectivity issues",
                ].map(reason => (
                  <li
                    key={reason}
                    className="flex items-start gap-2 text-sm text-slate-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-200"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Payment
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Choose Different Plan
              </button>

              <a
                href="mailto:support@menuffy.in"
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm py-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Contact support
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Gateway: <span className="capitalize font-medium">{gateway}</span>
          {errorCode && ` • Code: ${errorCode}`}
        </p>
      </motion.div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
