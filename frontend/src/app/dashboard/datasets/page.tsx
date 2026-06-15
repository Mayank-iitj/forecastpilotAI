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
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [viewingDataset, setViewingDataset] = useState<any>(null);
  const [loadingView, setLoadingView] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const processUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Only CSV files are supported");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiFetch("/datasets/upload", {
        method: "POST",
        body: formData,
      });
      setUploaded(true);
      toast.success("Dataset uploaded successfully!");
      loadDatasets();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUpload(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dataset Upload Center</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Upload, validate, and manage your marketing datasets</p>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-blue-500 bg-blue-500/5"
            : "border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
        {uploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="font-medium">Validating dataset...</p>
            <div className="max-w-xs mx-auto h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div>
              <p className="font-medium">Drag & drop your CSV file here</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">or click to browse — Supports CSV up to 50MB</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Validation Results */}
      {uploaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quality Score */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center">
              <div className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Data Quality Score</div>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(215 27% 17%)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="8" strokeDasharray={`${94.2 * 2.51} ${251 - 94.2 * 2.51}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono-numbers text-green-400">{demoValidation.quality_score}%</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Total Rows</div>
              <div className="text-2xl font-bold font-mono-numbers">{demoValidation.total_rows.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">✓ All rows valid</div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Columns</div>
              <div className="text-2xl font-bold font-mono-numbers">{demoValidation.total_columns}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">date, channel, spend, revenue...</div>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Issues Found</div>
              <div className="text-2xl font-bold font-mono-numbers text-amber-400">{demoValidation.warnings.length}</div>
              <div className="text-xs text-amber-400 mt-1">Non-critical warnings</div>
            </div>
          </div>

          {/* Validation Details */}
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h3 className="font-semibold mb-4">Validation Results</h3>
            <div className="space-y-3">
              {[
                { label: "Missing Values", value: `${Object.values(demoValidation.missing_values).reduce((a, b) => a + b, 0)} cells in ${Object.keys(demoValidation.missing_values).length} columns`, status: "warning" },
                { label: "Duplicate Campaigns", value: `${demoValidation.duplicate_campaigns} duplicates found`, status: "warning" },
                { label: "Broken Dates", value: `${demoValidation.broken_dates} invalid date formats`, status: "warning" },
                { label: "Negative Revenue", value: "0 rows — All clean", status: "success" },
                { label: "Outlier Detection", value: `${Object.values(demoValidation.outliers).reduce((a, b) => a + b, 0)} outliers in ${Object.keys(demoValidation.outliers).length} columns`, status: "warning" },
                { label: "Channel Consistency", value: "All channel names consistent", status: "success" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-[hsl(var(--muted))]">
                  <div className="flex items-center gap-3">
                    {item.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={`text-sm ${item.status === "success" ? "text-green-400" : "text-amber-400"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Previous Datasets */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Previous Datasets</h3>
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
