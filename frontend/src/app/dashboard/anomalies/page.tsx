"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, Zap, Eye } from "lucide-react";

const anomalies = [
  { id: 1, type: "spike", title: "Revenue Spike — Google Ads", description: "Google Ads revenue increased 42% above expected value. Possible cause: competitor exit or algorithm change reducing CPCs.", severity: "medium", channel: "Google Ads", metric: "Revenue", impact: "+$3,200", timestamp: "Jan 15, 2025 — 09:15 AM", icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-500/10" },
  { id: 2, type: "drop", title: "Conversion Rate Drop — Meta", description: "Meta conversion rate dropped 18% below baseline. Landing page load time increased from 2.1s to 4.8s on mobile devices.", severity: "high", channel: "Meta Ads", metric: "Conversions", impact: "-$2,400", timestamp: "Jan 14, 2025 — 14:30 PM", icon: TrendingDown, color: "text-red-400", bgColor: "bg-red-500/10" },
  { id: 3, type: "spike", title: "Spend Spike — Microsoft Ads", description: "Microsoft Ads daily spend exceeded budget cap by 35%. Auto-bidding strategy may need adjustment.", severity: "high", channel: "Microsoft Ads", metric: "Spend", impact: "+$890 overspend", timestamp: "Jan 14, 2025 — 11:00 AM", icon: Zap, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  { id: 4, type: "tracking", title: "Tracking Gap Detected", description: "3.2% of conversions missing attribution. GTM container may have deployment issue on checkout pages.", severity: "medium", channel: "All Channels", metric: "Tracking", impact: "~48 unattributed conversions", timestamp: "Jan 13, 2025 — 16:45 PM", icon: AlertTriangle, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  { id: 5, type: "drop", title: "Email CTR Decline", description: "Email click-through rate dropped 22% this week. Subject line A/B test variant B underperforming significantly.", severity: "low", channel: "Email", metric: "CTR", impact: "-$680", timestamp: "Jan 12, 2025 — 10:00 AM", icon: TrendingDown, color: "text-amber-400", bgColor: "bg-amber-500/10" },
];

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Anomaly Detection</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Automated detection of unusual patterns in your marketing data</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">2 High</span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">2 Medium</span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">1 Low</span>
        </div>
      </div>

      <div className="space-y-4">
        {anomalies.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 hover:border-[hsl(var(--primary)/0.3)] transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${a.bgColor} flex items-center justify-center shrink-0`}>
                <a.icon className={`w-5 h-5 ${a.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${a.severity === "high" ? "risk-high" : a.severity === "medium" ? "risk-medium" : "risk-low"}`}>{a.severity}</span>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{a.description}</p>
                <div className="flex items-center gap-6 mt-3 text-xs text-[hsl(var(--muted-foreground))]">
                  <span>Channel: <span className="text-[hsl(var(--foreground))] font-medium">{a.channel}</span></span>
                  <span>Metric: <span className="text-[hsl(var(--foreground))] font-medium">{a.metric}</span></span>
                  <span>Impact: <span className={`font-medium font-mono-numbers ${a.impact.startsWith("+") ? "text-green-400" : a.impact.startsWith("-") ? "text-red-400" : "text-amber-400"}`}>{a.impact}</span></span>
                  <span>{a.timestamp}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
