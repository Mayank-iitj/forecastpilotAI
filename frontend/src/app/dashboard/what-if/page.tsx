"use client";
import React, { useState } from "react";
import { apiFetch } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

const presets = [
  { question: "What if Google spend increases 30%?", params: { google_spend_change: 30 } },
  { question: "What if Meta ROAS drops 15%?", params: { meta_roas_change: -15 } },
  { question: "What if conversion rate improves 10%?", params: { conversion_rate_change: 10 } },
  { question: "What if we cut Display budget by 50%?", params: { display_budget_change: -50 } },
];

export default function WhatIfPage() {
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [customQ, setCustomQ] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
