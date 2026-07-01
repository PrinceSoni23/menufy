"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface PolicySectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  index: number;
}

export const PolicySection: React.FC<PolicySectionProps> = ({
  id,
  icon: Icon,
  title,
  children,
  index,
}) => {
  const [copied, setCopied] = useState(false);

  const copyLinkToSection = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group"
    >
      <div className="bg-white  rounded-2xl border border-slate-200  p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 ">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100   flex-shrink-0"
            >
              <Icon className="w-6 h-6 text-blue-600 " />
            </motion.div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 ">
                {title}
              </h2>
            </div>
          </div>

          {/* Copy Link Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyLinkToSection}
            className="p-2 rounded-lg bg-slate-100  hover:bg-slate-200  transition-colors duration-200"
            title="Copy link to this section"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600 " />
            ) : (
              <Copy className="w-5 h-5 text-slate-600 " />
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6" />

        {/* Content */}
        <div className="prose prose-sm sm:prose  max-w-none">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
