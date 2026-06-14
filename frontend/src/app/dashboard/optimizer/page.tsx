"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { motion } from "framer-motion";
import { Target, Sparkles, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const channels = [
  { name: "Google Ads", key: "google_ads", color: "#4285F4" },
  { name: "Meta Ads", key: "meta_ads", color: "#1877F2" },
  { name: "Microsoft Ads", key: "microsoft_ads", color: "#00A4EF" },
  { name: "Email", key: "email", color: "#9333EA" },
  { name: "Affiliate", key: "affiliate", color: "#FF6D01" },
  { name: "Display", key: "display", color: "#F59E0B" },
];



export default function OptimizerPage() {
  const [budget, setBudget] = useState(30000);
  const [targetRevenue, setTargetRevenue] = useState("");
  const [targetRoas, setTargetRoas] = useState("");
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const optimize = async () => { 
    setLoading(true); 
    try {
      const data = await apiFetch("/scenarios/optimize", {
        method: "POST",
        body: JSON.stringify({ 
           total_budget: budget, 
           target_revenue: targetRevenue ? Number(targetRevenue) : null,
           target_roas: targetRoas ? Number(targetRoas) : null 
        })
      });

      const allocArray = channels.map(ch => {
        const item = data.allocation[ch.key];
        return {
          name: ch.name,
          color: ch.color,
          budget: item ? item.allocated_budget : 0,
          pct: item ? item.allocation_pct : 0,
          revenue: item ? item.expected_revenue : 0,
          roas: item ? item.expected_roas : 0
        };
      }).filter(ch => ch.budget > 0);

      setResult({
        total_budget: data.total_budget,
        expected_revenue: data.expected_revenue,
        expected_roas: data.expected_roas,
        confidence_score: data.confidence_score,
        allocation: allocArray,
        reasoning: data.reasoning
      });
      setOptimized(true);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Budget Optimizer</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Find the optimal budget allocation to maximize revenue and ROAS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-5">
          <h3 className="font-semibold">Optimization Parameters</h3>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Available Budget</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target Revenue (optional)</label>
            <input type="number" value={targetRevenue} onChange={(e) => setTargetRevenue(e.target.value)} placeholder="e.g. 150000"
              className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Target ROAS (optional)</label>
            <input type="number" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value)} placeholder="e.g. 5.0" step="0.1"
              className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <button onClick={optimize} disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Optimizing..." : "Run Optimization"}
          </button>
        </div>

        {/* Results */}
        {optimized ? (
          <div className="lg:col-span-2 space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Expected Revenue</div>
                <div className="text-2xl font-bold font-mono-numbers text-green-400 mt-1">${result.expected_revenue.toLocaleString()}</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Expected ROAS</div>
                <div className="text-2xl font-bold font-mono-numbers text-blue-400 mt-1">{result.expected_roas}x</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Confidence</div>
                <div className="text-2xl font-bold font-mono-numbers text-purple-400 mt-1">{result.confidence_score}%</div>
              </motion.div>
            </div>

            {/* Allocation Chart + Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h3 className="font-semibold mb-4">Optimal Allocation</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={result.allocation} dataKey="pct" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}>
                      {result.allocation.map((a: any, i: number) => <Cell key={i} fill={a.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h3 className="font-semibold mb-4">Channel Breakdown</h3>
                <div className="space-y-3">
                  {result.allocation.map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                        <span>{a.name}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono-numbers">
                        <span className="text-[hsl(var(--muted-foreground))]">${a.budget.toLocaleString()}</span>
                        <span className="font-medium">{a.roas}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> AI Reasoning</h3>
              <div className="space-y-2">
                {result.reasoning.map((r: string, i: number) => (
                  <div key={i} className="flex gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                    <span className="text-blue-400 font-mono-numbers shrink-0">{i + 1}.</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-center p-16">
            <div className="text-center">
              <Target className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Set your parameters and run optimization</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">The AI will find the optimal budget allocation across all channels</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
