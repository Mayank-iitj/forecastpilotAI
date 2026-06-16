"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <Navbar />
      <div className="nubien-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex justify-center"
      >
        <SignIn routing="path" path="/auth/login" fallbackRedirectUrl="/dashboard" signUpUrl="/auth/signup" />
      </motion.div>
    </div>
  );
}
