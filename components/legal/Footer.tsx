"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  lastUpdated: string;
}

export const Footer: React.FC<FooterProps> = ({
  contactEmail,
  contactPhone,
  contactAddress,
  lastUpdated,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="border-t border-slate-200  bg-gradient-to-br from-slate-50 to-blue-50   mt-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <motion.div variants={item} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900  mb-2">
                Get in Touch
              </h3>
              <p className="text-slate-600 ">
                Have questions about our policies? We're here to help.
              </p>
            </div>

            <div className="space-y-4">
              <motion.a
                href={`mailto:${contactEmail}`}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-slate-700  hover:text-blue-600  transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-100  group-hover:bg-blue-200  transition-colors">
                  <Mail className="w-5 h-5 text-blue-600 " />
                </div>
                <span className="font-medium">{contactEmail}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </motion.a>

              {contactPhone && (
                <motion.a
                  href={`tel:${contactPhone}`}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-slate-700  hover:text-blue-600  transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-100  group-hover:bg-indigo-200  transition-colors">
                    <Phone className="w-5 h-5 text-indigo-600 " />
                  </div>
                  <span className="font-medium">{contactPhone}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </motion.a>
              )}

              {contactAddress && (
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 text-slate-700 "
                >
                  <div className="p-2 rounded-lg bg-purple-100  flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600 " />
                  </div>
                  <div>
                    <p className="font-medium">{contactAddress}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={item} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900  mb-4">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group cursor-pointer"
                >
                  <Link
                    href="/legal/privacy"
                    className="text-slate-700  hover:text-blue-600  transition-colors font-medium"
                  >
                    Privacy Policy
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="group cursor-pointer"
                >
                  <Link
                    href="/legal/terms"
                    className="text-slate-700  hover:text-blue-600  transition-colors font-medium"
                  >
                    Terms & Conditions
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={item}
          className="h-px bg-gradient-to-r from-transparent via-slate-300  to-transparent mb-8"
        />

        {/* Bottom Info */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600 "
        >
          <div>
            Last updated:{" "}
            <time dateTime={lastUpdated} className="font-semibold">
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="text-center">
            © {new Date().getFullYear()} menuffy. All rights reserved.
          </div>
          <div>
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              ❤️
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
