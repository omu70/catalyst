"use client";

import { motion } from "framer-motion";

import type { CreativeUniverse } from "@/types/creative-universe";
import {
  FORMAT_LABELS,
  PRIORITY_STYLES,
  STAGE_LABELS,
} from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { OutcomeTracker } from "@/components/dashboard/OutcomeTracker";

/* ============================================================================
   <AngleCards /> — the top HYPOTHESES in full detail: the falsifiable
   statement, the psychology, the verbatim hook, the kill-metric prediction,
   and the outcome tracker that feeds the learning loop.
   ========================================================================== */

/** How many hypotheses get the full-card treatment (rest live in the matrix). */
const TOP_ANGLE_COUNT = 6;

export function AngleCards({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const topAngles = [...universe.angles]
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_ANGLE_COUNT);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="angles-heading"
    >
      <motion.h2 variants={riseItem} id="angles-heading" className="machine-label mb-6">
        03 · Creative hypotheses — falsifiable, prioritized, shootable
      </motion.h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {topAngles.map((angle, index) => (
          <motion.article
            key={angle.title}
            variants={riseItem}
            className="glass-panel flex flex-col rounded-[--radius-panel] p-6"
          >
            {/* Rank + score header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-data">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-ink">
                  {angle.score}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${PRIORITY_STYLES[angle.testingPriority]}`}
                >
                  {angle.testingPriority}
                </span>
              </div>
            </div>

            <h3 className="text-[17px] leading-snug font-semibold text-ink">
              {angle.title}
            </h3>

            {/* The falsifiable statement — what beats what, for whom */}
            <p className="mt-2.5 text-sm leading-relaxed font-medium text-ink">
              {angle.statement}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              {angle.whyItWorks}
            </p>

            {/* The hook — editorial voice, ready to read aloud */}
            <blockquote className="editorial mt-4 border-l-2 border-accent pl-4 text-[17px] leading-snug text-ink">
              “{angle.hook}”
            </blockquote>

            {/* The kill-metric — how this hypothesis gets proven or killed */}
            <p className="mt-3 rounded-xl bg-void px-3.5 py-2.5 font-mono text-xs leading-relaxed text-ink-secondary">
              Confirm if: {angle.prediction}
            </p>

            {/* Shoot metadata */}
            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-5">
              {[
                STAGE_LABELS[angle.awarenessStage],
                FORMAT_LABELS[angle.format],
                angle.emotion,
              ].map((meta) => (
                <span key={meta} className="machine-label">
                  {meta}
                </span>
              ))}
            </div>

            {/* Learning loop — mark what actually happened */}
            <OutcomeTracker hypothesisTitle={angle.title} />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
