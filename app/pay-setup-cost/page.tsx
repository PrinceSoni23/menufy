"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const razorpayPaymentLink =
  process.env.NEXT_PUBLIC_RAZORPAY_SETUP_LINK ||
  "https://rzp.io/rzp/your-setup-cost-link";

const benefits = [
  "Secure one-time payment through Razorpay",
  "Fast onboarding for your restaurant setup",
  "Instant confirmation and support follow-up",
];

export default function PaySetupCostPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const displayPrice = currency === "USD" ? "$69" : "₹5,999";
  const originalPrice = currency === "USD" ? "$120" : "₹10,999";

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff1cf_0%,#e7d3d3_35%,#cce5ff_100%)] text-[#5d2d2d]">
      <Header skipAuth />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-4xl border border-white/70 bg-white/70 p-8 shadow-[0_20px_70px_rgba(162,78,78,0.12)] backdrop-blur-xl lg:flex-row lg:items-center lg:p-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a24e4e]/20 bg-[#fff1cf] px-3 py-1.5 text-sm font-semibold text-[#a24e4e]">
              <CreditCard className="h-4 w-4" />
              Pay setup cost
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Complete your one-time setup payment securely.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#6f4d41]">
                This page is designed to match the light, premium feel of the
                website. Use the Razorpay button below to proceed with your
                setup cost payment.
              </p>
            </div>

            <div className="rounded-3xl border border-[#a24e4e]/15 bg-[#fffaf3] p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a24e4e]">
                  Limited offer
                </span>
                <span className="text-2xl font-semibold text-[#6f4d41] line-through">
                  {originalPrice}
                </span>
                <span className="text-4xl font-bold text-[#a24e4e]">
                  {displayPrice}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#6f4d41]">
                Save more with this discounted setup fee. Switch currency below
                if you prefer INR.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    currency === "USD"
                      ? "bg-[#a24e4e] text-white"
                      : "bg-white text-[#a24e4e] ring-1 ring-[#a24e4e]/20"
                  }`}
                >
                  USD
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    currency === "INR"
                      ? "bg-[#a24e4e] text-white"
                      : "bg-white text-[#a24e4e] ring-1 ring-[#a24e4e]/20"
                  }`}
                >
                  INR
                </button>
              </div>
            </div>

            <ul className="space-y-3">
              {benefits.map(benefit => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-[#6f4d41]"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#a24e4e]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={razorpayPaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a24e4e] px-6 py-3 font-semibold text-white transition hover:bg-[#8b3d3d]"
              >
                Pay with Razorpay
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#a24e4e]/20 bg-white/80 px-6 py-3 font-semibold text-[#a24e4e] transition hover:bg-[#fff1cf]"
              >
                Back to pricing
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-[#a24e4e]/10 bg-linear-to-br from-[#fff1cf] via-white to-[#e7d3d3] p-6 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#a24e4e]/10 p-3 text-[#a24e4e]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#a24e4e]">
                  Secure checkout
                </p>
                <p className="text-sm text-[#6f4d41]">Handled by Razorpay</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-5">
              <p className="text-sm text-[#6f4d41]">Payment link</p>
              <p className="mt-2 break-all text-sm font-medium text-[#5d2d2d]">
                {razorpayPaymentLink}
              </p>
              <p className="mt-4 text-sm text-[#6f4d41]">
                Replace the default link with your real Razorpay payment link if
                needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
