"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  ArrowLeft,
  Lock,
  Repeat,
  CheckCircle,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import type { Plan, GatewayId, PlanId, CreateOrderResponse } from "@/lib/types";

// ─── Gateway Config ────────────────────────────────────────────────────────────
const GATEWAY_CONFIG: Record<
  GatewayId,
  {
    name: string;
    tagline: string;
    logo: string;
    supportedMethods: string[];
    processingSpeed: string;
    currencies: string[];
    color: string;
    bgGradient: string;
  }
> = {
  razorpay: {
    name: "Razorpay",
    tagline: "India's most trusted payment gateway",
    logo: "RP",
    supportedMethods: ["Cards", "UPI", "Net Banking", "Wallets", "EMI"],
    processingSpeed: "Instant",
    currencies: ["INR"],
    color: "blue",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  paypal: {
    name: "PayPal",
    tagline: "Pay globally with confidence",
    logo: "PP",
    supportedMethods: ["PayPal Balance", "Cards", "Bank Transfer"],
    processingSpeed: "Instant",
    currencies: ["USD"],
    color: "sky",
    bgGradient: "from-sky-50 to-blue-50",
  },
  payu: {
    name: "PayU",
    tagline: "Secure payments across India",
    logo: "PU",
    supportedMethods: ["Cards", "UPI", "Net Banking", "Wallets"],
    processingSpeed: "Instant",
    currencies: ["INR"],
    color: "violet",
    bgGradient: "from-violet-50 to-purple-50",
  },
};

const COLOR_MAP: Record<
  string,
  { ring: string; badge: string; button: string }
> = {
  blue: {
    ring: "ring-blue-500 border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    button: "from-blue-600 to-indigo-600 shadow-blue-200",
  },
  sky: {
    ring: "ring-sky-500 border-sky-400",
    badge: "bg-sky-100 text-sky-700",
    button: "from-sky-500 to-blue-500 shadow-sky-200",
  },
  violet: {
    ring: "ring-violet-500 border-violet-400",
    badge: "bg-violet-100 text-violet-700",
    button: "from-violet-600 to-purple-600 shadow-violet-200",
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type PaymentStep = "select-gateway" | "processing" | "redirecting";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

// ─── Payment Method Page ───────────────────────────────────────────────────────
function PaymentMethodContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("planId") as PlanId | null;
  const gatewayIdParam = searchParams.get("gatewayId") as GatewayId | null;

  const { plans, gateways, fetchPlans, createOrder, verifyPayment, isLoading } =
    useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<GatewayId | null>(
    null,
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [step, setStep] = useState<PaymentStep>("select-gateway");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false); // prevent double submission

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (plans.length > 0 && planId) {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        // Honor explicitly selected gateway from pricing modal; otherwise require manual choice here.
        const preselectedGateway = gatewayIdParam
          ? gateways.find(
              g =>
                g.id === gatewayIdParam && g.currencies.includes(plan.currency),
            )
          : null;
        setSelectedGateway(
          preselectedGateway ? (preselectedGateway.id as GatewayId) : null,
        );
        setIsRecurring(false);
      }
    }
  }, [plans, planId, gateways, gatewayIdParam]);

  // Filter gateways compatible with selected plan's currency
  const compatibleGateways = selectedPlan
    ? gateways.filter(g => g.currencies.includes(selectedPlan.currency))
    : gateways;

  useEffect(() => {
    if (!selectedPlan) return;
    if (compatibleGateways.length === 0) {
      setSelectedGateway(null);
      setError(
        `No payment gateway is configured for ${selectedPlan.currency}. Please contact support.`,
      );
      return;
    }

    // If currently selected gateway becomes incompatible, pick the first compatible one.
    if (
      selectedGateway &&
      !compatibleGateways.some(g => g.id === selectedGateway)
    ) {
      setSelectedGateway(compatibleGateways[0].id as GatewayId);
    }
  }, [selectedPlan, compatibleGateways, selectedGateway]);

  const handlePay = async () => {
    if (!selectedPlan || !selectedGateway || submitLock.current) return;

    submitLock.current = true;
    setIsSubmitting(true);
    setError(null);
    setStep("processing");

    try {
      const order: CreateOrderResponse = await createOrder(
        selectedPlan.id,
        selectedGateway,
        isRecurring,
      );

      if (selectedGateway === "razorpay") {
        await handleRazorpay(order);
      } else if (selectedGateway === "paypal") {
        await handlePayPal(order);
      } else if (selectedGateway === "payu") {
        await handlePayU(order);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setError(msg);
      setStep("select-gateway");
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  const handleRazorpay = async (order: CreateOrderResponse): Promise<void> => {
    return new Promise((resolve, reject) => {
      let settled = false;
      const settle = (fn: () => void) => {
        if (settled) return;
        settled = true;
        fn();
      };

      const timeoutId = window.setTimeout(() => {
        settle(() =>
          reject(new Error("Razorpay checkout timed out. Please try again.")),
        );
      }, 15000);

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        try {
          window.clearTimeout(timeoutId);

          if (!window.Razorpay) {
            settle(() =>
              reject(
                new Error(
                  "Razorpay SDK unavailable. Disable ad-blockers and try again.",
                ),
              ),
            );
            return;
          }

          if (!order.keyId) {
            settle(() =>
              reject(new Error("Razorpay key not received from server.")),
            );
            return;
          }

          if (!selectedPlan) {
            settle(() =>
              reject(
                new Error("Selected plan not found. Please reselect plan."),
              ),
            );
            return;
          }

          const rzp = new window.Razorpay({
            key: order.keyId,
            amount: order.amount * 100, // paise
            currency: order.currency,
            name: "menuffy",
            description: selectedPlan.displayName,
            order_id: order.orderId,
            handler: async response => {
              try {
                await verifyPayment({
                  gateway: "razorpay",
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                });
                router.push("/payment/success?gateway=razorpay");
                settle(() => resolve());
              } catch (err: unknown) {
                const msg =
                  err instanceof Error ? err.message : "Verification failed";
                settle(() => reject(new Error(msg)));
              }
            },
            theme: { color: "#f97316" },
            modal: {
              ondismiss: () => {
                settle(() => reject(new Error("Payment was cancelled")));
              },
            },
          });

          rzp.open();
        } catch (err: unknown) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to initialize Razorpay checkout";
          settle(() => reject(new Error(msg)));
        }
      };
      script.onerror = () => {
        window.clearTimeout(timeoutId);
        settle(() => reject(new Error("Failed to load Razorpay checkout")));
      };
      document.body.appendChild(script);
    });
  };

  const handlePayPal = async (order: CreateOrderResponse): Promise<void> => {
    // PayPal redirects to their hosted page
    if (order.approvalUrl) {
      setStep("redirecting");
      window.location.href = order.approvalUrl;
    } else {
      throw new Error("PayPal approval URL not received");
    }
  };

  const handlePayU = async (order: CreateOrderResponse): Promise<void> => {
    // PayU uses a form POST to their payment page
    const formParams = (
      order.metadata as { formParams?: Record<string, string> }
    )?.formParams;
    if (!formParams || !order.approvalUrl) {
      throw new Error("PayU payment parameters not received");
    }

    setStep("redirecting");

    // Create and submit a hidden form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = order.approvalUrl;

    Object.entries(formParams).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const currencySymbol = selectedPlan?.currency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/pay-setup-cost")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Choose Payment Method
          </h1>
          <p className="text-slate-500">
            Select how you&apos;d like to pay. All payments are encrypted and
            secure.
          </p>
        </div>

        {/* Order summary */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
                  Selected Plan
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {selectedPlan.displayName}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedPlan.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-slate-900">
                  {currencySymbol}
                  {selectedPlan.amount.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">
                  /{selectedPlan.duration}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gateway cards */}
        {step === "select-gateway" && (
          <>
            {!selectedGateway && compatibleGateways.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-4 mb-4 text-sm">
                Please select a payment gateway before continuing.
              </div>
            )}

            <div className="space-y-4 mb-6">
              {compatibleGateways.map(gateway => {
                const config = GATEWAY_CONFIG[gateway.id as GatewayId];
                const colors = COLOR_MAP[config.color];
                const isSelected = selectedGateway === gateway.id;

                return (
                  <motion.div
                    key={gateway.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedGateway(gateway.id as GatewayId)}
                    className={`relative cursor-pointer bg-linear-to-br ${config.bgGradient} border-2 rounded-3xl p-6 transition-all duration-200 ${
                      isSelected
                        ? `${colors.ring} ring-2`
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-green-500" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-lg text-slate-700 shrink-0`}
                      >
                        {config.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800">
                            {config.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}
                          >
                            {gateway.supportsRecurring ? "AutoPay" : "One-time"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">
                          {config.tagline}
                        </p>

                        {/* Supported methods */}
                        <div className="flex flex-wrap gap-1.5">
                          {config.supportedMethods.map(method => (
                            <span
                              key={method}
                              className="text-xs bg-white/80 border border-white text-slate-600 px-2 py-1 rounded-lg"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Speed badge */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Zap className="w-3 h-3" />
                          {config.processingSpeed}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Globe className="w-3 h-3" />
                          {config.currencies.join(", ")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recurring billing is intentionally disabled until provider flows are fully wired end-to-end. */}
            {selectedGateway &&
              gateways.find(g => g.id === selectedGateway)
                ?.supportsRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
                >
                  <Repeat className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Auto-renew is not available yet
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      This checkout currently supports one-time subscription
                      purchases only.
                    </p>
                  </div>
                </motion.div>
              )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Security badges */}
            <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                256-bit SSL
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                PCI DSS Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                No card storage
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={!selectedPlan || !selectedGateway || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-white transition-all duration-200 shadow-xl ${
                selectedPlan && selectedGateway && !isSubmitting
                  ? "bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:-translate-y-0.5 shadow-orange-200"
                  : "bg-slate-300 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading || isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay{" "}
                  {selectedPlan &&
                    `${currencySymbol}${selectedPlan.amount.toLocaleString()}`}{" "}
                  Securely
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}

        {/* Processing overlay */}
        {step === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Opening payment window...
            </h3>
            <p className="text-slate-400">
              Please complete the payment in the opened window
            </p>
          </motion.div>
        )}

        {/* Redirecting */}
        {step === "redirecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Redirecting to payment page...
            </h3>
            <p className="text-slate-400">
              You will be redirected back after payment
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentMethodContent />
    </Suspense>
  );
}
