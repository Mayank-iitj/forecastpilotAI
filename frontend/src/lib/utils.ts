import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact?: boolean): string {
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function apiFetch(path: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const CHANNEL_COLORS: Record<string, string> = {
  google_ads: "#4285F4",
  meta_ads: "#1877F2",
  microsoft_ads: "#00A4EF",
  organic_search: "#34A853",
  affiliate: "#FF6D01",
  email: "#9333EA",
  display: "#F59E0B",
};

export const CHANNEL_NAMES: Record<string, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  microsoft_ads: "Microsoft Ads",
  organic_search: "Organic Search",
  affiliate: "Affiliate",
  email: "Email",
  display: "Display",
};
