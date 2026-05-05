"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        className="max-w-4xl mx-auto text-center rounded-3xl p-10 bg-linear-to-r from-orange-500 via-amber-400 to-teal-400 text-amber-950 shadow-2xl shadow-orange-500/25"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-serif italic">
          Ready to Transform Your Menu?
        </h2>
        <p className="text-lg text-amber-950/80 mb-8 max-w-2xl mx-auto font-medium">
          Join restaurants worldwide that are using our platform to engage
          customers and increase orders. Get started in just 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-amber-950 text-amber-100 rounded-xl font-semibold hover:bg-amber-900 transition-colors duration-300"
          >
            Create Free Account
          </Link>
          <Link
            href="mailto:demo@armenu.app"
            className="px-8 py-4 border-2 border-amber-950/40 text-amber-950 rounded-xl font-semibold hover:bg-amber-950/10 transition-colors duration-300"
          >
            Schedule Demo
          </Link>
        </div>

        <p className="text-amber-950/80 mt-8 font-medium">
          ✓ No credit card required &nbsp;&nbsp;✓ Free forever plan
          &nbsp;&nbsp;✓ 100 free conversions/month
        </p>
      </motion.div>
    </section>
  );
}

