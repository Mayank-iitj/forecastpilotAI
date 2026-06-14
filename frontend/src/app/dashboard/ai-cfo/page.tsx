"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles, User, Copy, ThumbsUp } from "lucide-react";

const suggestions = [
  "Why is revenue expected to drop?",
  "Where should we invest next month?",
  "Which campaign is underperforming?",
  "How can we improve ROAS?",
  "What are the main risks?",
  "Generate a client report",
];

const demoResponses: Record<string, string> = {
  "Why is revenue expected to drop?": `Based on the current forecast data, revenue is projected to decline by approximately 11% over the next 30 days.

**Primary Drivers:**
1. **Meta CPC Inflation (+23%)** — Cost-per-click on Meta has risen significantly, reducing ROAS from 4.2x to 3.4x
2. **Conversion Rate Decline (-8%)** — Site-wide CVR dropped, particularly on mobile (-12%)
3. **Branded Search Volume (-15%)** — Organic branded queries declining

**Recommended Actions:**
• Shift 12% of Meta prospecting budget to Google Shopping (ROAS: 5.2x)
• Implement retargeting frequency caps to reduce audience fatigue
• Test new landing page variants to address CVR decline
• Increase email marketing frequency to capture existing audience

**Expected Impact:** Following these recommendations could recover 60-70% of the projected decline.`,
  "Where should we invest next month?": `**Optimal Investment Strategy for Next Month:**

| Channel | Current | Recommended | Change |
|---------|---------|-------------|--------|
| Google Ads | 35% | 38% | +3% |
| Meta Ads | 33% | 28% | -5% |
| Microsoft Ads | 12% | 14% | +2% |
| Email | 5% | 8% | +3% |

**Key Insight:** Email marketing at 42x ROAS is severely underfunded. Every additional $1 in email generates $42 in revenue.

**Projected Impact:** +$8,400 incremental revenue with same total spend.`,
  "Which campaign is underperforming?": `**🔴 Critical — Immediate Action Required:**
1. **Meta Prospecting — Broad** (ROAS: 1.2x, Target: 3.0x) — Audience fatigue after 45 days
2. **Google Display — Remarketing 180d** (ROAS: 0.8x) — Window too wide

**🟡 Warning — Monitor:**
3. **Microsoft Shopping — Non-Brand** (ROAS: 2.8x, declining 15% WoW)

**🟢 Opportunity — Scale Up:**
4. **Google Shopping — PMAX** (ROAS: 6.1x) — Room for 25% budget increase`,
  "How can we improve ROAS?": `**ROAS Improvement Strategy (4.2x → 5.0x):**

**Quick Wins (1-2 weeks):**
• Pause campaigns below 2.0x ROAS — saves ~$2,100/month
• Dayparting: reduce bids 30% during 11PM-6AM
• Add negative keywords from search term analysis

**Medium-Term (2-4 weeks):**
• Launch lookalike audiences from top 10% LTV customers
• A/B test landing pages (current CVR: 2.8% → target: 3.9%)

**Timeline:** Week 2: 4.5x → Week 4: 4.8x → Week 8: 5.1x`,
};

type Message = { role: "user" | "assistant"; content: string };
import { apiFetch } from "@/lib/utils";

export default function AiCfoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI Marketing CFO. I can help you understand forecasts, explain revenue changes, identify risks, and recommend actions. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const data = await apiFetch("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting to the AI core right now. Please try again." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold">AI Marketing CFO</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Your intelligent marketing advisor — ask anything about your forecasts</p>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s)}
            className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-xs font-medium hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--primary)/0.3)] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-purple-400" /> {s}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-[hsl(var(--muted))]"
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === "assistant" && i > 0 && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[hsl(var(--border))]">
                    <button className="p-1 rounded hover:bg-[hsl(var(--accent))] transition-colors"><Copy className="w-3 h-3 text-[hsl(var(--muted-foreground))]" /></button>
                    <button className="p-1 rounded hover:bg-[hsl(var(--accent))] transition-colors"><ThumbsUp className="w-3 h-3 text-[hsl(var(--muted-foreground))]" /></button>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[hsl(var(--muted))] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[hsl(var(--border))] p-4">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI Marketing CFO anything..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
