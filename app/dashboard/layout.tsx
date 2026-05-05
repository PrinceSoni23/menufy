"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "DB" },
  { name: "Restaurants", href: "/dashboard/restaurants", icon: "RS" },
  { name: "Menu Items", href: "/dashboard/menu", icon: "MN" },
  { name: "Analytics", href: "/dashboard/analytics", icon: "AN" },
  { name: "Settings", href: "/dashboard/settings", icon: "ST" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication and redirect if needed
  useEffect(() => {
    // Only check auth after component is mounted and auth is done loading
    if (isMounted && !loading) {
      console.log("Dashboard auth check:", {
        isAuthenticated,
        userEmail: user?.email,
      });
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, isMounted, router]);

  // Don't render dashboard content until mounted and authenticated
  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center reveal reveal-visible">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Wait for redirect, don't render content
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="dashboard-shell flex h-screen bg-slate-900">
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-72 glass-panel border-r border-slate-700 transition-transform duration-300 z-40 lg:translate-x-0 lg:static`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-300 to-emerald-300 text-[#071425] text-sm font-black shadow-lg shadow-cyan-500/30">
              MR
            </span>
            <div>
              <h2 className="text-2xl hero-title gradient-text">MenuAR</h2>
              <p className="text-xs text-slate-400 mt-1 tracking-wide uppercase">
                Control Center
              </p>
            </div>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">
            Production Workspace
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map(item => (
            <motion.div key={item.href} whileHover={{ x: 5 }}>
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl border transition-all ${
                  pathname === item.href
                    ? "text-cyan-100 border-cyan-200/35 bg-cyan-500/12"
                    : "text-slate-300 border-transparent hover:border-cyan-200/20 hover:bg-cyan-500/8 hover:text-slate-100"
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.14em] rounded-md border border-current/35 px-1.5 py-0.5">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Logged in as
            </p>
            <p className="font-semibold text-slate-200">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary w-full text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="glass-panel border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-300 hover:text-slate-100"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl font-bold hero-title text-slate-100">
              Operations Dashboard
            </h1>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mt-1 hidden md:block">
              Realtime visibility across restaurants, menus, and conversion flow
            </p>
          </div>
          <div className="fancy-pill hidden sm:inline-flex">Live Workspace</div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.26 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
