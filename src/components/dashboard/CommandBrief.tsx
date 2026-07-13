"use client";

import { motion } from "framer-motion";

import type { CreativeUniverse } from "@/types/creative-universe";
import { computeUniverseMetrics } from "@/lib/utils/universe-metrics";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <CommandBrief /> — the CEO briefing strip.

   Six terminal-style stat tiles answering the Monday-morning questions:
   how strong is this batch, how wide is coverage, where's the opening,
   what's the category over-running, what's sleeping, how much to produce.
   Every number is computed from the universe — never model-asserted.
   ========================================================================== */

export function CommandBrief({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const m = computeUniverseMetrics(universe);

  const tiles: Array<{ label: string; value: string; detail: string; accent?: boolean }> = [
    {
      label: "Creative score",
      value: String(m.creativeScore),
      detail: "Avg. confidence of your top 3 plays",
      accent: true,
    },
    {
      label: "Funnel coverage",
      value: `${m.stagesCovered}/5`,
      detail: "Awareness stages with a live hypothesis",
    },
    {
      label: "Diversity",
      value: `${m.diversityScore}`,
      detail: `${m.formatsUsed} formats in the mix — monoculture kills accounts`,
    },
    {
      label: "Biggest opening",
      value: m.biggestOpportunity ? "→" : "—",
      detail: m.biggestOpportunity ?? "No unclaimed territory flagged this run",
      accent: Boolean(m.biggestOpportunity),
    },
    {
      label: "Category overuses",
      value: m.overusedInCategory ? "!" : "—",
      detail:
        m.overusedInCategory ??
        "Connect competitor data to see what your category over-runs",
    },
    {
      label: "Production volume",
      value: String(m.recommendedAssets),
      detail: `${universe.angles.length} hypotheses × 3 hook variants each`,
    },
  ];

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      aria-label="Executive briefing"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((tile) => (
          <motion.div
            key={tile.label}
            variants={riseItem}
            className={`rounded-2xl border p-4 ${
              tile.accent
                ? "border-accent/30 bg-accent-ghost"
                : "border-line bg-vault"
            }`}
          >
            <p className="machine-label">{tile.label}</p>
            <p
              className={`mt-2 font-mono text-2xl font-medium tracking-tight ${
                tile.accent ? "text-accent-deep" : "text-ink"
              }`}
            >
              {tile.value}
            </p>
            <p className="mt-1.5 line-clamp-3 text-[12px] leading-snug text-ink-secondary">
              {tile.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {m.undervalued && (
        <motion.p variants={riseItem} className="mt-3 text-[13px] text-ink-tertiary">
          <span className="font-medium text-ink-secondary">Sleeper alert:</span>{" "}
          &ldquo;{m.undervalued}&rdquo; scores ≥75 but isn&apos;t queued to test —
          worth challenging.
        </motion.p>
      )}
    </motion.section>
  );
}
