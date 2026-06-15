"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, Upload, LineChart, Shuffle, Dice5, Brain,
  Target, ShieldAlert, AlertTriangle, HelpCircle, BarChart3,
  FileText, Settings, Bell, ChevronLeft, ChevronRight,
  Rocket, LogOut, Search, User, Layers, Gauge,
  TrendingUp, Activity, Zap,
} from "lucide-react";
import { UserButton, SignOutButton } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Datasets", icon: Upload, href: "/dashboard/datasets" },
  { label: "Forecasts", icon: LineChart, href: "/dashboard/forecasts" },
  { label: "Channels", icon: Layers, href: "/dashboard/forecasts/channels" },
  { label: "Campaigns", icon: TrendingUp, href: "/dashboard/forecasts/campaigns" },
  { label: "Simulator", icon: Shuffle, href: "/dashboard/simulator" },
  { label: "Monte Carlo", icon: Dice5, href: "/dashboard/monte-carlo" },
  { label: "AI CFO", icon: Brain, href: "/dashboard/ai-cfo" },
  { label: "Optimizer", icon: Target, href: "/dashboard/optimizer" },
  { label: "Causal Intel", icon: Zap, href: "/dashboard/causal" },
  { label: "Risk Engine", icon: ShieldAlert, href: "/dashboard/risk" },
  { label: "Anomalies", icon: AlertTriangle, href: "/dashboard/anomalies" },
  { label: "What-If", icon: HelpCircle, href: "/dashboard/what-if" },
  { label: "Reports", icon: FileText, href: "/dashboard/reports" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Admin", icon: Settings, href: "/dashboard/admin" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userName, setUserName] = useState("Alex Morgan");
  const [userInitials, setUserInitials] = useState("AM");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("forecastpilot_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.name) {
            setUserName(user.name);
            const parts = user.name.split(" ");
            const initials = parts.map((p: string) => p[0]).join("").substring(0, 2).toUpperCase();
            setUserInitials(initials || "U");
          }
        } catch (e) {
          console.error("Failed to parse user info from localStorage", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("forecastpilot_token");
    localStorage.removeItem("forecastpilot_user");
    router.push("/auth/login");
  };

  return (
      <div className="min-h-screen flex bg-[hsl(var(--background))]">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full z-40 flex flex-col border-r border-[hsl(var(--border))] glass-strong transition-all duration-300 ${
            collapsed ? "w-[68px]" : "w-[240px]"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 h-16 border-b border-[hsl(var(--border))] shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-sm whitespace-nowrap"
              >
                ForecastPilot<span className="text-blue-500">AI</span>
              </motion.span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link flex items-center gap-3 text-sm ${
                    isActive
                      ? "active bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-medium"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[hsl(var(--primary))]" : ""}`} />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Controls */}
          <div className="border-t border-[hsl(var(--border))] p-2 space-y-1 shrink-0">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="sidebar-link flex items-center gap-3 w-full text-sm text-[hsl(var(--muted-foreground))]"
            >
              {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
              {!collapsed && <span>Collapse</span>}
            </button>
            <SignOutButton>
              <button
                className="sidebar-link flex items-center gap-3 w-full text-sm text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0 text-red-500" />
                {!collapsed && <span>Log Out</span>}
              </button>
            </SignOutButton>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-[240px]"}`}
        >
          {/* Top Header */}
          <header className="sticky top-0 z-30 h-14 border-b border-[hsl(var(--border))] glass-strong flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="relative" suppressHydrationWarning>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Search forecasts, reports..."
                  className="pl-9 pr-4 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  <Bell className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-[hsl(var(--border))]">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {[
                          { title: "Forecast Complete", desc: "Q3 Revenue Forecast — 87.3% confidence", time: "2m ago", dot: "bg-green-400" },
                          { title: "Anomaly Detected", desc: "Google Ads revenue spike +42%", time: "15m ago", dot: "bg-amber-400" },
                          { title: "Risk Alert", desc: "Meta ROAS below threshold", time: "1h ago", dot: "bg-red-400" },
                        ].map((n, i) => (
                          <div key={i} className="px-4 py-3 hover:bg-[hsl(var(--accent))] transition-colors border-b border-[hsl(var(--border))] last:border-0">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 shrink-0`} />
                              <div>
                                <div className="text-sm font-medium">{n.title}</div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">{n.desc}</div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{n.time}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="px-3">
                <UserButton />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
  );
}
