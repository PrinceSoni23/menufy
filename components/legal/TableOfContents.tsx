"use client";

import { motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Section {
  id: string;
  title: string;
  subsections?: Section[];
}

interface TableOfContentsProps {
  sections: Section[];
  onNavigate: (id: string) => void;
  activeSection: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  onNavigate,
  activeSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id)),
  );
  const tocRef = useRef<HTMLDivElement | null>(null);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".toc-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  // Scroll active TOC item into view on update
  useEffect(() => {
    const root = tocRef.current;
    if (!root) return;

    const activeButton = root.querySelector(
      `[data-toc-item="${activeSection}"]`,
    ) as HTMLButtonElement | null;
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeSection]);

  const renderSections = (items: Section[], depth = 0) => (
    <ul className="space-y-1">
      {items.map(section => (
        <li key={section.id}>
          <motion.div initial={false} className="space-y-1">
            <button
              onClick={() => {
                handleNavigate(section.id);
                if (section.subsections?.length) {
                  toggleSection(section.id);
                }
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                activeSection === section.id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              data-toc-item={section.id}
            >
              <span
                className={`text-sm md:text-base ${depth > 0 ? "ml-2" : ""}`}
              >
                {section.title}
              </span>
              {section.subsections?.length ? (
                <motion.div
                  animate={{
                    rotate: expandedSections.has(section.id) ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              ) : null}
            </button>

            {/* Subsections */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSections.has(section.id) ? 1 : 0,
                height: expandedSections.has(section.id) ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {section.subsections?.length
                ? renderSections(section.subsections, depth + 1)
                : null}
            </motion.div>
          </motion.div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:hidden z-40 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="toc-container hidden md:flex md:sticky md:top-24 md:w-64 md:h-[calc(100vh-6rem)] md:flex-col"
      >
        <div
          ref={tocRef}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg backdrop-blur-sm overflow-y-auto h-full"
        >
          <h2 className="text-lg font-bold text-slate-900  mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full" />
            Contents
          </h2>
          {renderSections(sections)}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="toc-container fixed left-0 top-0 h-screen w-64 bg-white  z-40 md:hidden overflow-y-auto shadow-xl"
      >
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900  flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full" />
            Contents
          </h2>
          {renderSections(sections)}
        </div>
      </motion.div>
    </>
  );
};
