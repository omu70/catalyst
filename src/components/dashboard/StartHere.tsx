"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import type { CreativeUniverse } from "@/types/creative-universe";
import {
  FORMAT_DIRECTIONS,
  PRIORITY_WEIGHT,
  STAGE_LABELS,
} from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <StartHere /> — the ten-second answer.

   Agency reality: nobody reads a report top-to-bottom on first open. The
   first thing on screen must answer "what do I shoot this week?" — the
   three highest-conviction hypotheses as bold, concrete production cards:
   the idea, the exact deliverable, the opening line. Everything below is
   the evidence; this is the verdict.
   ========================================================================== */

export function StartHere({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const topThree = [...universe.angles]
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[a.testingPriority] - PRIORITY_WEIGHT[b.testingPriority] ||
        b.score - a.score,
    )
    .slice(0, 3);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      aria-labelledby="start-here-heading"
    >
      <motion.div variants={riseItem} className="mb-6 flex items-baseline justify-between gap-4">
        <h2 id="start-here-heading" className="machine-label">
          Start here — shoot these three first
        </h2>
        <span className="machine-label hidden items-center gap-1.5 sm:inline-flex">
          Full reasoning below <ArrowDown className="size-3" strokeWidth={2.5} />
        </span>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {topThree.map((angle, i) => (
          <motion.article
            key={angle.title}
            variants={riseItem}
            className="relative overflow-hidden rounded-[--radius-panel] border border-accent/25 bg-vault p-6 shadow-[0_24px_60px_-32px_rgb(8_102_255/0.35)]"
          >
            {/* Accent beam along the top edge */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent" />

            <div className="flex items-center justify-between">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent font-mono text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="machine-label">{STAGE_LABELS[angle.awarenessStage]}</span>
            </div>

            <h3 className="mt-4 text-[19px] leading-snug font-semibold tracking-tight text-ink">
              {angle.title}
            </h3>

            {/* The deliverable — what physically gets produced */}
            <p className="mt-3 rounded-xl bg-accent-ghost px-3.5 py-2.5 text-[13px] leading-relaxed font-medium text-accent-deep">
              Shoot: {FORMAT_DIRECTIONS[angle.format]}
            </p>

            {/* The opening line */}
            <p className="editorial mt-3.5 text-[16px] leading-snug text-ink">
              “{angle.hook}”
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
