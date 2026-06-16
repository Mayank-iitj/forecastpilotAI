"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Sparkles, Eye, FileSpreadsheet, Presentation, X } from "lucide-react";
import { toast } from "sonner";

const templates = [
  { name: "Executive Summary", icon: FileText, desc: "Board-ready overview with key metrics and insights" },
  { name: "Client Report", icon: FileSpreadsheet, desc: "Client-friendly performance report with recommendations" },
  { name: "Agency Report", icon: Presentation, desc: "Detailed agency report with all channel data" },
  { name: "Board Presentation", icon: Presentation, desc: "Slide-ready data for board meetings" },
];

const mockReports = [
  {
    id: "rep-001",
    title: "Meta Ads Performance Q3",
    type: "Executive Summary",
    created_at: "2026-06-15T10:00:00Z",
    pages: 4,
    content: {
      summary: "Meta Ads showed a strong performance in Q3, driven largely by Dynamic Product Ads. The Return on Ad Spend (ROAS) reached 3.2x, surpassing our quarterly target. Cost per Acquisition (CPA) decreased by 15% following the introduction of lookalike audiences in the EU market.",
      key_metrics: { Spend: "$10,290.50", Revenue: "$32,850.00", Conversions: "1,000", ROAS: "3.19x" }
    }
  },
  {
    id: "rep-002",
    title: "Google Ads Campaigns Analysis",
    type: "Client Report",
    created_at: "2026-06-14T14:30:00Z",
    pages: 6,
    content: {
      summary: "Google Ads search campaigns generated consistent high-intent traffic. Performance Max campaigns were the highest contributor to revenue, albeit at a slightly higher CPA. Brand campaigns maintained a very low CPC and high conversion rate.",
      key_metrics: { Spend: "$16,900.00", Revenue: "$53,600.00", Conversions: "1,835", ROAS: "3.17x" }
    }
  },
  {
    id: "rep-003",
    title: "Bing Ads Stats Overview",
    type: "Agency Report",
    created_at: "2026-06-13T09:15:00Z",
    pages: 3,
    content: {
      summary: "Bing Ads continues to provide an older but highly affluent demographic. Shopping campaigns on Desktop yielded the best results. The overall volume is lower than Google, but the competition is also lower, resulting in a healthy ROAS.",
      key_metrics: { Spend: "$5,600.00", Revenue: "$23,300.00", Conversions: "850", ROAS: "4.16x" }
    }
  },
  {
    id: "rep-004",
    title: "Omnichannel Q3 Board Presentation",
    type: "Board Presentation",
    created_at: "2026-06-12T16:45:00Z",
    pages: 12,
    content: {
      summary: "This presentation aggregates data across Meta, Google, and Bing to provide a holistic view of Q3 performance. Total advertising spend was $32,790, resulting in $109,750 in attributed revenue. We recommend scaling Performance Max and exploring TikTok ads in Q4.",
      key_metrics: { "Total Spend": "$32,790", "Total Revenue": "$109,750", "Blended ROAS": "3.35x", "New Customers": "2,410" }
    }
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>(mockReports);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const generate = async (type: string) => {
    setGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const newReport = {
        id: `rep-new-${Date.now()}`,
        title: `Generated ${type} - ${new Date().toLocaleDateString()}`,
        type: type,
        created_at: new Date().toISOString(),
        pages: Math.floor(Math.random() * 5) + 2,
        content: {
          summary: `This is a freshly generated ${type} based on real-time data inputs from Meta, Google, and Bing. It incorporates the latest predictive modeling to project Q4 revenue based on Q3 run rates.`,
          key_metrics: { "Projected Revenue": "$145,000", "Est. Spend": "$40,000", "Target ROAS": "3.6x", "Confidence": "92%" }
        }
      };
      setReports([newReport, ...reports]);
      setGenerating(false);
      toast.success(`${type} generated successfully!`);
    }, 2000);
  };

  const viewReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setSelectedReport(report);
    }
  };

  const downloadReport = (report: any) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + Object.entries(report.content?.key_metrics || {}).map(([k, v]) => `${k},"${v}"`).join("\n")
      + `\n\nSummary\n"${report.content?.summary || ''}"`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${report.title}`);
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
            <button key={f} onClick={() => toast.info(`${f} global export coming soon!`)} className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-xs font-medium hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-1">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6 text-center shadow-inner">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-medium">Generating AI-powered report...</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Analyzing forecasts, risks, and recommendations across datasets</p>
        </motion.div>
      )}

      {/* Previous Reports */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Generated Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-semibold">Report</th>
                <th className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-semibold">Type</th>
                <th className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-semibold">Date</th>
                <th className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-semibold">Pages</th>
                <th className="py-3 px-4 text-[hsl(var(--muted-foreground))] font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))/50] transition-colors">
                  <td className="py-3 px-4 font-medium text-[hsl(var(--foreground))]">{r.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-mono-numbers">{r.pages}</td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    <button onClick={() => viewReport(r.id)} className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => downloadReport(r)} className="p-2 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] transition-colors border border-[hsl(var(--border))]">
                      <Download className="w-4 h-4 text-[hsl(var(--foreground))]" />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && !generating && (
                <tr><td colSpan={5} className="py-8 text-center text-[hsl(var(--muted-foreground))]">No reports found. Generate one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report View Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] shrink-0">
                <div>
                  <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">{selectedReport.type}</span>
                    &bull; Generated on {new Date(selectedReport.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-[hsl(var(--accent))] rounded-full transition-colors">
                  <X className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
              
              <div className="p-6 space-y-8 overflow-y-auto flex-1">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[hsl(var(--primary))]" /> Executive Summary
                  </h3>
                  <div className="p-5 bg-[hsl(var(--muted)/0.5)] rounded-xl whitespace-pre-wrap leading-relaxed text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                    {selectedReport.content?.summary || "No summary available."}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" /> Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedReport.content?.key_metrics && Object.entries(selectedReport.content.key_metrics).map(([key, val]: any) => (
                      <div key={key} className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-sm hover:border-[hsl(var(--primary)/0.3)] transition-colors">
                        <div className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1 font-semibold">{key}</div>
                        <div className="font-mono text-xl font-bold">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] flex justify-between items-center shrink-0">
                <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">{selectedReport.pages} Pages included in full report</span>
                <button onClick={() => downloadReport(selectedReport)} className="px-6 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
