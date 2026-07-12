"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SPRING_SMOOTH } from "@/lib/motion/springs";

/* ============================================================================
   <EngineStatus /> — the loading state as theater.

   Generation takes 10–60s. Instead of a spinner (dead time), the engine
   narrates its methodology — the same five steps the strategist prompt
   actually runs. Honest choreography: the user learns the framework while
   waiting, which builds trust in the output.
   ========================================================================== */

const ENGINE_STEPS = [
  "Extracting jobs-to-be-done…",
  "Diagnosing audience awareness…",
  "Mapping the creative angle matrix…",
  "Scoring opportunity × information gain…",
  "Sequencing the 4-week roadmap…",
] as const;

/** Cadence of the status line rotation. */
const STEP_INTERVAL_MS = 3200;

export function EngineStatus(): React.JSX.Element {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setStepIndex((i) => (i + 1) % ENGINE_STEPS.length),
      STEP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel mx-auto w-full max-w-2xl rounded-[--radius-panel] p-10 text-center">
      {/* Pulse core — the engine's heartbeat */}
      <div className="relative mx-auto mb-8 size-16">
        <span className="absolute inset-0 animate-beacon rounded-full bg-accent-ghost" />
        <span className="absolute inset-3 animate-beacon rounded-full bg-accent-ghost [animation-delay:0.4s]" />
        <span className="absolute inset-6 rounded-full bg-accent" />
      </div>

      {/* Rotating methodology line */}
      <div className="relative h-7 overflow-hidden" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={SPRING_SMOOTH}
            className="text-title font-medium text-ink"
          >
            {ENGINE_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="machine-label mt-3">
        Step {stepIndex + 1} of {ENGINE_STEPS.length} · Engine running
      </p>

      {/* Indeterminate progress rail — scaleX shimmer, GPU-only */}
      <div className="mx-auto mt-8 h-px w-64 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full w-1/3 bg-accent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
