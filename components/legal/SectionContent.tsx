"use client";

import React from "react";

interface SectionContentProps {
  children: React.ReactNode;
}

export const SectionContent: React.FC<SectionContentProps> = ({ children }) => {
  return (
    <div className="text-slate-700  leading-relaxed space-y-4 text-sm sm:text-base">
      {children}
    </div>
  );
};
