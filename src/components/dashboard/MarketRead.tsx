"use client";

import { motion } from "framer-motion";

import type { CreativeUniverse } from "@/types/creative-universe";
import {
  STAGE_LABELS,
  STAGE_MEANINGS,
  STAGE_ORDER,
} from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <MarketRead /> — where this market stands, in plain language.

   The engine always diagnoses the dominant awareness stage and why — but
   that verdict used to live only inside the data. This panel makes it the
   report's second beat: a funnel strip with the market's position lit up,
   the diagnosis in the strategist's words, what that stage means for
   creative, and (when competitor data exists) the category landscape.
   ========================================================================== */

export function MarketRead({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const { dominantAwarenessStage, awarenessRationale } =
    universe.productUnderstanding;
  const landscape = universe.competitorInsights?.landscape;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="market-read-heading"
    >
      <motion.h2 variants={riseItem} id="market-read-heading" className="machine-label mb-6">
        02 · Market read — where your buyers stand today
      </motion.h2>

      <motion.div
        variants={riseItem}
        className="glass-panel rounded-[--radius-panel] p-7 sm:p-9"
      >
        {/* Funnel strip — the market's position, lit */}
        <div className="grid grid-cols-5 gap-1.5">
          {STAGE_ORDER.map((stage) => {
            const active = stage === dominantAwarenessStage;
            return (
              <div key={stage} className="flex flex-col gap-2">
                <div
                  className={cn(
                    "h-1.5 rounded-full",
                    active ? "bg-accent" : "bg-line",
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[9px] tracking-[0.1em] uppercase sm:text-[10px]",
                    active ? "font-semibold text-accent-deep" : "text-ink-tertiary",
                  )}
                >
                  {STAGE_LABELS[stage]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="machine-label mb-2.5">The diagnosis</p>
            <p className="text-[16px] leading-relaxed text-ink">
              Your market is{" "}
              <span className="font-semibold text-accent-deep">
                {STAGE_LABELS[dominantAwarenessStage].toLowerCase()}
              </span>
              . {awarenessRationale}
            </p>
          </div>
          <div>
            <p className="machine-label mb-2.5">What that means for creative</p>
            <p className="text-[16px] leading-relaxed text-ink-secondary">
              {STAGE_MEANINGS[dominantAwarenessStage]}
            </p>
          </div>
        </div>

        {landscape && (
          <div className="mt-8 border-t border-line pt-6">
            <p className="machine-label mb-2.5">
              Category landscape — from live competitor ads
            </p>
            <p className="max-w-3xl text-[15px] leading-relaxed text-ink-secondary">
              {landscape}
            </p>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
