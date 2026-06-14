import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LogoLoop from "@/components/LogoLoop";

export default function IntegrationsPage() {
  const platforms = [
    { name: "Google Ads", tag: "Ads" },
    { name: "Meta Ads", tag: "Ads" },
    { name: "TikTok Ads", tag: "Ads" },
    { name: "Shopify", tag: "Commerce" },
    { name: "Google Analytics", tag: "Analytics" },
    { name: "Salesforce", tag: "CRM" },
    { name: "HubSpot", tag: "CRM" },
    { name: "Stripe", tag: "Payments" },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-violet-500/30 font-sans overflow-hidden relative">
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 text-center">
        <div className="px-6 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Connect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">entire stack</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-[#8B8B9E] text-lg md:text-xl mb-20">
            ForecastPilot AI pulls data seamlessly from the tools you already use. Setup takes 5 minutes, no engineering required.
          </p>
        </div>

        <div className="mb-20 py-8 border-y border-white/5 bg-white/5">
          <LogoLoop
            logos={platforms.map(p => ({
              node: (
                <div className="flex items-center gap-4 px-8">
                  <span className="text-2xl font-bold text-white/80 whitespace-nowrap">{p.name}</span>
                  <span className="text-xs text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full">{p.tag}</span>
                </div>
              ),
              title: p.name
            }))}
            speed={80}
            direction="left"
            logoHeight={48}
            gap={64}
            hoverSpeed={0}
            fadeOut
            fadeOutColor="#030303"
          />
        </div>

        <div className="px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platforms.map((platform, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-8 h-40 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group">
                <div className="text-xl font-bold group-hover:text-violet-400 transition-colors">{platform.name}</div>
                <div className="text-xs text-[#8B8B9E] mt-2 uppercase tracking-widest">{platform.tag}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-12 rounded-3xl bg-violet-900/20 border border-violet-500/20">
            <h3 className="text-3xl font-bold mb-4">Need a custom integration?</h3>
            <p className="text-violet-200/70 mb-8 max-w-xl mx-auto">
              Our Enterprise plan includes access to our unified Data API, allowing you to push custom metrics and internal data warehouse lakes directly into our forecasting engine.
            </p>
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-sm">
              Read API Docs
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
