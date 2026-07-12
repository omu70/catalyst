"use client";

import { motion } from "framer-motion";

import {
  CONSOLE_ANGLES,
  CONSOLE_FOOTER,
  CONSOLE_HEADER,
  PRIORITY_STYLES,
} from "@/config/console-preview";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <StrategyConsole /> — the hero artifact: a live glimpse of the product.

   Design rationale: the fastest way to feel "expensive tool, not template"
   is to show the actual instrument in the hero. This is a faithful preview
   of the Phase 3 dashboard — glass panel, machine labels, score bars,
   priority chips — rendered from typed constants that share the shape of
   the future API payload.

   Motion: rows stagger in; score bars fill with scaleX (GPU transform,
   origin-left) AFTER the row lands — the choreography implies "the engine
   just computed this".
   ========================================================================== */

export function StrategyConsole(): React.JSX.Element {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="glass-panel w-full rounded-[--radius-panel] p-1.5"
    >
      {/* Header rail */}
      <motion.div
        variants={riseItem}
        className="flex items-center justify-between px-4 pt-3 pb-3.5"
      >
        <div className="flex items-center gap-2.5">
          <span className="animate-beacon size-1.5 rounded-full bg-accent" />
          <span className="machine-label text-ink-secondary">
            {CONSOLE_HEADER.title}
          </span>
        </div>
        <span className="machine-label">{CONSOLE_HEADER.meta}</span>
      </motion.div>

      {/* Angle rows — the core readout */}
      <div className="flex flex-col gap-1 rounded-[calc(var(--radius-panel)-0.375rem)] bg-void/40 p-1.5">
        {CONSOLE_ANGLES.map((angle, index) => (
          <motion.div
            key={angle.name}
            variants={riseItem}
            className="group flex items-center gap-4 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-glass"
          >
            {/* Rank — mono, brass for the leader */}
            <span
              className={`w-5 shrink-0 font-mono text-xs ${
                index === 0 ? "text-data" : "text-ink-faint"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Angle name + score bar */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-ink">
                  {angle.name}
                </span>
                <span className="font-mono text-xs text-ink-secondary">
                  {angle.score}
                </span>
              </div>
              {/* Score bar — scaleX fill (GPU), origin-left, after row lands */}
              <div className="mt-2 h-px w-full overflow-hidden bg-line">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: angle.score / 100 }}
                  transition={{ ...SPRING_SMOOTH, delay: 0.9 + index * 0.08 }}
                  style={{ originX: 0 }}
                  className={`h-full ${
                    angle.priority === "scale" ? "bg-accent" : "bg-data/70"
                  }`}
                />
              </div>
            </div>

            {/* Priority chip */}
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${PRIORITY_STYLES[angle.priority]}`}
            >
              {angle.priority}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer rail */}
      <motion.div
        variants={riseItem}
        className="flex items-center justify-between px-4 pt-3.5 pb-2.5"
      >
        <span className="machine-label">{CONSOLE_FOOTER.label}</span>
        <span className="font-mono text-xs text-data">
          {CONSOLE_FOOTER.value}
        </span>
      </motion.div>
    </motion.div>
  );
}
