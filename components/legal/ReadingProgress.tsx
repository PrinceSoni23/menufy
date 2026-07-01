"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollPercent =
        documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-50 origin-left"
      style={{ scaleX: progress / 100 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    />
  );
};
