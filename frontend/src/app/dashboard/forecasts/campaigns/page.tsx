"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const campaigns = [
  { name: "Shopping", revenue: 42840, roas: [4.9, 5.6], contribution: 28, confidence: 89.1, trend: "up", change: "+4.2%" },
  { name: "Search", revenue: 33660, roas: [3.8, 4.4], contribution: 22, confidence: 87.3, trend: "up", change: "+2.8%" },
  { name: "PMAX", revenue: 27540, roas: [3.5, 4.2], contribution: 18, confidence: 84.5, trend: "up", change: "+6.1%" },
  { name: "Retargeting", revenue: 15300, roas: [6.5, 7.8], contribution: 10, confidence: 91.2, trend: "up", change: "+1.5%" },
  { name: "Display", revenue: 12240, roas: [1.5, 2.1], contribution: 8, confidence: 78.9, trend: "down", change: "-3.2%" },
  { name: "Video", revenue: 9180, roas: [2.0, 2.6], contribution: 6, confidence: 82.1, trend: "up", change: "+5.4%" },
  { name: "Prospecting", revenue: 7650, roas: [1.8, 2.3], contribution: 5, confidence: 76.8, trend: "down", change: "-1.8%" },
  { name: "Brand", revenue: 4590, roas: [11.5, 13.5], contribution: 3, confidence: 93.4, trend: "up", change: "+0.9%" },
];

export default function CampaignForecastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campaign Type Forecasting</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Performance forecasts by campaign type</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaigns.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary)/0.3)] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{c.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.confidence > 85 ? "risk-low" : c.confidence > 75 ? "risk-medium" : "risk-high"}`}>
                {c.confidence}%
              </span>
            </div>
            <div className="text-2xl font-bold font-mono-numbers mb-1">${(c.revenue / 1000).toFixed(1)}k</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">ROAS: <span className="font-mono-numbers font-medium text-[hsl(var(--foreground))]">{c.roas[0]}x - {c.roas[1]}x</span></span>
              <div className={`flex items-center gap-1 text-xs font-medium ${c.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {c.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {c.change}
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[hsl(var(--muted))]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${c.contribution * 3.5}%` }} />
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{c.contribution}% contribution</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
