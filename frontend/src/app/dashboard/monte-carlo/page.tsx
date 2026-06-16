"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/utils";
import { motion } from "framer-motion";
import { Dice5, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function MonteCarloPage() {
  const [simCount, setSimCount] = useState(5000);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState<any>(null);

  const run = async () => { 
    setRunning(true); 
    
    // Fallback timeout to un-freeze UI if fetch hangs
    const timeoutId = setTimeout(() => setRunning(false), 15000);

    try {
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await apiFetch("/scenarios/monte-carlo", {
        method: "POST",
        body: JSON.stringify({ num_simulations: simCount, base_revenue: 153000, base_roas: 5.24, forecast_days: 30 }),
        signal: controller.signal
      });
      clearTimeout(fetchTimeout);
      setData(res);
      setComplete(true);
    } catch (e) {
      console.error("Monte Carlo Error:", e);
      alert("Failed to run simulation. Please check backend logs or try again.");
    } finally {
      clearTimeout(timeoutId);
      setRunning(false); 
    }
  };

  useEffect(() => {
    run();
  }, []);

  const revDist = data?.revenue?.histogram?.bins ? data.revenue.histogram.bins.map((val: number, i: number) => ({ value: val, density: data.revenue.histogram.density[i] })) : [];
  const roasDist = data?.roas?.histogram?.bins ? data.roas.histogram.bins.map((val: number, i: number) => ({ value: val, density: data.roas.histogram.density[i] })) : [];
  
  const fanData = data?.fan_chart?.p50 ? data.fan_chart.p50.map((_: any, i: number) => ({
    day: `Day ${i + 1}`,
    p10: data.fan_chart.p10[i],
    p25: data.fan_chart.p25[i],
    p50: data.fan_chart.p50[i],
    p75: data.fan_chart.p75[i],
    p90: data.fan_chart.p90[i],
  })) : [];

  const percentiles = data?.revenue?.percentiles ? [
    { label: "P5", revenue: `$${(data.revenue.percentiles.p5 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p5 || 0}x` },
    { label: "P10", revenue: `$${(data.revenue.percentiles.p10 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p10 || 0}x` },
    { label: "P25", revenue: `$${(data.revenue.percentiles.p25 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p25 || 0}x` },
    { label: "P50", revenue: `$${(data.revenue.percentiles.p50 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p50 || 0}x` },
    { label: "P75", revenue: `$${(data.revenue.percentiles.p75 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p75 || 0}x` },
    { label: "P90", revenue: `$${(data.revenue.percentiles.p90 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p90 || 0}x` },
    { label: "P95", revenue: `$${(data.revenue.percentiles.p95 || 0).toLocaleString()}`, roas: `${data.roas?.percentiles?.p95 || 0}x` },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monte Carlo Simulation Engine</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Quantify uncertainty with probability distributions</p>
        </div>
        <div className="flex items-center gap-3">
          {[1000, 5000, 10000].map((n) => (
            <button key={n} onClick={() => setSimCount(n)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${simCount === n ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)]" : "border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"}`}
            >
              {(n / 1000).toFixed(0)}K
            </button>
          ))}
          <button onClick={run} disabled={running}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {running ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? "Running..." : "Run Simulation"}
          </button>
        </div>
      </div>

      {(complete && data) && (
        <>
          {/* Probability Stats */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">P(Revenue &gt; 90% Target)</div>
              <div className="text-3xl font-bold font-mono-numbers text-green-400 mt-2">{data.probabilities.above_90pct_target}%</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">P(Revenue &gt; 110% Target)</div>
              <div className="text-3xl font-bold font-mono-numbers text-blue-400 mt-2">{data.probabilities.above_110pct_target}%</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">P(Revenue &lt; 80% Target)</div>
              <div className="text-3xl font-bold font-mono-numbers text-red-400 mt-2">{data.probabilities.below_80pct_target}%</div>
            </motion.div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              <h3 className="font-semibold mb-4">Revenue Distribution (Bell Curve)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revDist}>
                  <defs>
                    <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
                  <XAxis dataKey="value" tick={{ fontSize: 9 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} interval={8} />
                  <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 20% 40%)" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="density" stroke="#3B82F6" strokeWidth={2} fill="url(#bellGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
            >
              <h3 className="font-semibold mb-4">ROAS Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roasDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
                  <XAxis dataKey="value" tick={{ fontSize: 9 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `${v.toFixed(1)}x`} interval={8} />
                  <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 20% 40%)" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="density" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Fan Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
          >
            <h3 className="font-semibold mb-4">Fan Chart — Revenue Confidence Bands</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fanData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 27% 17%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" interval={4} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 20% 40%)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(215 27% 17%)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="p90" stroke="transparent" fill="#3B82F6" fillOpacity={0.08} />
                <Area type="monotone" dataKey="p75" stroke="transparent" fill="#3B82F6" fillOpacity={0.12} />
                <Area type="monotone" dataKey="p50" stroke="#3B82F6" strokeWidth={2.5} fill="transparent" />
                <Area type="monotone" dataKey="p25" stroke="transparent" fill="transparent" />
                <Area type="monotone" dataKey="p10" stroke="transparent" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Percentile Table */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="font-semibold mb-4">Risk Percentiles</h3>
            <div className="grid grid-cols-7 gap-3">
              {percentiles.map((p, i) => (
                <div key={i} className={`text-center p-3 rounded-lg ${p.label === "P50" ? "bg-blue-500/10 border border-blue-500/30" : "bg-[hsl(var(--muted))]"}`}>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{p.label}</div>
                  <div className="text-sm font-bold font-mono-numbers mt-1">{p.revenue}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] font-mono-numbers mt-0.5">{p.roas}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
