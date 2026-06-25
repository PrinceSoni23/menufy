"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Bell,
  ClipboardList,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Store,
  UtensilsCrossed,
  Sparkles,
  CircleDot,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Restaurants", href: "/dashboard/restaurants", icon: Store },
  { name: "Menu Items", href: "/dashboard/menu", icon: UtensilsCrossed },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] flex items-center justify-center text-slate-900">
        <div className="text-center reveal reveal-visible">
          <div className="animate-spin text-5xl mb-4">⚙️</div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#fff7ec] via-[#f6f8ff] to-[#e9fbff] flex items-center justify-center text-slate-900">
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
    <div
      className={`${shellClass} flex min-h-screen bg-[#f5f6fb] text-slate-900`}
    >
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 flex h-screen w-[min(24rem,85vw)] flex-col overflow-hidden border-r border-slate-200/80 bg-white/92 text-slate-900 shadow-[12px_0_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:shrink-0 lg:w-80`}
      >
        <div className="relative overflow-hidden border-b border-slate-200/70 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_26%)]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)]">
              <span className="text-sm font-black tracking-[0.18em]">MR</span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                MenuAR
              </h2>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Control Center
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navigation.map(item => (
            <motion.div key={item.href} whileHover={{ x: 4 }}>
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all ${
                  pathname === item.href
                    ? "border-violet-200 bg-linear-to-r from-violet-50 via-white to-indigo-50 text-slate-950 shadow-[0_16px_32px_rgba(99,102,241,0.08)]"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                    pathname === item.href
                      ? "border-violet-200 bg-white text-violet-600 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 group-hover:border-violet-200 group-hover:text-violet-600"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="border-t border-slate-200/70 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Exit
            </span>
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex flex-1 flex-col overflow-hidden">
        <header className="relative flex items-center justify-between overflow-hidden border-b border-slate-200/70 bg-white/85 px-4 py-4 text-slate-900 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,246,251,0.7))]" />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative z-10 rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative z-10 flex-1 text-center lg:text-left">
            <h1 className="text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
              Operations Dashboard
            </h1>
            <p className="mt-1 hidden text-xs uppercase tracking-[0.24em] text-slate-500 md:block">
              Realtime visibility across restaurants, menus, and conversion flow
            </p>
          </div>
          <div className="relative z-10 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm sm:inline-flex">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
            Live Workspace
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#f5f6fb]">
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
          className="fixed inset-0 z-30 bg-slate-950/10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
