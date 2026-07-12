"use client";

import { motion } from "framer-motion";
import { Layers, Map, Rocket } from "lucide-react";

import { Parallax } from "@/components/motion/Parallax";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <EngineProcess /> — how the engine thinks, in three moves.

   Content strategy: each step is written as an OUTCOME the buyer keeps,
   not a feature description. Cards ride different parallax speeds so the
   section has physical depth while scrolling.
   ========================================================================== */

interface ProcessStep {
  index: string;
  title: string;
  body: string;
  icon: typeof Layers;
  /** Parallax speed — alternating depths. */
  speed: number;
}

const STEPS: readonly ProcessStep[] = [
  {
    index: "01",
    title: "Decode the customer",
    body: "The engine extracts the jobs your customers actually hire you for — the pains they'd pay to end and the outcomes they brag about — then pinpoints where they sit on the awareness curve. You stop guessing what to say; you know what they already believe.",
    icon: Layers,
    speed: 0.28,
  },
  {
    index: "02",
    title: "Map the universe",
    body: "Every viable angle gets plotted across awareness stages, emotions, and formats — scored by expected performance and information gain. Covered territory, contested territory, and the gaps nobody in your category is running. Your whole creative landscape on one screen.",
    icon: Map,
    speed: 0.12,
  },
  {
    index: "03",
    title: "Run the roadmap",
    body: "Four weeks, sequenced so every test funds the next decision: baselines in week one, expansion in two, iteration in three, scale in four. Each week ships with named angles, verbatim hooks, and the metric that defines done. Monday morning, your buyer just executes.",
    icon: Rocket,
    speed: 0.28,
  },
];

export function EngineProcess(): React.JSX.Element {
  return (
    <section
      id="process"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] scroll-mt-28 pt-8 pb-32"
      aria-labelledby="process-heading"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 max-w-2xl"
      >
        <motion.p variants={riseItem} className="machine-label mb-4">
          The methodology
        </motion.p>
        <motion.h2
          variants={riseItem}
          id="process-heading"
          className="text-display font-semibold tracking-tight text-balance text-ink"
        >
          Three moves from brief to{" "}
          <span className="editorial text-lit-accent">banked learnings.</span>
        </motion.h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <Parallax key={step.index} speed={step.speed}>
            <motion.article
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 260, damping: 34 }}
              className="glass-panel flex h-full flex-col rounded-[--radius-panel] p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent-ghost">
                  <step.icon className="size-4.5 text-accent-deep" strokeWidth={2.25} />
                </span>
                <span className="font-mono text-xs text-data">{step.index}</span>
              </div>
              <h3 className="text-title font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
                {step.body}
              </p>
            </motion.article>
          </Parallax>
        ))}
      </div>
    </section>
  );
}
