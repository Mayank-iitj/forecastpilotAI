"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MagicBento from "@/components/MagicBento";
import EvilEye from "@/components/EvilEye";
import { 
  ArrowRight, LayoutDashboard, BrainCircuit, 
  BarChart3, Zap, ShieldCheck, CheckCircle2, ChevronDown, Code2,
  TrendingUp, Target, FileText, Link2, AlertTriangle
} from "lucide-react";
import LogoLoop from "@/components/LogoLoop";
import type { LogoItem } from "@/components/LogoLoop";
import FlyingPosters from "@/components/FlyingPosters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagicRings from "@/components/MagicRings";
import GlareHover from "@/components/GlareHover";
import StarBorder from "@/components/StarBorder";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featureLogos: LogoItem[] = [
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><TrendingUp className="w-6 h-6 text-violet-500" /> Revenue Prediction</span>, title: "Revenue Prediction" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><Target className="w-6 h-6 text-violet-500" /> ROAS Optimization</span>, title: "ROAS Optimization" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><BarChart3 className="w-6 h-6 text-violet-500" /> Budget Allocation</span>, title: "Budget Allocation" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><BrainCircuit className="w-6 h-6 text-violet-500" /> Scenario Planning</span>, title: "Scenario Planning" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><AlertTriangle className="w-6 h-6 text-violet-500" /> Risk Analysis</span>, title: "Risk Analysis" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><FileText className="w-6 h-6 text-violet-500" /> Automated Reports</span>, title: "Automated Reports" },
    { node: <span className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white/80"><Link2 className="w-6 h-6 text-violet-500" /> Data Connectors</span>, title: "Data Connectors" },
  ];
  const faqs = [
    { q: "What data sources do you integrate with?", a: "ForecastPilot AI integrates with all major ad platforms (Google Ads, Meta, TikTok) and analytics tools (Google Analytics, Shopify) out of the box." },
    { q: "How accurate are the revenue predictions?", a: "Our models achieve up to 95% accuracy by analyzing historical data, seasonality, and market trends." },
    { q: "Is this suitable for small agencies?", a: "Absolutely. Whether you're a boutique agency or an enterprise brand, our platform scales to your data needs." },
    { q: "How long does onboarding take?", a: "You can connect your data sources in under 5 minutes. The AI takes about 24 hours to train on your historical data before generating forecasts." },
  ];

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
      {/* --- STICKY NAV --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen pt-20 pb-24 px-6 flex flex-col items-center justify-center text-center">

        <div className="nubien-glow" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="px-4 py-1.5 text-xs font-semibold text-violet-400 bg-violet-950/30 border border-violet-500/20 rounded-full mb-8 flex items-center gap-2 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> THE AI-POWERED MARKETING CFO
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] mb-6">
            Forecast Revenue <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">Before You Spend.</span>
          </h1>

          <p className="max-w-2xl text-[#8B8B9E] text-lg md:text-xl mb-10 leading-relaxed font-medium">
            ForecastPilot AI predicts revenue, ROAS, and risk. Allocate your marketing budget dynamically with our predictive engine to maximize growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto hover:scale-105 transition-transform">
              <StarBorder as="div" color="#8B5CF6" speed="4s" className="w-full">
                <span className="flex items-center justify-center gap-2 font-semibold text-sm">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </span>
              </StarBorder>
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-semibold rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2">
              See How It Works
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- COPILOT SECTION --- */}
      <section className="py-24 px-6 border-t border-white/5 relative z-10 bg-[#0B0B0F]/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="px-4 py-1.5 text-xs font-semibold text-violet-400 bg-violet-950/30 border border-violet-500/20 rounded-full inline-block mb-6">Your Personal Guide</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Meet Your AI Copilot.</h2>
            <p className="text-[#8B8B9E] text-lg mb-8 leading-relaxed">
              Navigate complex marketing data seamlessly. Our AI Copilot assists you in real-time, providing actionable insights, continuous optimizations, and interactive visualizations.
            </p>
          </div>
          <div className="flex-1 w-full h-[500px] relative rounded-3xl overflow-hidden border border-white/10 bg-[#030303]">
            <FlyingPosters 
              items={([
                '/images/copilot_dashboard_1781434963283.png',
                '/images/copilot_assistant_1781434975317.png',
                '/images/copilot_navigation_1781434991437.png'
              ] as any[]) as never[]} 
            />
          </div>
        </div>
      </section>

      {/* --- MARQUEE FEATURES (LogoLoop) --- */}
      <section className="py-12 border-y border-white/5 bg-[#0B0B0F]/30 overflow-hidden relative">
        <LogoLoop
          logos={featureLogos}
          speed={80}
          direction="left"
          logoHeight={32}
          gap={48}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="#030303"
          ariaLabel="ForecastPilot AI capabilities"
        />
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="px-4 py-1.5 text-xs font-semibold text-violet-400 bg-violet-950/30 border border-violet-500/20 rounded-full inline-block mb-6">Core Capabilities</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Data-Driven Precision.</h2>
              <p className="text-[#8B8B9E] mt-4 text-lg">ForecastPilot AI turns your historical campaign data into actionable revenue predictions.</p>
            </div>
            <Link href="/auth/signup" className="shrink-0 hover:scale-105 transition-transform">
              <StarBorder as="div" color="#8B5CF6" speed="4s">
                <span className="font-semibold text-sm">Try It Now</span>
              </StarBorder>
            </Link>
          </div>

          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="139, 92, 246"
          />
        </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 flex items-center justify-center pointer-events-none mix-blend-screen">
          <div style={{ width: '800px', height: '800px', position: 'relative' }}>
            <MagicRings
              color="#fc42ff"
              colorTwo="#42fcff"
              ringCount={6}
              speed={1}
              attenuation={10}
              lineThickness={2}
              baseRadius={0.35}
              radiusStep={0.1}
              scaleRate={0.1}
              opacity={1}
              blur={0}
              noiseAmount={0.1}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={false}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={false}
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Stop Guessing. Start Predicting.</h2>
            <p className="text-[#8B8B9E]">Why top growth teams rely on ForecastPilot AI.</p>
          </div>

          <GlareHover
            className="nubien-card"
            width="100%"
            height="auto"
            borderRadius="1.5rem"
            borderColor="rgba(255,255,255,0.1)"
            background="transparent"
            glareColor="#8B5CF6"
            glareOpacity={0.2}
          >
            <div className="w-full flex flex-col">
              <div className="grid grid-cols-2 border-b border-white/10 bg-white/5">
                <div className="p-6 text-center font-semibold text-[#8B8B9E]">Traditional Analytics</div>
                <div className="p-6 text-center font-bold text-white border-l border-white/10">ForecastPilot AI</div>
              </div>
              
              {[
                { label: "Focus", bad: "Looking at past data", good: "Predicting future revenue" },
                { label: "Budgeting", bad: "Gut-feeling allocation", good: "AI-optimized distribution" },
                { label: "Reporting", bad: "Manual spreadsheets", good: "Automated insights" },
                { label: "Actionability", bad: "Static dashboards", good: "Dynamic scenario planning" }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-b border-white/5 last:border-0 w-full">
                  <div className="p-6 flex flex-col items-center text-center gap-3 text-sm text-[#8B8B9E]">
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center"><div className="w-2 h-0.5 bg-red-400" /></div>
                    {row.bad}
                  </div>
                  <div className="p-6 flex flex-col items-center text-center gap-3 text-sm font-medium border-l border-white/10 bg-violet-500/5">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-violet-400" /></div>
                    {row.good}
                  </div>
                </div>
              ))}
            </div>
          </GlareHover>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="nubien-card rounded-2xl overflow-hidden border border-white/10">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#8B8B9E] transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 text-[#8B8B9E] leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
}
