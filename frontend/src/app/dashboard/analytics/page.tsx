"use client";
import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const revenueTrend = Array.from({ length: 90 }, (_, i) => ({
  day: `Day ${i + 1}`,
  actual: Math.round(4800 + Math.sin(i / 7) * 600 + i * 15 + Math.random() * 300),
  forecast: Math.round(4900 + Math.sin(i / 7) * 500 + i * 18 + Math.random() * 200),
}));

const channelPerf = [
  { channel: "Google", revenue: 135000, roas: 4.22, conversions: 1588, color: "#4285F4" },
  { channel: "Meta", revenue: 114000, roas: 3.80, conversions: 1341, color: "#1877F2" },
  { channel: "Organic", revenue: 84000, roas: 0, conversions: 988, color: "#34A853" },
  { channel: "Email", revenue: 45000, roas: 42.06, conversions: 529, color: "#9333EA" },
  { channel: "Microsoft", revenue: 36000, roas: 3.53, conversions: 424, color: "#00A4EF" },
  { channel: "Affiliate", revenue: 25500, roas: 5.10, conversions: 300, color: "#FF6D01" },
  { channel: "Display", revenue: 19500, roas: 2.10, conversions: 229, color: "#F59E0B" },
];

const importance = [
  { feature: "Spend", value: 32 }, { feature: "Day of Week", value: 18 }, { feature: "CPC", value: 15 },
  { feature: "Seasonality", value: 12 }, { feature: "CVR", value: 10 }, { feature: "Impressions", value: 8 }, { feature: "CTR", value: 5 },
];

const accuracy = [
  { channel: "Organic", accuracy: 94.2 }, { channel: "Google", accuracy: 93.1 }, { channel: "Email", accuracy: 91.8 },
  { channel: "Meta", accuracy: 89.4 }, { channel: "Microsoft", accuracy: 88.7 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Center</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Deep-dive visualizations across all metrics</p>
      </div>

      {/* Revenue Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        <h3 className="font-semibold mb-4">Revenue Trend — 90 Days</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueTrend}>
            <defs>
              <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" interval={14} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} fill="url(#anGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h3 className="font-semibold mb-4">Feature Importance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={importance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} stroke="hsl(215 20% 40%)" width={90} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Forecast Accuracy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h3 className="font-semibold mb-4">Forecast Accuracy by Channel</h3>
          <div className="space-y-4 mt-6">
            {accuracy.map((a, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{a.channel}</span>
                  <span className="font-mono-numbers font-bold text-green-400">{a.accuracy}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[hsl(var(--muted))]">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${a.accuracy}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Channel Performance Table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Channel Performance Summary</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[hsl(var(--border))]">
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Channel</th>
            <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Revenue</th>
            <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">ROAS</th>
            <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Conversions</th>
          </tr></thead>
          <tbody>{channelPerf.map((c, i) => (
            <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))] transition-colors">
              <td className="py-3 px-4 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />{c.channel}</td>
              <td className="py-3 px-4 text-right font-mono-numbers">${c.revenue.toLocaleString()}</td>
              <td className="py-3 px-4 text-right font-mono-numbers">{c.roas > 0 ? `${c.roas}x` : "—"}</td>
              <td className="py-3 px-4 text-right font-mono-numbers">{c.conversions.toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
