"use client";

import Link from "next/link";
import { PRICING_PLANS } from "@/lib/constants";
import { motion } from "framer-motion";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="text-4xl sm:text-5xl hero-title font-bold text-center text-white mb-4"
        >
          Simple, Transparent Pricing
        </motion.h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">
          Start free and scale your restaurant as you grow. No hidden fees,
          cancel anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-linear-to-br from-orange-500 to-amber-400 text-amber-950 shadow-2xl shadow-orange-500/35 md:scale-105"
                  : "glass-panel border border-slate-600"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-2 font-serif italic ${plan.highlighted ? "text-white" : "text-white"}`}
              >
                {plan.name}
              </h3>
              <div
                className={`mb-6 ${plan.highlighted ? "text-white" : "text-slate-300"}`}
              >
                <div className="text-4xl font-bold">{plan.price}</div>
                <div className="text-sm opacity-80">{plan.period}</div>
              </div>

              <ul
                className={`space-y-3 mb-8 ${plan.highlighted ? "text-white" : "text-slate-300"}`}
              >
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <span className="mr-3">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-amber-950 text-amber-100 hover:bg-amber-900"
                    : "btn-primary"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

