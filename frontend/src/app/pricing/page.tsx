import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$299",
      period: "/mo",
      desc: "For small agencies and growing brands.",
      features: ["Up to $50k monthly ad spend", "2 Data Connections", "Daily Forecast Updates", "Basic Email Support"],
      buttonText: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "$799",
      period: "/mo",
      desc: "For scaling growth teams requiring precision.",
      features: ["Up to $500k monthly ad spend", "Unlimited Data Connections", "Hourly Forecast Updates", "Scenario Planning Engine", "Priority Support"],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large organizations with complex data.",
      features: ["Unlimited ad spend", "Custom AI Model Training", "Dedicated Data Scientist", "Data API Access", "SLA & SSO"],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-violet-500/30 font-sans overflow-hidden relative">
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Predictable pricing for <br className="hidden md:block" />
            predictable <span className="text-violet-400">revenue</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-[#8B8B9E] text-lg md:text-xl">
            Choose a plan that scales with your ad spend. Try any plan free for 14 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative flex flex-col p-8 rounded-3xl ${plan.popular ? 'bg-violet-900/20 border-violet-500/50 border-2 scale-105 z-10' : 'bg-white/5 border border-white/10'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-[#8B8B9E] text-sm mb-6 h-10">{plan.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-[#8B8B9E]">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-violet-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-white text-black hover:bg-neutral-200'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
