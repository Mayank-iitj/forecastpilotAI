"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Sparkles, Eye, Clock, FileSpreadsheet, Presentation } from "lucide-react";

const templates = [
  { name: "Executive Summary", icon: FileText, desc: "Board-ready overview with key metrics and insights" },
  { name: "Client Report", icon: FileSpreadsheet, desc: "Client-friendly performance report with recommendations" },
  { name: "Agency Report", icon: Presentation, desc: "Detailed agency report with all channel data" },
  { name: "Board Presentation", icon: Presentation, desc: "Slide-ready data for board meetings" },
];

const reports = [
  { id: "rpt-001", title: "Q3 Executive Summary", type: "Executive", date: "Jan 15, 2025", status: "Generated", pages: 8 },
  { id: "rpt-002", title: "Client Report — Acme Corp", type: "Client", date: "Jan 14, 2025", status: "Generated", pages: 12 },
  { id: "rpt-003", title: "Board Presentation — January", type: "Board", date: "Jan 12, 2025", status: "Generated", pages: 15 },
  { id: "rpt-004", title: "Weekly Forecast Update", type: "Agency", date: "Jan 10, 2025", status: "Generated", pages: 6 },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const generate = () => { setGenerating(true); setTimeout(() => setGenerating(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Executive Reporting</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">One-click AI-generated reports in multiple formats</p>
        </div>
        <div className="flex items-center gap-2">
          {["PDF", "CSV", "Excel", "PPTX"].map((f) => (
            <button key={f} className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-xs font-medium hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> {f}
            </button>
          ))}
        </div>
      </div>

      {/* Template Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((t, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={generate}
            className="text-left rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary)/0.3)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <t.icon className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{t.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-blue-400 font-medium">
              <Sparkles className="w-3 h-3" /> Generate with AI
            </div>
          </motion.button>
        ))}
      </div>

      {generating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6 text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-medium">Generating AI-powered report...</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Analyzing forecasts, risks, and recommendations</p>
        </motion.div>
      )}

      {/* Previous Reports */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Generated Reports</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[hsl(var(--border))]">
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Report</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Type</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Date</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Pages</th>
            <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Actions</th>
          </tr></thead>
          <tbody>{reports.map((r) => (
            <tr key={r.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))] transition-colors">
              <td className="py-3 px-4 font-medium">{r.title}</td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--muted))]">{r.type}</span></td>
              <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{r.date}</td>
              <td className="py-3 px-4 font-mono-numbers">{r.pages}</td>
              <td className="py-3 px-4 text-right flex justify-end gap-2">
                <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Eye className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Download className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
