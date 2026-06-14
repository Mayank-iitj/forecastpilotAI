"use client";
import React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-24 pb-8 px-6 border-t border-white/5 bg-[#0B0B0F]/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6">
              <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              ForecastPilot AI
            </div>
            <p className="text-[#8B8B9E] max-w-sm mb-6">
              The intelligent Marketing CFO for modern growth teams. Forecast revenue, allocate budget, and eliminate wasted ad spend.
            </p>
            <div className="text-sm font-medium text-[#8B8B9E]">Built for performance. 📈</div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Product</h4>
            <div className="flex flex-col gap-4 text-[#8B8B9E]">
              <Link href="/product" className="hover:text-white transition-colors">Overview</Link>
              <Link href="/features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Log In</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Get Updates</h4>
            <p className="text-[#8B8B9E] text-sm mb-4">Subscribe for tips on marketing forecasting and AI.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter Your Email..." 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
              <button className="w-full px-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8B8B9E]">
          <div>© 2026 ForecastPilot AI. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
