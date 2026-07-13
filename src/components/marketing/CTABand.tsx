"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { TextReveal } from "@/components/motion/TextReveal";
import { ButtonChip, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   <CTABand /> — the black closing statement (the 30%).

   The Editions horizon move: the white page ends at a full-bleed dark
   planet-arc rising from below. The curve is a wider-than-viewport surface
   with an elliptical top radius; the footer fuses beneath it so the whole
   close reads as one continuous dark world.
   ========================================================================== */

export function CTABand(): React.JSX.Element {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative z-10 mt-24 overflow-hidden"
    >
      {/* The horizon — wider than the viewport so the arc stays shallow */}
      <div
        className="surface-dark relative left-1/2 w-[130vw] -translate-x-1/2 bg-void"
        style={{ borderRadius: "50% 50% 0 0 / 120px 120px 0 0" }}
      >
        {/* Ambient light cresting the horizon — one cobalt bloom, quiet grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgb(59_130_246/0.18)_0%,_transparent_65%)] blur-2xl"
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto w-[min(1180px,calc(100%-2rem))] px-2 pt-28 pb-16 sm:pt-32">
          <TextReveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-2xl">
                <motion.p variants={riseItem} className="machine-label mb-4">
                  Ninety seconds from now
                </motion.p>
                <motion.h2
                  variants={riseItem}
                  id="cta-heading"
                  className="text-display font-semibold tracking-tight text-balance text-ink"
                >
                  Stop guessing. Start{" "}
                  <span className="editorial text-lit-accent">testing.</span>
                </motion.h2>
                <motion.p
                  variants={riseItem}
                  className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink-secondary"
                >
                  Your next four weeks of creative testing, sequenced and
                  falsifiable — before you brief a single creator.
                </motion.p>
              </div>

              <motion.div variants={riseItem} className="shrink-0">
                <ButtonLink href="/analyze" variant="primary" size="lg">
                  Analyze my store
                  <ButtonChip>
                    <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                  </ButtonChip>
                </ButtonLink>
              </motion.div>
            </motion.div>
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
