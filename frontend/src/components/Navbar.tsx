"use client";
import React from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { BarChart3 } from "lucide-react";
import PillNav from "./PillNav";

export default function Navbar() {
  return (
    <div className="fixed top-4 left-0 w-full z-50 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-[#0B0B0F]/70 backdrop-blur-md border border-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          ForecastPilot AI
        </div>
        <div className="hidden md:flex items-center text-sm font-medium">
          <PillNav
            items={[
              { label: "Home", href: "/" },
              { label: "Product", href: "/product" },
              { label: "Features", href: "/features" },
              { label: "Integrations", href: "/integrations" },
              { label: "Pricing", href: "/pricing" }
            ]}
            baseColor="#7c3aed"
            pillColor="#000000"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#d4d4d8"
          />
        </div>
        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <Link href="/auth/login" className="text-sm font-semibold text-white hover:text-neutral-300 transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:scale-105 hover:bg-neutral-100 transition-all">
              Start Free Trial
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-sm font-semibold text-white hover:text-neutral-300 transition-colors">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </div>
  );
}
