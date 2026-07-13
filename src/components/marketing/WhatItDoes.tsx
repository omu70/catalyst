"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ClipboardList,
  FileText,
  ListChecks,
  Store,
  Users,
} from "lucide-react";

import { LeafCard } from "@/components/motion/LeafCard";
import { Parallax } from "@/components/motion/Parallax";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/** Alternating parallax depths — outer columns drift, center holds. */
const COLUMN_SPEEDS = [0.24, 0.05, 0.24] as const;

/* ============================================================================
   <WhatItDoes /> — the plainest possible explanation of the product.

   Audit finding: the landing sold outcomes but never stated what Catalyst
   IS. This section answers it in one glance: what you paste, what the
   engine does, what you walk away with. No metaphors, no cleverness —
   deliberate clarity between two highly-designed sections.
   ========================================================================== */

interface FlowStep {
  eyebrow: string;
  title: string;
  items: Array<{ icon: typeof Store; text: string }>;
}

const FLOW: readonly FlowStep[] = [
  {
    eyebrow: "You paste",
    title: "2 minutes of input",
    items: [
      { icon: Store, text: "Your store URL (we read your products automatically)" },
      { icon: FileText, text: "What you sell and what it costs" },
      { icon: Users, text: "Who buys it" },
    ],
  },
  {
    eyebrow: "Catalyst thinks",
    title: "Like a senior strategist",
    items: [
      { icon: Brain, text: "Decodes customer psychology — jobs, objections, triggers, hidden desires" },
      { icon: Brain, text: "Maps every creative angle across awareness stages" },
      { icon: Brain, text: "Finds the gaps nobody in your category is running" },
    ],
  },
  {
    eyebrow: "You get",
    title: "A month of testing, decided",
    items: [
      { icon: ListChecks, text: "6–12 falsifiable creative hypotheses, each with a ready-to-shoot hook" },
      { icon: ClipboardList, text: "A 4-week testing roadmap with success metrics per week" },
      { icon: FileText, text: "An exportable brief your creative team executes Monday" },
    ],
  },
];

export function WhatItDoes(): React.JSX.Element {
  return (
    <section
      id="what"
      aria-labelledby="what-heading"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] scroll-mt-28 pb-24"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 max-w-3xl"
      >
        <motion.p variants={riseItem} className="machine-label mb-4">
          What Catalyst does
        </motion.p>
        <motion.h2
          variants={riseItem}
          id="what-heading"
          className="text-display font-semibold tracking-tight text-balance text-ink"
        >
          You tell it what you sell.{" "}
          <span className="editorial text-lit-accent">It tells you</span> what
          to test.
        </motion.h2>
        <motion.p
          variants={riseItem}
          className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-secondary"
        >
          Catalyst is an AI creative strategist for Meta advertisers. It does
          not write your ads or generate images — it answers the question
          every media buyer asks each week:{" "}
          <span className="font-medium text-ink">
            &ldquo;what creative should we test next?&rdquo;
          </span>
        </motion.p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {FLOW.map((step, i) => (
          <>
            <Parallax key={step.eyebrow} speed={COLUMN_SPEEDS[i] ?? 0.1}>
            <LeafCard index={i} className="h-full">
              <div className="glass-panel h-full rounded-[--radius-panel] p-7">
                <p className="machine-label">{step.eyebrow}</p>
                <h3 className="mt-2 text-title font-semibold text-ink">
                  {step.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {step.items.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                      <Icon className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </LeafCard>
            </Parallax>
            {i < FLOW.length - 1 && (
              <div
                key={`arrow-${step.eyebrow}`}
                aria-hidden
                className="hidden items-center lg:flex"
              >
                <ArrowRight className="size-5 text-ink-faint" strokeWidth={2} />
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
}
