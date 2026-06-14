"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, XCircle, TrendingDown } from "lucide-react";

const riskScores = [
  { label: "Revenue Risk", score: 42, level: "medium", description: "Moderate risk from Meta CPC inflation and CVR decline" },
  { label: "ROAS Risk", score: 55, level: "medium", description: "ROAS trending down on 2 channels — monitor closely" },
  { label: "Channel Risk", score: 68, level: "high", description: "Display and Meta showing fatigue signals" },
  { label: "Forecast Stability", score: 87, level: "low", description: "Forecast variance within acceptable range" },
  { label: "Data Reliability", score: 94, level: "low", description: "Data quality high, minimal missing values" },
];

const channelRisks = [
  { channel: "Google Ads", revenue: "low", roas: "low", stability: "high", color: "#4285F4" },
  { channel: "Meta Ads", revenue: "medium", roas: "high", stability: "medium", color: "#1877F2" },
  { channel: "Microsoft", revenue: "low", roas: "medium", stability: "high", color: "#00A4EF" },
  { channel: "Organic", revenue: "low", roas: "low", stability: "high", color: "#34A853" },
  { channel: "Email", revenue: "low", roas: "low", stability: "high", color: "#9333EA" },
  { channel: "Affiliate", revenue: "low", roas: "low", stability: "medium", color: "#FF6D01" },
  { channel: "Display", revenue: "high", roas: "high", stability: "low", color: "#F59E0B" },
];

const getRiskColor = (level: string) => level === "low" ? "text-green-400 bg-green-500/10" : level === "medium" ? "text-amber-400 bg-amber-500/10" : level === "high" ? "text-red-400 bg-red-500/10" : "text-red-500 bg-red-500/20";
const getBarColor = (score: number) => score <= 40 ? "#22C55E" : score <= 60 ? "#F59E0B" : score <= 80 ? "#EF4444" : "#DC2626";

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Intelligence Engine</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Comprehensive risk scoring and threat analysis</p>
      </div>

      {/* Risk Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {riskScores.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
          >
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-3">{r.label}</div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-3xl font-bold font-mono-numbers" style={{ color: getBarColor(r.score) }}>{r.score}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRiskColor(r.level)}`}>{r.level}</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${r.score}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full" style={{ backgroundColor: getBarColor(r.score) }} />
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">{r.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Risk Heatmap */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Channel Risk Heatmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Channel</th>
                <th className="text-center py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Revenue Risk</th>
                <th className="text-center py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">ROAS Risk</th>
                <th className="text-center py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Stability</th>
              </tr>
            </thead>
            <tbody>
              {channelRisks.map((cr, i) => (
                <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cr.color }} />
                    {cr.channel}
                  </td>
                  <td className="py-3 px-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRiskColor(cr.revenue)}`}>{cr.revenue}</span></td>
                  <td className="py-3 px-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRiskColor(cr.roas)}`}>{cr.roas}</span></td>
                  <td className="py-3 px-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRiskColor(cr.stability === "high" ? "low" : cr.stability === "medium" ? "medium" : "high")}`}>{cr.stability}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
