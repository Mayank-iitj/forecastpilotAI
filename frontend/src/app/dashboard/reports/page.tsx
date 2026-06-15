"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Sparkles, Eye, Clock, FileSpreadsheet, Presentation, X } from "lucide-react";

const templates = [
  { name: "Executive Summary", icon: FileText, desc: "Board-ready overview with key metrics and insights" },
  { name: "Client Report", icon: FileSpreadsheet, desc: "Client-friendly performance report with recommendations" },
  { name: "Agency Report", icon: Presentation, desc: "Detailed agency report with all channel data" },
  { name: "Board Presentation", icon: Presentation, desc: "Slide-ready data for board meetings" },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch("http://localhost:8000/api/v1/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  const generate = async (type: string) => {
    setGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        await fetchReports();
      }
    } catch (error) {
      console.error("Failed to generate report", error);
    }
    setGenerating(false);
  };

  const viewReport = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedReport(data);
      }
    } catch (error) {
      console.error("Failed to view report", error);
    }
  };

  const downloadReport = (id: string) => {
    window.open(`http://localhost:8000/api/v1/reports/${id}/download`, "_blank");
  };

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
            onClick={() => generate(t.name)}
            disabled={generating}
            className="text-left rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary)/0.3)] transition-all group disabled:opacity-50"
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
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Analyzing forecasts, risks, and recommendations using Groq AI</p>
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
              <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-4 font-mono-numbers">{r.pages}</td>
              <td className="py-3 px-4 text-right flex justify-end gap-2">
                <button onClick={() => viewReport(r.id)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Eye className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                <button onClick={() => downloadReport(r.id)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Download className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
              </td>
            </tr>
          ))}
          {reports.length === 0 && !generating && (
            <tr><td colSpan={5} className="py-4 text-center text-[hsl(var(--muted-foreground))]">No reports found. Generate one above!</td></tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Report View Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))] sticky top-0 bg-[hsl(var(--background))]">
                <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <div className="p-4 bg-[hsl(var(--muted))] rounded-lg whitespace-pre-wrap leading-relaxed text-[hsl(var(--foreground))]">
                    {selectedReport.content?.summary || "No summary available."}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Metrics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedReport.content?.key_metrics && Object.entries(selectedReport.content.key_metrics).map(([key, val]: any) => (
                      <div key={key} className="p-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg">
                        <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">{key}</div>
                        <div className="font-mono text-lg font-bold">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 sticky bottom-0 bg-[hsl(var(--background))]">
                <button onClick={() => downloadReport(selectedReport.id)} className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <Download className="w-4 h-4" /> Download CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

