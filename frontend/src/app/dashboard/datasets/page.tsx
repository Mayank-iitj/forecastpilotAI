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



      {/* Available Datasets */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Available Source Datasets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">File</th>
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Rows</th>
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Quality</th>
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Date</th>
                <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds) => (
                <tr key={ds.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-green-400" />{ds.filename || ds.name}</td>
                  <td className="py-3 px-4 font-mono-numbers">{(ds.row_count || ds.rows || 0).toLocaleString()}</td>
                  <td className="py-3 px-4"><span className={`font-mono-numbers ${(ds.quality_score || ds.quality || 0) > 90 ? "text-green-400" : "text-amber-400"}`}>{(ds.quality_score || ds.quality || 0)}%</span></td>
                  <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{ds.date || "Today"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ds.status === "validated" ? "risk-low" : "risk-medium"}`}>
                      {ds.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(ds.id)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-50" disabled={loadingView} title="View Data"><Eye className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                      <button onClick={() => handleDownload(ds.id, ds.filename || ds.name)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors" title="Download CSV"><DownloadCloud className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors" title="Delete Dataset"><Trash2 className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
