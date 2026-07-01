"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-6xl mx-auto rounded-3xl p-8 md:p-10 border border-[#8b2323]/20 bg-[#fff1cf] shadow-[0_24px_60px_rgba(139,35,35,0.08)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b2323] to-[#8b2323] text-[#fff1cf] text-sm font-black shadow-lg shadow-[#8b2323]/40">
                MR
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-[#8b2323] via-[#8b2323] to-[#e7d3d3] bg-clip-text text-transparent">
                menuffy
              </span>
            </div>
            <p className="text-[#8b2323] text-sm leading-relaxed">
              The premium digital menu platform for modern restaurants. Launch
              faster, convert better, and look world-class on every table.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8b2323] mt-4">
              Built for hospitality startups
            </p>
          </div>

          <div>
            <h4 className="text-[#8b2323] font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#8b2323] font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Start Free
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#8b2323] font-semibold mb-4">Trust</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8b2323]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#8b2323] text-sm">
              © 2026 menuffy. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="/"
                className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
              >
                X
              </Link>
              <Link
                href="/"
                className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="/"
                className="text-[#8b2323] hover:text-[#8b2323] transition-colors"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
