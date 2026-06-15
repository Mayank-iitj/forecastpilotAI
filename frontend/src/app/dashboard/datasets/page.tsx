"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { apiFetch, API_BASE } from "@/lib/utils";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, Eye, Trash2, DownloadCloud } from "lucide-react";
import { toast } from "sonner";

const demoValidation = {
  total_rows: 547,
  total_columns: 12,
  quality_score: 94.2,
  missing_values: { cpc: 3, ctr: 1 },
  duplicate_campaigns: 8,
  broken_dates: 2,
  negative_revenue: 0,
  outliers: { spend: 4, revenue: 2 },
  warnings: [
    "Found missing values in 2 columns",
    "Found 8 potential duplicate campaigns",
    "Detected outliers in 2 numeric columns",
  ],
};

const previousDatasets = [
  { id: "ds-001", name: "marketing_q3_2024.csv", rows: 1247, quality: 96.1, date: "Jan 15, 2025", status: "validated" },
  { id: "ds-002", name: "google_ads_dec.csv", rows: 834, quality: 91.8, date: "Jan 10, 2025", status: "validated" },
  { id: "ds-003", name: "multi_channel_nov.csv", rows: 2103, quality: 88.5, date: "Dec 28, 2024", status: "warnings" },
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [viewingDataset, setViewingDataset] = useState<any>(null);
  const [loadingView, setLoadingView] = useState(false);

  const loadDatasets = useCallback(async () => {
    try {
      const data = await apiFetch("/datasets/");
      setDatasets(data);
    } catch (err) {
      console.error("Failed to load datasets:", err);
      toast.error("Failed to load datasets");
    }
  }, []);

  useEffect(() => {
    loadDatasets();

    // Setup WebSocket for realtime updates
    const wsUrl = API_BASE.replace("http", "ws") + "/notifications/ws";
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "dataset_uploaded") {
          toast.success(`New dataset available: ${msg.filename}`);
          loadDatasets();
        }
      } catch(e) {}
    };
    
    return () => ws.close();
  }, [loadDatasets]);

  const handleView = async (id: string) => {
    setLoadingView(true);
    try {
      const data = await apiFetch(`/datasets/${id}`);
      setViewingDataset(data);
    } catch (err) {
      console.error("Failed to load dataset details:", err);
      toast.error("Failed to load dataset details");
    } finally {
      setLoadingView(false);
    }
  };

  const handleDownload = (id: string, filename: string) => {
    window.location.href = `${API_BASE}/datasets/${id}/download`;
    toast.success(`Downloading ${filename}...`);
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dataset Viewer</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">View connected marketing datasets</p>
      </div>



      {/* Explicit Datasets Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Meta Ads Performance", file: "meta_ads_campaign_stats.csv", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z", color: "text-blue-500", bg: "bg-blue-500/10" },
          { name: "Google Ads Campaigns", file: "google_ads_campaign_stats.csv", icon: "M12.545,10.239v3.821h5.445c-0.712,2.315-2.757,3.951-5.445,3.951c-3.131,0-5.674-2.543-5.674-5.674s2.543-5.674,5.674-5.674c1.465,0,2.793,0.56,3.805,1.482l2.842-2.842C17.477,3.582,15.17,2.5,12.545,2.5C7.265,2.5,3,6.765,3,12.045s4.265,9.545,9.545,9.545c5.503,0,9.155-3.874,9.155-9.303c0-0.655-0.076-1.285-0.211-1.888L12.545,10.239z", color: "text-green-500", bg: "bg-green-500/10" },
          { name: "Bing Ads Stats", file: "bing_campaign_stats.csv", icon: "M11.4 24l-7.3-2.3V8.8L11.4 6v18zm1.2-18.4L20 2v21.5l-7.4 2.5V5.6z", color: "text-cyan-500", bg: "bg-cyan-500/10" }
        ].map((source) => {
          const dsInfo = datasets.find(d => d.filename === source.file || d.name === source.file) || {};
          const isLoaded = !!dsInfo.id;
          return (
            <motion.div 
              key={source.file}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${source.bg} flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${source.color}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d={source.icon} />
                    </svg>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isLoaded ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {isLoaded ? 'Validated' : 'Pending'}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{source.name}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  {source.file}
                </p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Total Rows</span>
                    <span className="font-mono-numbers font-medium">{isLoaded ? (dsInfo.row_count || dsInfo.rows).toLocaleString() : '---'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Quality Score</span>
                    <span className={`font-mono-numbers font-medium ${isLoaded && (dsInfo.quality_score || dsInfo.quality) > 90 ? "text-green-400" : ""}`}>
                      {isLoaded ? `${dsInfo.quality_score || dsInfo.quality}%` : '---'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-3 flex justify-end gap-2">
                 <button 
                  onClick={() => isLoaded ? handleView(dsInfo.id) : null} 
                  disabled={!isLoaded || loadingView}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-[hsl(var(--background))] transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button 
                  onClick={() => isLoaded ? handleDownload(dsInfo.id, source.file) : null}
                  disabled={!isLoaded}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-[hsl(var(--background))] transition-colors disabled:opacity-50"
                >
                  <DownloadCloud className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {viewingDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
              <div>
                <h2 className="text-xl font-bold">{viewingDataset.filename || viewingDataset.name}</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Previewing first 10 rows — {viewingDataset.row_count || viewingDataset.rows} total rows
                </p>
              </div>
              <button 
                onClick={() => setViewingDataset(null)}
                className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <XCircle className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto">
              {viewingDataset.preview && viewingDataset.preview.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                        {Object.keys(viewingDataset.preview[0]).map((col) => (
                          <th key={col} className="text-left py-3 px-4 font-medium whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {viewingDataset.preview.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))/50]">
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j} className="py-2.5 px-4 whitespace-nowrap">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                  No preview available.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
