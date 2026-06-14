"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Key, FileText, Clock, Settings, Plus, MoreVertical } from "lucide-react";

const users = [
  { name: "Alex Morgan", email: "alex@forecastpilot.ai", role: "Admin", status: "Active", lastActive: "2 min ago" },
  { name: "Sarah Chen", email: "sarah@forecastpilot.ai", role: "Manager", status: "Active", lastActive: "15 min ago" },
  { name: "James Wilson", email: "james@forecastpilot.ai", role: "Analyst", status: "Active", lastActive: "1 hour ago" },
  { name: "Emily Davis", email: "emily@forecastpilot.ai", role: "Viewer", status: "Invited", lastActive: "—" },
];

const auditLogs = [
  { user: "Alex Morgan", action: "Generated forecast", resource: "Q3 Revenue Forecast", time: "2 min ago" },
  { user: "Sarah Chen", action: "Uploaded dataset", resource: "marketing_jan.csv", time: "15 min ago" },
  { user: "James Wilson", action: "Ran simulation", resource: "Aggressive Growth", time: "1 hour ago" },
  { user: "Alex Morgan", action: "Generated report", resource: "Executive Summary", time: "3 hours ago" },
  { user: "Sarah Chen", action: "Updated budget", resource: "Q3 Budget Plan", time: "5 hours ago" },
];

const apiKeys = [
  { name: "Production API", prefix: "fp_live_****8a3f", created: "Dec 1, 2024", lastUsed: "2 min ago", status: "Active" },
  { name: "Development API", prefix: "fp_test_****2b7c", created: "Nov 15, 2024", lastUsed: "3 days ago", status: "Active" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Manage users, workspaces, and system settings</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "4", icon: Users },
          { label: "Active Sessions", value: "3", icon: Shield },
          { label: "API Keys", value: "2", icon: Key },
          { label: "Datasets", value: "7", icon: FileText },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.label}</div>
                <div className="text-2xl font-bold font-mono-numbers mt-1">{s.value}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center">
                <s.icon className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4">Team Members</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[hsl(var(--border))]">
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">User</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Role</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
            <th className="text-left py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Last Active</th>
            <th className="text-right py-3 px-4 text-[hsl(var(--muted-foreground))] font-medium">Actions</th>
          </tr></thead>
          <tbody>{users.map((u, i) => (
            <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--accent))] transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--muted))] font-medium">{u.role}</span></td>
              <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "Active" ? "risk-low" : "risk-medium"}`}>{u.status}</span></td>
              <td className="py-3 px-4 text-[hsl(var(--muted-foreground))]">{u.lastActive}</td>
              <td className="py-3 px-4 text-right"><button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><MoreVertical className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Audit Log */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Audit Log</h3>
        <div className="space-y-3">
          {auditLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-2 text-sm">
              <span className="text-[hsl(var(--muted-foreground))] w-24 shrink-0 text-xs">{log.time}</span>
              <span className="font-medium">{log.user}</span>
              <span className="text-[hsl(var(--muted-foreground))]">{log.action}</span>
              <span className="text-blue-400">{log.resource}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4" /> API Keys</h3>
          <button className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-xs font-medium hover:bg-[hsl(var(--accent))] transition-colors">+ Create Key</button>
        </div>
        {apiKeys.map((k, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[hsl(var(--border))] last:border-0">
            <div><div className="text-sm font-medium">{k.name}</div><div className="text-xs text-[hsl(var(--muted-foreground))] font-mono-numbers">{k.prefix}</div></div>
            <div className="text-right"><div className="text-xs text-[hsl(var(--muted-foreground))]">Last used: {k.lastUsed}</div><span className="px-2 py-0.5 rounded-full text-xs risk-low font-medium">{k.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
