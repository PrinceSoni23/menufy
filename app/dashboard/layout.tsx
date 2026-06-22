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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
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
  }, [isAuthenticated, loading, isMounted, router, user?.email]);

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] flex items-center justify-center text-slate-900">
        <div className="text-center reveal reveal-visible">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] flex items-center justify-center text-slate-900">
        <div className="text-center">
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAnalytics = pathname === "/dashboard/analytics";
  const shellClass = "dashboard-shell dashboard-light";

  return (
    <div className={`${shellClass} flex h-screen bg-transparent text-black`}>
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-72 bg-white border-r border-black/10 transition-transform duration-300 z-40 lg:translate-x-0 lg:static text-black`}
      >
        <div className="relative overflow-hidden p-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white text-sm font-black">
              MR
            </span>
            <div>
              <h2 className="text-2xl hero-title text-black">MenuAR</h2>
              <p className="text-xs text-black/70 mt-1 tracking-wide uppercase">
                Control Center
              </p>
            </div>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-black/70 border border-black/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Production Workspace
          </div>
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
                    ? "text-black border-black/10 bg-black/[0.03]"
                    : "text-black/70 border-transparent hover:border-black/10 hover:bg-black/[0.02] hover:text-black"
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.16em] text-black/70">
              Logged in as
            </p>
            <p className="font-semibold text-black">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative overflow-hidden bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between text-black">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-black/70 hover:text-black"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="relative flex-1 text-center lg:text-left">
            <h1 className="text-2xl font-bold hero-title text-black">
              Operations Dashboard
            </h1>
            <p className="text-xs uppercase tracking-[0.16em] text-black/70 mt-1 hidden md:block">
              Realtime visibility across restaurants, menus, and conversion flow
            </p>
          </div>
          <div className="relative hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/70 border border-black/10">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            Live Workspace
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-transparent">
          <div className={isAnalytics ? "p-0" : "p-6"}>
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
