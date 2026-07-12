"use client";

import { motion } from "framer-motion";

import { HERO_METRICS } from "@/config/site";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { Parallax } from "@/components/motion/Parallax";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { StrategyConsole } from "@/components/marketing/StrategyConsole";

/* ============================================================================
   <ProductFrame /> — the full-width cinematic product shot.

   The reference pattern (FoF dashboard, ElevenLabs media frame): a light
   editorial page opens into one wide, dark, rounded frame where the product
   lives. `.surface-dark` re-themes every token inside — the same
   StrategyConsole renders light in no scope and cinematic here.
   ========================================================================== */

export function ProductFrame(): React.JSX.Element {
  return (
    <section
      aria-label="Catalyst strategy console preview"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pb-28"
    >
      <Parallax speed={-0.08}>
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 140, damping: 26, mass: 1 }}
          className="surface-dark overflow-hidden rounded-[2rem] border border-line bg-abyss p-2 shadow-[0_48px_120px_-48px_rgb(0_0_0/0.9)]"
        >
          {/* Inner atmosphere — ambient blue + violet light behind the console */}
          <div className="relative overflow-hidden rounded-[1.6rem] bg-[linear-gradient(160deg,_#101018_0%,_#0a0a0c_55%,_#0e0d16_100%)] px-5 py-6 sm:px-8 sm:py-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/3 left-1/4 h-[420px] w-[640px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgb(59_130_246/0.15)_0%,_transparent_65%)] blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-1/4 -bottom-1/3 h-[380px] w-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgb(139_92_246/0.13)_0%,_transparent_65%)] blur-2xl"
            />
            <div aria-hidden className="grain pointer-events-none absolute inset-0" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="relative"
            >
              {/* Frame header rail */}
              <motion.div
                variants={riseItem}
                className="mb-6 flex flex-wrap items-center justify-between gap-3 px-1"
              >
                <div className="flex items-center gap-2.5">
                  <span className="animate-beacon size-1.5 rounded-full bg-accent" />
                  <span className="machine-label text-ink-secondary">
                    Live strategy console
                  </span>
                </div>
                <span className="machine-label">
                  Output shown is a real engine run
                </span>
              </motion.div>

              <div className="grid gap-6 lg:grid-cols-5">
                {/* The product — same component, re-themed by the scope */}
                <motion.div variants={riseItem} className="lg:col-span-3">
                  <StrategyConsole />
                </motion.div>

                {/* Outcome telemetry — the numbers that sell the machine */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                  {HERO_METRICS.map((metric, index) => (
                    <motion.div key={metric.label} variants={riseItem} className="flex-1">
                      <SpotlightCard
                        tint={index === 1 ? "aura" : "accent"}
                        className="glass-panel h-full rounded-[--radius-panel] px-6 py-5"
                      >
                        <div className="flex h-full flex-col justify-center">
                          <span className="font-mono text-3xl font-medium tracking-tight text-ink">
                            {metric.value}
                          </span>
                          <span className="machine-label mt-1.5">
                            {metric.label}
                          </span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Parallax>
    </section>
  );
}
