"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        aria-hidden
      />
      <span className="text-sm text-[var(--muted)]">{label}</span>
    </div>
  );
}
