"use client";

import Link from "next/link";
import Image from "next/image";
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
            className="flex items-center gap-2 sm:gap-3 whitespace-nowrap hover:opacity-80 transition"
          >
            <Image
              src="/logo.png"
              alt="Menufy logo"
              width={40}
              height={40}
              className="h-7 w-7 sm:h-9 sm:w-9 lg:h-11 lg:w-11 object-contain shrink-0"
              priority
            />
            Menufy
          </Link>

          {/* Center - Navigation Items (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-[#8b2323] flex-1 justify-center">
            <button className="font-semibold text-[#8b2323] hover:text-[#8b2323] transition duration-300">
              Home
            </button>

            <button className="font-semibold text-[#8b2323] hover:text-[#8b2323] transition duration-300">
              About
            </button>

            <button className="font-semibold text-[#8b2323] hover:text-[#8b2323] transition duration-300">
              Policies
            </button>

            <button className="font-semibold text-[#8b2323] hover:text-[#8b2323] transition duration-300">
              Dashboard
            </button>
          </nav>

          {/* Right - RESERVE Button and GIFTING */}
          <div className="hidden lg:flex items-center gap-3 sm:gap-4 lg:gap-6">
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
                  Login / Register
                </Link>
                {/* <button className="text-[#8b2323] font-semibold text-sm hover:text-[#8b2323] transition whitespace-nowrap hidden sm:inline">
                  GIFTING
                </button> */}
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
                <button
                  className="block w-full text-left py-2 font-semibold text-[#8b2323] hover:text-[#8b2323]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </button>

                <button
                  className="block w-full text-left py-2 font-semibold text-[#8b2323] hover:text-[#8b2323]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </button>

                <button
                  className="block w-full text-left py-2 font-semibold text-[#8b2323] hover:text-[#8b2323]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Policies
                </button>

                <button
                  className="block w-full text-left py-2 font-semibold text-[#8b2323] hover:text-[#8b2323]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </button>

                <Link
                  href="/register"
                  className="block w-full px-6 py-2.5 bg-gradient-to-r from-[#8b2323] to-[#8b2323] hover:from-[#8b2323] hover:to-[#8b2323] text-[#fff1cf] font-semibold rounded-full transition-all text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Register
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
