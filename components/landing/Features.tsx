"use client";

import { FEATURES } from "@/lib/constants";
import { motion } from "framer-motion";

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="text-4xl sm:text-5xl hero-title font-bold text-center text-white mb-4"
        >
          Powerful Features
        </motion.h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto reveal">
          Everything you need to create an amazing digital menu experience for
          your customers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.24 }}
              transition={{ delay: index * 0.05, duration: 0.45 }}
              className="p-6 rounded-2xl glass-panel border border-slate-600 hover:border-orange-300/60 transition-colors duration-300 group cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-serif italic">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

