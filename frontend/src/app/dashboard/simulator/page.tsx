"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shuffle, DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const baseChannels = [
  { name: "Google Ads", key: "google_ads", base: 35, color: "#4285F4" },
  { name: "Meta Ads", key: "meta_ads", base: 33, color: "#1877F2" },
  { name: "Microsoft Ads", key: "microsoft_ads", base: 12, color: "#00A4EF" },
  { name: "Email", key: "email", base: 5, color: "#9333EA" },
  { name: "Affiliate", key: "affiliate", base: 8, color: "#FF6D01" },
  { name: "Display", key: "display", base: 7, color: "#F59E0B" },
];

export default function SimulatorPage() {
  const [budget, setBudget] = useState(30000);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    Object.fromEntries(baseChannels.map((c) => [c.key, c.base]))
  );
  const [result, setResult] = useState<null | { revenue: number; roas: number; incremental: number; risk: string }>(null);

  const handleSlider = (key: string, value: number) => {
    setAllocations((prev) => ({ ...prev, [key]: value }));
  };

  const [running, setRunning] = useState(false);

  const runSimulation = async () => {
    setRunning(true);
    try {
      const budget_adjustments: Record<string, number> = {};
      baseChannels.forEach(c => {
        const diff = allocations[c.key] - c.base;
        if (diff !== 0) {
          budget_adjustments[c.key] = diff * (budget / 100);
        }
      });
      
      const data = await apiFetch("/scenarios/simulate", {
         method: "POST",
         body: JSON.stringify({ name: "Manual Simulation", budget_adjustments, total_budget: budget })
      });
      
      setResult({
        revenue: data.comparison.scenario_revenue,
        roas: Math.round(data.comparison.scenario_roas * 100) / 100,
        incremental: data.comparison.incremental_revenue,
        risk: data.risk_level
      });
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget Scenario Simulator</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Adjust allocations and simulate outcomes</p>
        </div>
        <button onClick={runSimulation} disabled={running} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50">
          {running ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shuffle className="w-4 h-4" />} 
          {running ? "Simulating..." : "Run Simulation"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Controls */}
        <div className="lg:col-span-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Total Budget</label>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold font-mono-numbers">${budget.toLocaleString()}</span>
              <input type="range" min={10000} max={100000} step={1000} value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-[hsl(var(--muted))] accent-blue-500" />
            </div>
          </div>
          <h3 className="font-semibold mb-4">Channel Allocation (%)</h3>
          <div className="space-y-5">
            {baseChannels.map((ch) => (
              <div key={ch.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-sm font-medium">{ch.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono-numbers font-bold">{allocations[ch.key]}%</span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">(${Math.round(budget * allocations[ch.key] / 100).toLocaleString()})</span>
                  </div>
                </div>
                <input type="range" min={0} max={60} value={allocations[ch.key]} onChange={(e) => handleSlider(ch.key, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-[hsl(var(--muted))]" style={{ accentColor: ch.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Expected Revenue</div>
                <div className="text-3xl font-bold font-mono-numbers">${result.revenue.toLocaleString()}</div>
                <div className={`text-sm mt-1 ${result.incremental >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {result.incremental >= 0 ? "+" : ""}{result.incremental.toLocaleString()} incremental
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Expected ROAS</div>
                <div className="text-3xl font-bold font-mono-numbers">{result.roas}x</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Risk Level</div>
                <div className={`text-xl font-bold capitalize ${result.risk === "low" ? "text-green-400" : result.risk === "medium" ? "text-amber-400" : "text-red-400"}`}>
                  {result.risk}
                </div>
              </motion.div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
              <Shuffle className="w-8 h-8 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Adjust allocations and click Run Simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
