"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

import type { CreativeUniverse } from "@/types/creative-universe";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { LeafCard } from "@/components/motion/LeafCard";

/* ============================================================================
   <TestingRoadmap /> — the 4-week plan as a board.

   Four soft columns in week order, each a card: theme, objective, the
   angles entering test, and the success metric as the card's footer rail.
   Connected by a hairline "timeline" on large screens.
   ========================================================================== */

export function TestingRoadmap({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const weeks = [...universe.roadmap].sort((a, b) => a.week - b.week);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="roadmap-heading"
    >
      <motion.h2 variants={riseItem} id="roadmap-heading" className="machine-label mb-6">
        05 · The 4-week testing roadmap — learnings compound weekly
      </motion.h2>

      <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Timeline hairline behind the columns (decorative) */}
        <div aria-hidden className="hairline-x absolute -top-0 right-0 left-0 hidden xl:block" />

        {weeks.map((week) => (
          <LeafCard key={week.week} index={(week.week - 1) % 4} className="xl:mt-6">
            <article
            className={`glass-panel flex h-full flex-col rounded-[--radius-panel] p-6 ${
              week.week === 1
                ? // Active week — glowing state; the timeline starts HERE.
                  // ring composes with the glass border regardless of cascade.
                  "shadow-glow-accent ring-1 ring-accent/50"
                : "opacity-80"
            }`}
          >
            {/* Week marker */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent-ghost font-mono text-xs font-medium text-accent-deep">
                W{week.week}
              </span>
              <h3 className="text-[15px] font-semibold text-ink">
                {week.theme}
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-ink-secondary">
              {week.objective}
            </p>

            {/* Angles entering test this week */}
            <div className="mt-4 flex flex-wrap gap-2">
              {week.angleTitles.map((title) => (
                <span
                  key={title}
                  className="rounded-full bg-void px-3 py-1.5 text-xs font-medium text-ink-secondary"
                >
                  {title}
                </span>
              ))}
            </div>

            {/* Success metric — the week's finish line */}
            <div className="mt-auto flex items-start gap-2 border-t border-line pt-4">
              <Flag className="mt-0.5 size-3.5 shrink-0 text-data" strokeWidth={2.25} />
              <p className="text-xs leading-relaxed text-ink-tertiary">
                {week.successMetric}
              </p>
            </div>
            </article>
          </LeafCard>
        ))}
      </div>
    </motion.section>
  );
}
