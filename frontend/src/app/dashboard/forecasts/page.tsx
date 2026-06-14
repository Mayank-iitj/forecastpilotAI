"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, ComposedChart, Line, Bar } from "recharts";

const generateForecastData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const base = 5100 + Math.sin(i / 7) * 800 + i * 15;
    const width = 0.05 + (i / days) * 0.15;
    data.push({
      day: `Day ${i + 1}`,
      expected: Math.round(base),
      optimistic: Math.round(base * (1 + width * 1.2)),
      pessimistic: Math.round(base * (1 - width * 1.1)),
      ci_upper: Math.round(base * (1 + width * 0.6)),
      ci_lower: Math.round(base * (1 - width * 0.5)),
    });
  }
  return data;
};

const metrics = [
  { label: "Total Revenue", value: "$153,000", change: "+5.2%", trend: "up" },
  { label: "Avg ROAS", value: "5.24x", change: "+0.3x", trend: "up" },
  { label: "Total Spend", value: "$29,262", change: "+2.1%", trend: "up" },
  { label: "Conversions", value: "1,800", change: "+8.3%", trend: "up" },
  { label: "Avg AOV", value: "$85.00", change: "-1.2%", trend: "down" },
  { label: "Avg CAC", value: "$16.26", change: "-3.1%", trend: "up" },
  { label: "Avg LTV", value: "$340.00", change: "+2.8%", trend: "up" },
];

const decomposition = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  trend: 5000 + i * 20,
  seasonality: Math.sin(i / 5) * 500,
  residual: (Math.random() - 0.5) * 200,
}));

export default function ForecastsPage() {
  const [period, setPeriod] = useState(30);
  const forecastData = generateForecastData(period);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Forecast Engine</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Multi-metric forecasting with confidence intervals</p>
        </div>
        <div className="flex items-center gap-2">
          {[30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === d
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                  : "border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3"
          >
            <div className="text-xs text-[hsl(var(--muted-foreground))]">{m.label}</div>
            <div className="text-lg font-bold font-mono-numbers mt-1">{m.value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${m.trend === "up" ? "text-green-400" : "text-red-400"}`}>
              {m.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {m.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Revenue Forecast — {period} Days</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Expected + Optimistic + Pessimistic with 95% CI</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-blue-500" /><span className="text-[hsl(var(--muted-foreground))]">Expected</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-green-400" /><span className="text-[hsl(var(--muted-foreground))]">Optimistic</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-red-400" /><span className="text-[hsl(var(--muted-foreground))]">Pessimistic</span></div>
            <div className="flex items-center gap-1.5"><div className="w-6 h-3 rounded bg-blue-500/20" /><span className="text-[hsl(var(--muted-foreground))]">95% CI</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} interval={Math.floor(period / 8)} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`$${v.toLocaleString()}`, ""]} />
            <Area type="monotone" dataKey="ci_upper" stroke="transparent" fill="url(#ciGrad)" />
            <Area type="monotone" dataKey="ci_lower" stroke="transparent" fill="transparent" />
            <Area type="monotone" dataKey="optimistic" stroke="#22C55E" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="pessimistic" stroke="#EF4444" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="expected" stroke="#3B82F6" strokeWidth={2.5} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Decomposition */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        <h3 className="font-semibold mb-4">Trend Decomposition</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={decomposition}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
            <Line type="monotone" dataKey="trend" stroke="#3B82F6" strokeWidth={2} dot={false} name="Trend" />
            <Bar dataKey="seasonality" fill="#8B5CF6" opacity={0.6} name="Seasonality" />
            <Line type="monotone" dataKey="residual" stroke="#F59E0B" strokeWidth={1} dot={false} name="Residual" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
