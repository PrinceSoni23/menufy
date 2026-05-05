"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="relative z-50 w-full bg-transparent border-b border-[#8b2323]/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left - haven logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-[#8b2323] via-[#8b2323] to-[#e7d3d3] bg-clip-text text-transparent font-bold italic whitespace-nowrap hover:opacity-80 transition"
          >
            haven
          </Link>

          {/* Center - Navigation Items (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-[#8b2323] flex-1 justify-center">
            <button className="font-semibold text-[#8b2323] hover:text-[#8b2323] transition duration-300">
              HOME
            </button>

            <div className="flex flex-col items-center hover:text-[#8b2323] transition">
              <span className="font-medium text-xs leading-tight">COFFEE</span>
              <span className="text-xs text-[#8b2323]">8:30 - 6:00</span>
            </div>

            <div className="flex flex-col items-center hover:text-[#8b2323] transition">
              <span className="font-medium text-xs leading-tight">BRUNCH</span>
              <span className="text-xs text-[#8b2323]">9:00 - 2:00</span>
            </div>

            <button className="font-medium hover:text-[#8b2323] transition duration-300">
              HAVEN
            </button>
          </nav>

          {/* Right - RESERVE Button and GIFTING */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#8b2323] hidden sm:inline">
                  {user?.firstName}
                </span>
                <Link
                  href="/dashboard"
                  className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-[#8b2323] to-[#8b2323] hover:from-[#8b2323] hover:to-[#8b2323] text-[#fff1cf] font-semibold rounded-full transition-all duration-300 text-sm whitespace-nowrap shadow-lg shadow-[#8b2323]/40"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-[#8b2323] font-semibold text-sm hover:text-[#8b2323] transition whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-[#8b2323] to-[#8b2323] hover:from-[#8b2323] hover:to-[#8b2323] text-[#fff1cf] font-semibold rounded-full transition-all duration-300 text-sm whitespace-nowrap shadow-lg shadow-[#8b2323]/40"
                >
                  RESERVE
                </Link>
                <button className="text-[#8b2323] font-semibold text-sm hover:text-[#8b2323] transition whitespace-nowrap hidden sm:inline">
                  GIFTING
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#8b2323] ml-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden pb-4 border-t border-[#8b2323]/20 mt-2"
            >
              <nav className="space-y-3 py-4">
                <button className="block w-full text-left py-2 font-semibold text-[#8b2323] hover:text-[#8b2323]">
                  HOME
                </button>

                <div className="block w-full text-left py-2 text-sm text-[#8b2323]">
                  <div className="font-medium text-xs">COFFEE</div>
                  <div className="text-xs text-[#8b2323]">8:30 - 6:00</div>
                </div>

                <div className="block w-full text-left py-2 text-sm text-[#8b2323]">
                  <div className="font-medium text-xs">BRUNCH</div>
                  <div className="text-xs text-[#8b2323]">9:00 - 2:00</div>
                </div>

                <button className="block w-full text-left py-2 font-medium text-[#8b2323] hover:text-[#8b2323]">
                  HAVEN
                </button>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block w-full px-6 py-2.5 bg-gradient-to-r from-[#8b2323] to-[#8b2323] hover:from-[#8b2323] hover:to-[#8b2323] text-[#fff1cf] font-semibold rounded-full transition-all text-center text-sm"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full py-2 text-[#8b2323] font-semibold text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 text-[#8b2323] font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full px-6 py-2.5 bg-gradient-to-r from-[#8b2323] to-[#8b2323] hover:from-[#8b2323] hover:to-[#8b2323] text-[#fff1cf] font-semibold rounded-full transition-all text-center text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      RESERVE
                    </Link>
                  </>
                )}

                <button className="block w-full text-left py-2 text-[#A7805A] font-semibold text-sm\">
                  GIFTING
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
