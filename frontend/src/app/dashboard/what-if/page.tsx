"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const presets = [
  { question: "What if Google Ads spend increases 30%?", params: { google_spend_change: 30 } },
  { question: "What if Meta Ads ROAS drops 15%?", params: { meta_roas_change: -15 } },
  { question: "What if we cut Microsoft Ads budget by 50%?", params: { ms_budget_change: -50 } },
];

export default function WhatIfPage() {
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [customQ, setCustomQ] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [googleBudget, setGoogleBudget] = useState<number>(0);
  const [metaBudget, setMetaBudget] = useState<number>(0);
  const [msBudget, setMsBudget] = useState<number>(0);

  const runSliderScenario = () => {
    let q = "What if ";
    const parts = [];
    if (googleBudget !== 0) parts.push(`Google Ads spend changes by ${googleBudget}%`);
    if (metaBudget !== 0) parts.push(`Meta Ads spend changes by ${metaBudget}%`);
    if (msBudget !== 0) parts.push(`Microsoft Ads spend changes by ${msBudget}%`);
    
    if (parts.length === 0) {
      setError("Please adjust at least one budget slider.");
      return;
    }
    
    q += parts.join(" and ") + "?";
    runScenario(q);
  };

  const runScenario = async (q: string) => {
    setSelectedQ(q);
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const data = await apiFetch("/scenarios/what-if", {
        method: "POST",
        body: JSON.stringify({
          question: q,
          parameters: {}
        }),
      });
      setResult({
        baseRev: data.base_forecast.revenue,
        newRev: data.adjusted_forecast.revenue,
        baseRoas: data.base_forecast.roas,
        newRoas: data.adjusted_forecast.roas,
        explanation: data.explanation
      });
    } catch (err) {
      console.error(err);
      setError("Failed to run scenario. Please make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What-If Engine</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Instantly recompute forecasts based on hypothetical scenarios</p>
      </div>

      {/* Budget Adjustments */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {[
          { name: "Google Ads", val: googleBudget, set: setGoogleBudget, color: "blue" },
          { name: "Meta Ads", val: metaBudget, set: setMetaBudget, color: "indigo" },
          { name: "Microsoft Ads", val: msBudget, set: setMsBudget, color: "cyan" },
        ].map((ch, i) => (
          <div key={i} className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{ch.name} Budget</span>
              <span className={`text-sm font-bold ${ch.val > 0 ? "text-green-500" : ch.val < 0 ? "text-red-500" : "text-gray-400"}`}>
                {ch.val > 0 ? "+" : ""}{ch.val}%
              </span>
            </div>
            <input 
              type="range" 
              min="-100" 
              max="100" 
              step="5"
              value={ch.val}
              onChange={(e) => ch.set(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        ))}
        <div className="sm:col-span-3 flex justify-end">
          <button onClick={runSliderScenario} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> Compute Slider Scenario
          </button>
        </div>
      </div>

      {/* Presets */}
      <h2 className="text-lg font-semibold mt-8 mb-4">Or use Natural Language</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {presets.map((p, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => runScenario(p.question)}
            className={`text-left rounded-xl border p-5 transition-all ${selectedQ === p.question ? "border-blue-500/50 bg-blue-500/5" : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)]"}`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="font-medium text-sm">{p.question}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom Query */}
      <div className="flex gap-3">
        <input value={customQ} onChange={(e) => setCustomQ(e.target.value)} placeholder="Ask a custom what-if question..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        <button onClick={() => customQ && runScenario(customQ)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Compute
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex items-center gap-3 p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 text-blue-400">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Computing AI Forecast...</span>
        </div>
      )}

      {error && (
        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
            <p className="text-sm font-medium mb-2">Scenario: <span className="text-blue-400">{selectedQ}</span></p>
            {result.explanation && (
              <p className="text-sm text-blue-200/80 leading-relaxed border-t border-blue-500/20 pt-3 mt-1">
                {result.explanation}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Base Revenue</div>
              <div className="text-xl font-bold font-mono-numbers mt-1">${result.baseRev.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Adjusted Revenue</div>
              <div className={`text-xl font-bold font-mono-numbers mt-1 ${result.newRev >= result.baseRev ? "text-green-400" : "text-red-400"}`}>${result.newRev.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Revenue Change</div>
              <div className={`text-xl font-bold font-mono-numbers mt-1 flex items-center justify-center gap-1 ${result.newRev >= result.baseRev ? "text-green-400" : "text-red-400"}`}>
                {result.newRev >= result.baseRev ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                ${Math.abs(result.newRev - result.baseRev).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-center">
              <div className="text-xs text-[hsl(var(--muted-foreground))]">ROAS Change</div>
              <div className={`text-xl font-bold font-mono-numbers mt-1 ${result.newRoas >= result.baseRoas ? "text-green-400" : "text-red-400"}`}>{result.newRoas}x</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
