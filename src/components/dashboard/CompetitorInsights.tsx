"use client";

import { motion } from "framer-motion";
import { ExternalLink, Radar, Swords, Target } from "lucide-react";

import type { CompetitorInsights as CompetitorInsightsData } from "@/types/creative-universe";
import { LeafCard } from "@/components/motion/LeafCard";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <CompetitorInsights /> — who you're up against and where they're weak.

   Always rendered: grounded in live Ad Library pulls when the token is
   configured, otherwise the engine's category inference (labeled as such).
   Every named competitor deep-links to their live ads in Meta's public
   Ad Library — one click from claim to receipts, no API token required.
   ========================================================================== */

/** Public Ad Library search — works for anyone, no token needed. */
function adLibraryUrl(brand: string): string {
  return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(brand)}`;
}

export function CompetitorInsights({
  insights,
}: {
  insights: CompetitorInsightsData;
}): React.JSX.Element {
  const inferred = insights.landscape.toLowerCase().startsWith("category read");

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
        02b · Competitive landscape —{" "}
        {inferred
          ? "engine's category read (click any brand to verify their live ads)"
          : "from live Meta Ad Library data"}
      </motion.h2>

      {/* Who you're actually up against */}
      {insights.likelyCompetitors && insights.likelyCompetitors.length > 0 && (
        <motion.div variants={riseItem} className="mb-5">
          <p className="machine-label mb-2.5">Your likely competitors</p>
          <div className="flex flex-wrap gap-2">
            {insights.likelyCompetitors.map((brand) => (
              <a
                key={brand}
                href={adLibraryUrl(brand)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-vault px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent-deep"
              >
                {brand}
                <ExternalLink className="size-3 text-ink-tertiary group-hover:text-accent" strokeWidth={2.25} />
              </a>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-tertiary">
            Links open each brand&apos;s live ads in Meta&apos;s public Ad
            Library — see exactly what they&apos;re running right now.
          </p>
        </motion.div>
      )}

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
