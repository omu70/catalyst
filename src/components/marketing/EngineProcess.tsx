"use client";

import { motion } from "framer-motion";
import { Layers, Map, Rocket } from "lucide-react";

import {
  StackDeck,
  StackDeckCard,
  useStackDeckProgress,
} from "@/components/motion/StackDeck";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <EngineProcess /> — how the engine thinks, dealt as a card deck.

   The three moves arrive as full-width cards that pin near the top of the
   viewport and stack on top of one another as the reader scrolls — the
   Editions-style set piece of the page. Covered cards recede in scale and
   brightness so the deck reads as physically layered.
   ========================================================================== */

interface ProcessStep {
  index: string;
  title: string;
  body: string;
  outcome: string;
  icon: typeof Layers;
}

const STEPS: readonly ProcessStep[] = [
  {
    index: "01",
    title: "Decode the customer",
    body: "The engine extracts the jobs your customers actually hire you for — the pains they'd pay to end and the outcomes they brag about — then pinpoints where they sit on the awareness curve. You stop guessing what to say; you know what they already believe.",
    outcome: "Customer psychology, mapped",
    icon: Layers,
  },
  {
    index: "02",
    title: "Map the universe",
    body: "Every viable angle gets plotted across awareness stages, emotions, and formats — scored by expected performance and information gain. Covered territory, contested territory, and the gaps nobody in your category is running. Your whole creative landscape on one screen.",
    outcome: "Every angle, scored",
    icon: Map,
  },
  {
    index: "03",
    title: "Run the roadmap",
    body: "Four weeks, sequenced so every test funds the next decision: baselines in week one, expansion in two, iteration in three, scale in four. Each week ships with named angles, verbatim hooks, and the metric that defines done. Monday morning, your buyer just executes.",
    outcome: "A month of tests, decided",
    icon: Rocket,
  },
];

export function EngineProcess(): React.JSX.Element {
  const { ref, progress } = useStackDeckProgress();

  return (
    <section
      id="process"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] scroll-mt-28 pt-8 pb-32"
      aria-labelledby="process-heading"
    >
      {/* Split-editorial section header — huge heading left, support right */}
      <TextReveal>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-14 grid items-end gap-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
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
        </div>
        <motion.p
          variants={riseItem}
          className="text-[15px] leading-relaxed text-ink-secondary lg:col-span-4 lg:col-start-9 lg:pb-1.5"
        >
          No black box. The engine runs the same discipline elite creative
          strategists charge retainers for — codified, scored, and finished
          in ninety seconds.
        </motion.p>
      </motion.div>
      </TextReveal>

      {/* The deck — cards pin and stack as the reader scrolls */}
      <div ref={ref}>
        <StackDeck>
          {STEPS.map((step, i) => (
            <StackDeckCard
              key={step.index}
              index={i}
              total={STEPS.length}
              progress={progress}
            >
              <SpotlightCard
                tint="accent"
                // Opaque surface — stacked cards must fully cover the one
                // beneath, so no glass translucency here.
                className="rounded-[--radius-panel] border border-line bg-vault p-8 shadow-[0_32px_80px_-32px_rgb(17_18_19/0.28)] sm:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                  {/* Left rail: number, icon, outcome */}
                  <div className="flex items-start justify-between gap-6 lg:col-span-4 lg:flex-col lg:justify-start">
                    <span className="font-mono text-[64px] leading-none font-medium tracking-tight text-accent sm:text-[80px]">
                      {step.index}
                    </span>
                    <div className="flex flex-col items-end gap-3 lg:items-start">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-accent-ghost">
                        <step.icon className="size-5 text-accent-deep" strokeWidth={2.25} />
                      </span>
                      <span className="machine-label">{step.outcome}</span>
                    </div>
                  </div>

                  {/* Right: the substance */}
                  <div className="lg:col-span-7 lg:col-start-6">
                    <h3 className="text-[26px] leading-snug font-semibold tracking-tight text-ink sm:text-[30px]">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-secondary sm:text-[17px]">
                      {step.body}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </StackDeckCard>
          ))}
        </StackDeck>
      </div>
    </section>
  );
}
