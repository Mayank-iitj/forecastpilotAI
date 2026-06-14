import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EvilEye from "@/components/EvilEye";
import { ShieldCheck, Zap, BarChart3, Clock, BellRing, Target } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    { title: "Predictive ROAS", desc: "Know your return on ad spend up to 90 days in advance.", icon: Target, color: "text-violet-400", bg: "bg-violet-400/20" },
    { title: "Budget Allocation Engine", desc: "Automated recommendations on exactly where to move your money today.", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/20" },
    { title: "Anomaly Detection", desc: "Instant alerts when campaigns deviate from expected performance ranges.", icon: BellRing, color: "text-rose-400", bg: "bg-rose-400/20" },
    { title: "Cross-Channel Attribution", desc: "Understand the true value of every touchpoint across platforms.", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/20" },
    { title: "Risk Mitigation", desc: "Identify scaling fatigue before you burn cash on saturated audiences.", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/20" },
    { title: "Historical Backtesting", desc: "Test our AI's accuracy against your own past data to build trust.", icon: Clock, color: "text-orange-400", bg: "bg-orange-400/20" },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-violet-500/30 font-sans overflow-hidden relative">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen w-full h-full">
        <EvilEye eyeColor="#8B5CF6" intensity={0.5} />
      </div>
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Everything you need to <br className="hidden md:block" />
            predict <span className="text-violet-400">revenue</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-[#8B8B9E] text-lg md:text-xl">
            A comprehensive suite of tools designed to replace guesswork with data science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-[#8B8B9E] leading-relaxed text-sm">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
