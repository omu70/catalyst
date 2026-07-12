"use client";

import { motion } from "framer-motion";

import type { CreativeAngle, CreativeUniverse } from "@/types/creative-universe";
import {
  PRIORITY_STYLES,
  PRIORITY_WEIGHT,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/config/universe-ui";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <CreativeMatrix /> — covered vs. missing territory, at a glance.

   Form (per dataviz method): this is identity + coverage, not a chart —
   a column per awareness stage in funnel order, angle cards inside, and
   explicit GAP cells where a stage has no coverage. Score bars are
   single-hue emerald (magnitude = one hue); priority is carried by a
   labeled chip, never by repainting the bar. Text wears ink, not series
   color.
   ========================================================================== */

function anglesForStage(
  universe: CreativeUniverse,
  stage: (typeof STAGE_ORDER)[number],
): CreativeAngle[] {
  return universe.angles
    .filter((angle) => angle.awarenessStage === stage)
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[a.testingPriority] - PRIORITY_WEIGHT[b.testingPriority] ||
        b.score - a.score,
    );
}

function MatrixCell({ angle }: { angle: CreativeAngle }): React.JSX.Element {
  return (
    <motion.div
      variants={riseItem}
      className="rounded-2xl border border-line bg-vault p-4 shadow-panel"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug font-medium text-ink">
          {angle.title}
        </p>
        <span className="font-mono text-xs text-ink-secondary">
          {angle.score}
        </span>
      </div>
      {/* Score bar — thin mark, rounded data end, single hue */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: angle.score / 100 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SMOOTH, delay: 0.3 }}
          style={{ originX: 0 }}
          className="h-full rounded-full bg-accent"
        />
      </div>
      <span
        className={`mt-3 inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${PRIORITY_STYLES[angle.testingPriority]}`}
      >
        {angle.testingPriority}
      </span>
    </motion.div>
  );
}

export function CreativeMatrix({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="matrix-heading"
    >
      <motion.div variants={riseItem} className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="matrix-heading" className="machine-label">
          02 · Creative matrix — coverage by awareness stage
        </h2>
        {/* Coverage score is COMPUTED from the map, never model-invented */}
        <p className="font-mono text-xs text-ink-tertiary">
          {universe.angles.length} hypotheses ·{" "}
          {STAGE_ORDER.filter((s) => universe.angles.some((a) => a.awarenessStage === s)).length}
          /5 stages covered · {universe.missingAngleTitles.length} gaps flagged
        </p>
      </motion.div>

      {/* Funnel columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STAGE_ORDER.map((stage) => {
          const angles = anglesForStage(universe, stage);
          return (
            <motion.div variants={riseItem} key={stage} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between px-1">
                <h3 className="machine-label">{STAGE_LABELS[stage]}</h3>
                <span className="font-mono text-xs text-ink-tertiary">
                  {angles.length}
                </span>
              </div>

              {angles.length > 0 ? (
                angles.map((angle) => <MatrixCell key={angle.title} angle={angle} />)
              ) : (
                /* Empty stage — explicit, honest gap cell */
                <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-line-strong bg-void/50 p-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-ink-tertiary uppercase">
                    Uncovered — gap
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Missing territory — the angles the engine says to explore next */}
      {universe.missingAngleTitles.length > 0 && (
        <motion.div variants={riseItem} className="mt-6">
          <p className="machine-label mb-3">Unclaimed territory</p>
          <div className="flex flex-wrap gap-2">
            {universe.missingAngleTitles.map((title) => (
              <span
                key={title}
                className="rounded-full border border-dashed border-line-strong px-3.5 py-1.5 text-sm text-ink-secondary"
              >
                {title}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
