"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowDown, ArrowUp, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell } from "recharts";

const drivers = [
  { name: "Channel Mix Optimization", contribution: 35, direction: "positive" },
  { name: "Seasonal Demand", contribution: 25, direction: "positive" },
  { name: "Budget Efficiency Gains", contribution: 20, direction: "positive" },
  { name: "CPC Inflation", contribution: -15, direction: "negative" },
  { name: "Conversion Rate Decline", contribution: -10, direction: "negative" },
  { name: "Attribution Shifts", contribution: -5, direction: "negative" },
];

const detectedFactors = [
  { factor: "Seasonality", status: "Detected", impact: "15-20% uplift expected in 2 weeks", severity: "positive", icon: TrendingUp },
  { factor: "Budget Effects", status: "Active", impact: "Diminishing returns on Meta above $12k/month", severity: "warning", icon: AlertTriangle },
  { factor: "Channel Fatigue", status: "Detected", impact: "Meta prospecting frequency: 4.2 (above 3.0 threshold)", severity: "critical", icon: TrendingDown },
  { factor: "Audience Saturation", status: "Moderate", impact: "Google Display remarketing pool declining 8% WoW", severity: "warning", icon: AlertTriangle },
  { factor: "Conversion Decline", status: "Active", impact: "Site-wide CVR down 8%, mobile down 12%", severity: "critical", icon: TrendingDown },
  { factor: "Attribution Shifts", status: "Monitoring", impact: "Cross-channel attribution showing 5% shift to last-click", severity: "info", icon: CheckCircle2 },
];

export default function CausalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Causal Intelligence Layer</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Understand what&apos;s driving your forecast changes</p>
      </div>

      {/* Executive Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6"
      >
        <h3 className="font-semibold flex items-center gap-2 mb-3"><Zap className="w-5 h-5 text-amber-400" /> Executive Summary</h3>
        <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          Revenue is projected to grow by <span className="font-bold text-green-400">+3.2%</span> net, driven by channel mix optimization (+35%) and seasonal demand (+25%), partially offset by CPC inflation (-15%) and conversion rate decline (-10%).
        </p>
        <div className="mt-4 p-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
          <p className="text-sm font-medium mb-2">Recommended Action:</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Shift 12% spend from Meta prospecting to Google Shopping. Expected impact: +$4,200 revenue recovery.</p>
        </div>
      </motion.div>

      {/* Waterfall Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        <h3 className="font-semibold mb-4">Driver Contribution (Waterfall)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={drivers}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" angle={-20} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="contribution" radius={[6, 6, 0, 0]}>
              {drivers.map((d, i) => <Cell key={i} fill={d.direction === "positive" ? "#22C55E" : "#EF4444"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detected Factors */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Detected Causal Factors</h3>
        <div className="space-y-3">
          {detectedFactors.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                f.severity === "positive" ? "bg-green-500/10 text-green-400" :
                f.severity === "critical" ? "bg-red-500/10 text-red-400" :
                f.severity === "warning" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
              }`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{f.factor}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    f.severity === "positive" ? "risk-low" : f.severity === "critical" ? "risk-high" : f.severity === "warning" ? "risk-medium" : "bg-blue-500/10 text-blue-400"
                  }`}>{f.status}</span>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{f.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
