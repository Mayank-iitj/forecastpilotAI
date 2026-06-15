import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EvilEye from "@/components/EvilEye";
import { BrainCircuit, Activity, Database, LineChart } from "lucide-react";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-violet-500/30 font-sans overflow-hidden relative">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen w-full h-full">
        <EvilEye 
          eyeColor="#8B5CF6" 
          intensity={0.8}
          pupilSize={0.4}
          irisWidth={0.2}
          glowIntensity={0.2}
        />
      </div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <div className="px-4 py-1.5 text-xs font-semibold text-violet-400 bg-violet-950/30 border border-violet-500/20 rounded-full inline-block mb-6">Product Overview</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            The Engine Behind the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">Predictions</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-[#8B8B9E] text-lg md:text-xl leading-relaxed">
            ForecastPilot AI isn&apos;t just another dashboard. It&apos;s a predictive intelligence engine built to act as your autonomous Marketing CFO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Neural Forecasting</h3>
            <p className="text-[#8B8B9E] leading-relaxed">
              Our proprietary machine learning models ingest years of historical ad account data, seasonal trends, and market anomalies to generate revenue forecasts with unprecedented accuracy.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Unified Data Lake</h3>
            <p className="text-[#8B8B9E] leading-relaxed">
              We seamlessly merge data from Meta, Google Ads, TikTok, Shopify, and your CRM into a single normalized data structure, providing a holistic view of your entire funnel.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time Optimization</h3>
            <p className="text-[#8B8B9E] leading-relaxed">
              Why wait for end-of-month reporting? The engine recalculates ROAS probabilities hourly, shifting budget recommendations dynamically as campaign performance fluctuates.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6">
              <LineChart className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Scenario Modeling</h3>
            <p className="text-[#8B8B9E] leading-relaxed">
              &quot;What happens if we increase TikTok spend by 20% next week?&quot; Our scenario engine runs Monte Carlo simulations to show you the probable outcomes of every strategic decision.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
