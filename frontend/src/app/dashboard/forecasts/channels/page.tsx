"use client";
import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell, PieChart, Pie } from "recharts";

const channels = [
  { name: "Google Ads", revenue: 45000, roas: 4.22, spend: 10667, conversions: 529, contribution: 29.4, color: "#4285F4" },
  { name: "Meta Ads", revenue: 38000, roas: 3.80, spend: 10000, conversions: 447, contribution: 24.8, color: "#1877F2" },
  { name: "Organic", revenue: 28000, roas: 0, spend: 0, conversions: 329, contribution: 18.3, color: "#34A853" },
  { name: "Email", revenue: 15000, roas: 42.0, spend: 357, conversions: 176, contribution: 9.8, color: "#9333EA" },
  { name: "Microsoft", revenue: 12000, roas: 3.50, spend: 3429, conversions: 141, contribution: 7.8, color: "#00A4EF" },
  { name: "Affiliate", revenue: 8500, roas: 5.10, spend: 1667, conversions: 100, contribution: 5.6, color: "#FF6D01" },
  { name: "Display", revenue: 6500, roas: 2.10, spend: 3095, conversions: 76, contribution: 4.2, color: "#F59E0B" },
];

export default function ChannelForecastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Channel-Level Forecasting</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Per-channel revenue, ROAS, and contribution analysis</p>
      </div>
      {/* Channel Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="font-semibold mb-4">Revenue by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channels} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(215 20% 40%)" width={90} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {channels.map((ch, i) => <Cell key={i} fill={ch.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h3 className="font-semibold mb-4">Contribution %</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={channels} dataKey="contribution" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {channels.map((ch, i) => <Cell key={i} fill={ch.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => [`${v}%`, "Contribution"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      {/* Channel Table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Channel Forecast Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Channel</th>
              <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Revenue</th>
              <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">ROAS</th>
              <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Spend</th>
              <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Conversions</th>
              <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Contribution</th>
            </tr></thead>
            <tbody>{channels.map((ch, i) => (
              <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))] transition-colors">
                <td className="py-3 px-4 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />{ch.name}</td>
                <td className="py-3 px-4 text-right font-mono-numbers">${ch.revenue.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-mono-numbers">{ch.roas > 0 ? `${ch.roas}x` : "—"}</td>
                <td className="py-3 px-4 text-right font-mono-numbers">${ch.spend.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-mono-numbers">{ch.conversions.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-mono-numbers">{ch.contribution}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
