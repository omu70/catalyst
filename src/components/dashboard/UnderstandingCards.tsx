"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Eye,
  HeartCrack,
  ShieldQuestion,
  Target,
  Zap,
} from "lucide-react";

import type { ProductUnderstanding } from "@/types/creative-universe";
import { STAGE_LABELS } from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <UnderstandingCards /> — full customer psychology: jobs, pains, outcomes,
   objections, purchase triggers, hidden desires + the awareness verdict.
   ========================================================================== */

interface CardSpec {
  key: keyof Pick<
    ProductUnderstanding,
    | "jobsToBeDone"
    | "corePainPoints"
    | "desiredOutcomes"
    | "objections"
    | "purchaseTriggers"
    | "hiddenDesires"
  >;
  title: string;
  icon: typeof Compass;
}

const CARDS: readonly CardSpec[] = [
  { key: "jobsToBeDone", title: "Jobs to be done", icon: Compass },
  { key: "corePainPoints", title: "Core pain points", icon: HeartCrack },
  { key: "desiredOutcomes", title: "Desired outcomes", icon: Target },
  { key: "objections", title: "Objections to beat", icon: ShieldQuestion },
  { key: "purchaseTriggers", title: "Purchase triggers", icon: Zap },
  { key: "hiddenDesires", title: "Hidden desires", icon: Eye },
];

export function UnderstandingCards({
  understanding,
}: {
  understanding: ProductUnderstanding;
}): React.JSX.Element {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="understanding-heading"
    >
      <motion.h2 variants={riseItem} id="understanding-heading" className="machine-label mb-6">
        01 · Customer understanding
      </motion.h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ key, title, icon: Icon }) => (
          <motion.article
            key={key}
            variants={riseItem}
            className="glass-panel rounded-[--radius-panel] p-6"
          >
            <span className="mb-4 flex size-9 items-center justify-center rounded-xl bg-accent-ghost">
              <Icon className="size-4 text-accent-deep" strokeWidth={2.25} />
            </span>
            <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {understanding[key].map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary"
                >
                  <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      {/* Awareness verdict — the strategist's diagnosis, in editorial voice */}
      <motion.div
        variants={riseItem}
        className="mt-5 flex flex-col gap-3 rounded-[--radius-panel] border border-line bg-vault p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="machine-label">Dominant awareness stage</p>
          <p className="mt-1 text-title font-semibold text-ink">
            <span className="editorial text-lit-accent">
              {STAGE_LABELS[understanding.dominantAwarenessStage]}
            </span>{" "}
            audience
          </p>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-ink-secondary">
          {understanding.awarenessRationale}
        </p>
      </motion.div>
    </motion.section>
  );
}
