"use client";

import { motion } from "framer-motion";
import { Radar, Swords, Target } from "lucide-react";

import type { CompetitorInsights as CompetitorInsightsData } from "@/types/creative-universe";
import { LeafCard } from "@/components/motion/LeafCard";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <CompetitorInsights /> — live Ad Library intelligence, rendered only when
   the engine had competitor data (META_AD_LIBRARY_TOKEN configured).
   ========================================================================== */

export function CompetitorInsights({
  insights,
}: {
  insights: CompetitorInsightsData;
}): React.JSX.Element {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="competitor-heading"
    >
      <motion.h2
        variants={riseItem}
        id="competitor-heading"
        className="machine-label mb-6"
      >
        02b · Competitive landscape — from live Meta Ad Library data
      </motion.h2>

      <motion.p
        variants={riseItem}
        className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-secondary"
      >
        {insights.landscape}
      </motion.p>

      <div className="grid gap-5 md:grid-cols-2">
        <LeafCard index={0}>
          <article className="glass-panel h-full rounded-[--radius-panel] p-6">
            <span className="mb-4 flex size-9 items-center justify-center rounded-xl bg-data-ghost">
              <Radar className="size-4 text-data" strokeWidth={2.25} />
            </span>
            <h3 className="text-[15px] font-semibold text-ink">
              Saturated territory — what everyone runs
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {insights.commonPatterns.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                  <Swords className="mt-0.5 size-3.5 shrink-0 text-ink-faint" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </LeafCard>

        <LeafCard index={1}>
          <article className="glass-panel h-full rounded-[--radius-panel] p-6 ring-1 ring-accent/30">
            <span className="mb-4 flex size-9 items-center justify-center rounded-xl bg-accent-ghost">
              <Target className="size-4 text-accent-deep" strokeWidth={2.25} />
            </span>
            <h3 className="text-[15px] font-semibold text-ink">
              Open territory — the exploitable gaps
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {insights.exploitableGaps.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                  <Target className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </LeafCard>
      </div>
    </motion.section>
  );
}
