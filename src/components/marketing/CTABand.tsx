"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { ButtonChip, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   <CTABand /> — the black closing statement (the 30%).

   Page rhythm: white open → dark product frame → white methodology → BLACK
   close. Inside `.surface-dark` the ink token flips, so the primary pill
   automatically renders white-on-black — the FoF/ElevenLabs closing move.
   ========================================================================== */

export function CTABand(): React.JSX.Element {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 140, damping: 26 }}
        className="surface-dark relative overflow-hidden rounded-[2rem] bg-void px-8 py-16 sm:px-14 sm:py-20"
      >
        {/* Ambient light — one cobalt bloom, quiet grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/2 left-1/3 h-[420px] w-[680px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgb(59_130_246/0.16)_0%,_transparent_65%)] blur-2xl"
        />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
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
      </motion.div>
    </section>
  );
}
