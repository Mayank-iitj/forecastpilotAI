"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, TrendingDown, Target, Shield,
  Activity, BarChart3, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, ArrowDownRight, Sparkles, Zap,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie,
  Cell, RadialBarChart, RadialBar, Legend,
} from "recharts";

import api from "@/lib/api";

const defaultKpis = [
  { label: "Forecast Revenue", value: "---", change: "", trend: "neutral", icon: DollarSign, color: "from-blue-500 to-cyan-400", glow: "shadow-blue-500/20" },
  { label: "Forecast ROAS", value: "---", change: "", trend: "neutral", icon: TrendingUp, color: "from-green-500 to-emerald-400", glow: "shadow-green-500/20" },
  { label: "Forecast Confidence", value: "---", change: "", trend: "neutral", icon: Target, color: "from-purple-500 to-violet-400", glow: "shadow-purple-500/20" },
  { label: "Revenue Risk", value: "---", change: "", trend: "neutral", icon: Shield, color: "from-amber-500 to-orange-400", glow: "shadow-amber-500/20" },
  { label: "Forecast Accuracy", value: "---", change: "", trend: "neutral", icon: CheckCircle2, color: "from-teal-500 to-cyan-400", glow: "shadow-teal-500/20" },
  { label: "Budget Efficiency", value: "---", change: "", trend: "neutral", icon: Zap, color: "from-indigo-500 to-blue-400", glow: "shadow-indigo-500/20" },
];

const recentActivity = [
  { action: "Forecast generated", detail: "Q3 Revenue — 87.3% confidence", time: "2 min ago", icon: BarChart3, color: "text-blue-400" },
  { action: "Anomaly detected", detail: "Google Ads revenue spike +42%", time: "15 min ago", icon: AlertTriangle, color: "text-amber-400" },
  { action: "Dataset uploaded", detail: "marketing_jan_2025.csv — 94.2% quality", time: "1 hour ago", icon: CheckCircle2, color: "text-green-400" },
  { action: "Report generated", detail: "Executive Summary — PDF export", time: "3 hours ago", icon: Sparkles, color: "text-purple-400" },
];

function AnimatedValue({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);
  return (
    <span className={`transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      {value}
    </span>
  );
}

export default function DashboardPage() {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [channelData, setChannelData] = useState<any[]>([]);
  const [kpiCards, setKpiCards] = useState<any[]>(defaultKpis);
  const [forecastHealth, setForecastHealth] = useState({ confidence: 87.3, accuracy: 91.2, stability: "High" });
  const [activity, setActivity] = useState(recentActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/forecasts/overview');
        const data = res.data;
        if (data.revenueTrend) setRevenueTrend(data.revenueTrend);
        if (data.channelData) setChannelData(data.channelData);
        if (data.forecastHealth) setForecastHealth(data.forecastHealth);
        if (data.recentActivity) setActivity(data.recentActivity);
        if (data.kpiCards) {
          // Merge dynamic data with static icons
          const mergedKpis = defaultKpis.map((defaultKpi, index) => ({
            ...defaultKpi,
            ...(data.kpiCards[index] || {})
          }));
          setKpiCards(mergedKpis);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Executive Overview</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Your marketing intelligence at a glance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`kpi-card rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm ${kpi.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-xl font-bold font-mono-numbers">
              <AnimatedValue value={kpi.value} />
            </div>
            {kpi.change && (
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
                kpi.trend === "up" ? "text-green-400" : kpi.trend === "down" ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"
              }`}>
                {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : kpi.trend === "down" ? <ArrowDownRight className="w-3 h-3" /> : null}
                {kpi.change}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenue Trend</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Actual vs Forecast — Last 30 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded bg-blue-500" />
                <span className="text-[hsl(var(--muted-foreground))]">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded bg-purple-500 opacity-70" style={{ borderBottom: "2px dashed" }} />
                <span className="text-[hsl(var(--muted-foreground))]">Forecast</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2} fill="transparent" strokeDasharray="6 3" />
              <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Channel Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h3 className="font-semibold mb-4">Channel Revenue</h3>
          <div className="space-y-3">
            {channelData.map((ch, i) => {
              const pct = (ch.revenue / channelData[0].revenue) * 100;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">{ch.name}</span>
                    <span className="font-mono-numbers font-medium">${(ch.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h3 className="font-semibold mb-4">Forecast Health</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={[{ value: forecastHealth.confidence, fill: "#3B82F6" }]} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(215 27% 17%)" }} />
                <text x="50%" y="45%" textAnchor="middle" className="text-2xl font-bold fill-current" style={{ fill: "hsl(210 40% 98%)" }}>
                  {forecastHealth.confidence}%
                </text>
                <text x="50%" y="60%" textAnchor="middle" className="text-xs" style={{ fill: "hsl(215 20% 65%)" }}>
                  Confidence
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-[hsl(var(--muted))]">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Accuracy</div>
              <div className="font-bold font-mono-numbers text-green-400">{forecastHealth.accuracy}%</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[hsl(var(--muted))]">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Stability</div>
              <div className="font-bold font-mono-numbers text-blue-400">{forecastHealth.stability}</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activity.map((item: any, i: number) => {
              const icons: any = { CheckCircle2, BarChart3, Activity, AlertTriangle, Sparkles };
              const IconComponent = typeof item.icon === 'string' ? (icons[item.icon] || Sparkles) : item.icon;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.action}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] truncate">{item.detail}</div>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">{item.time}</span>
              </motion.div>
            )})}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
