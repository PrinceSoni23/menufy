"use client";

import { motion } from "framer-motion";
import { Shield, Scale, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LegalHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50   ">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900    bg-clip-text text-transparent mb-4">
            Legal Center
          </h1>
          <p className="text-lg text-slate-600  max-w-2xl mx-auto">
            Access menuffy's legal documents, policies, and terms. Transparency
            is at the core of our service.
          </p>
        </motion.div>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/legal/privacy">
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="h-full p-8 rounded-2xl bg-white  border border-slate-200  cursor-pointer transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100   w-fit mb-4"
                >
                  <Shield className="w-8 h-8 text-blue-600 " />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900  mb-3">
                  Privacy Policy
                </h2>
                <p className="text-slate-600  mb-6">
                  Understand how menuffy collects, uses, protects, and processes
                  your personal data and business information.
                </p>

                <div className="flex items-center gap-2 text-blue-600  font-semibold group">
                  Read Full Policy
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/legal/terms">
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="h-full p-8 rounded-2xl bg-white  border border-slate-200  cursor-pointer transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100   w-fit mb-4"
                >
                  <Scale className="w-8 h-8 text-purple-600 " />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900  mb-3">
                  Terms & Conditions
                </h2>
                <p className="text-slate-600  mb-6">
                  Learn the complete terms governing your use of menuffy,
                  including subscription plans, payment terms, and user
                  responsibilities.
                </p>

                <div className="flex items-center gap-2 text-purple-600  font-semibold group">
                  Read Full Terms
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Quick Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50   border border-blue-200 "
        >
          <h3 className="text-xl font-bold text-slate-900  mb-4">
            Questions or Concerns?
          </h3>
          <p className="text-slate-700  mb-6">
            If you have any questions about our policies or need to exercise
            your privacy rights, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="mailto:privacy@menuffy.com"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Email Privacy Team
            </a>
            <a
              href="mailto:legal@menuffy.com"
              className="px-6 py-3 rounded-lg bg-slate-200  hover:bg-slate-300  text-slate-900  font-semibold transition-colors"
            >
              Contact Legal
            </a>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-sm text-slate-600 "
        >
          <p>
            Last updated: June 27, 2024 | © {new Date().getFullYear()} menuffy
            Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
