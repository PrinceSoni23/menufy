"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Sparkles,
  Store,
} from "lucide-react";

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("Sending your request...");

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "We could not send your request right now.",
        );
      }

      setStatus("success");
      setFeedback(data.message || "Your request was sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        restaurantName: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not send your request right now.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#fff1cf_0%,_#e7d3d3_35%,_#cce5ff_100%)] text-[#6d3c3c]">
      <Header skipAuth />

      <section className="relative overflow-hidden px-4 pt-6 pb-12 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10 lg:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.7),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(162,78,78,0.08)_0%,_transparent_40%,_rgba(204,229,255,0.35)_100%)]" />

        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 6, 0], rotate: [0, 1, 0] }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute left-[-4%] top-10 hidden h-44 w-44 rounded-full border border-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(255,241,207,0.55)_45%,_rgba(162,78,78,0.18)_100%)] shadow-[0_20px_60px_rgba(109,60,60,0.12)] blur-[1px] lg:block"
        />
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute right-[-2%] top-28 hidden h-56 w-56 rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,_rgba(255,255,255,0.9),_rgba(204,229,255,0.5))] shadow-[0_25px_80px_rgba(109,60,60,0.12)] lg:block"
        />
        <motion.div
          animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-6 left-[8%] hidden h-28 w-28 rounded-full border border-white/70 bg-[radial-gradient(circle,_rgba(255,255,255,0.82)_0%,_rgba(231,211,211,0.65)_100%)] shadow-[0_16px_45px_rgba(109,60,60,0.1)] lg:block"
        />

        <div className="relative mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(109,60,60,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_45%)]" />
          </div>
          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#a24e4e]/20 bg-[#fff8eb] px-3 py-1 text-sm font-medium text-[#8b2323]">
                <Sparkles className="h-4 w-4" />
                Book a live demo
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#5d2d2d] sm:text-5xl">
                  Bring your restaurant menu into a premium digital experience.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#7a5a4e]">
                  Discover how Menuffy can turn your menu into a polished,
                  modern experience with interactive previews, beautiful
                  layouts, and tools that help guests order with confidence.
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-[#a24e4e]/10 bg-[#fffdf8] p-4 text-sm text-[#7a5a4e] shadow-sm sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#a24e4e]" />
                  Elevate your brand
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#a24e4e]" />
                  Fast follow-up
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#a24e4e]" />
                  Personalized guidance
                </div>
              </div>

              <div className="rounded-3xl border border-[#a24e4e]/10 bg-gradient-to-br from-[#fff8eb] to-[#f1e4e4] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b2323]">
                  What you’ll get
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#6f4f45]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#a24e4e]" />
                    A guided walkthrough of the platform and its premium
                    features.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#a24e4e]" />
                    Tailored recommendations based on your restaurant concept.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#a24e4e]" />
                    A simple setup plan so you can launch confidently.
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[1.75rem] border border-[#a24e4e]/20 bg-[rgba(255,255,255,0.9)] p-5 shadow-[0_20px_60px_rgba(109,60,60,0.11)] sm:p-7"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-10" />
              <div className="absolute right-[-10%] top-[-10%] h-32 w-32 rounded-full border border-white/70 bg-white/50 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-6 space-y-2">
                  <h2 className="text-2xl font-semibold text-[#5d2d2d]">
                    Request your demo
                  </h2>
                  <p className="text-sm leading-6 text-[#7a5a4e]">
                    Share a few details and our team will reach out to arrange a
                    suitable time.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#6d3c3c] sm:col-span-2">
                    Full name
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={event =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e2c6c6] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a24e4e] focus:ring-2 focus:ring-[#a24e4e]/20"
                      placeholder="Alex Morgan"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#6d3c3c]">
                    Email
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={event =>
                        setFormData({ ...formData, email: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e2c6c6] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a24e4e] focus:ring-2 focus:ring-[#a24e4e]/20"
                      placeholder="you@restaurant.com"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#6d3c3c]">
                    Phone number
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={event =>
                        setFormData({ ...formData, phone: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e2c6c6] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a24e4e] focus:ring-2 focus:ring-[#a24e4e]/20"
                      placeholder="+1 234 567 8900"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#6d3c3c] sm:col-span-2">
                    Restaurant name
                    <input
                      required
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={event =>
                        setFormData({
                          ...formData,
                          restaurantName: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e2c6c6] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a24e4e] focus:ring-2 focus:ring-[#a24e4e]/20"
                      placeholder="The Golden Plate"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#6d3c3c] sm:col-span-2">
                    Anything you want us to know?
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={event =>
                        setFormData({
                          ...formData,
                          message: event.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e2c6c6] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#a24e4e] focus:ring-2 focus:ring-[#a24e4e]/20"
                      placeholder="Tell us about your restaurant, goals, or preferred demo time."
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#a24e4e] px-6 py-3 text-sm font-semibold text-[#fff8eb] transition hover:bg-[#8b2323] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Sending request..." : "Book demo"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {feedback ? (
                  <p
                    className={`mt-4 text-sm ${
                      status === "success" ? "text-[#2f7a4d]" : "text-[#8b2323]"
                    }`}
                  >
                    {feedback}
                  </p>
                ) : null}

                <p className="mt-4 text-sm text-[#8f6e5f]">
                  Prefer direct email? Reach us at{" "}
                  <a
                    href="mailto:menufy@tripittoday.com"
                    className="font-semibold text-[#a24e4e] underline"
                  >
                    menufy@tripittoday.com
                  </a>
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
