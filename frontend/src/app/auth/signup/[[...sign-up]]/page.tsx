"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <div className="nubien-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex justify-center"
      >
        <SignUp fallbackRedirectUrl="/dashboard" signInUrl="/auth/login" />
      </motion.div>
    </div>
  );
}
