"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

import { LeafCard } from "@/components/motion/LeafCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { ButtonChip, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   <Pricing /> — honest beta pricing. No fake tiers, no fake anchors:
   the product is free during beta (we're collecting learning-loop data),
   and Pro is announced, not sold. Stripe arrives when Pro does.
   ========================================================================== */

const FREE_FEATURES = [
  "Full Creative Universe per analysis",
  "6–12 falsifiable hypotheses with hooks & kill-metrics",
  "Live store reading (products.json)",
  "4-week testing roadmap + PDF export",
  "Saved history & outcome tracking with sign-in",
] as const;

const PRO_FEATURES = [
  "Competitor ad intelligence on every run",
  "Team workspaces for agencies",
  "Hypothesis performance analytics",
  "Priority generation & higher limits",
] as const;

export function Pricing(): React.JSX.Element {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] scroll-mt-28 pb-24"
    >
      <TextReveal>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 max-w-2xl"
      >
        <motion.p variants={riseItem} className="machine-label mb-4">
          Pricing
        </motion.p>
        <motion.h2
          variants={riseItem}
          id="pricing-heading"
          className="text-display font-semibold tracking-tight text-balance text-ink"
        >
          Free while in <span className="editorial text-lit-accent">beta.</span>
        </motion.h2>
        <motion.p
          variants={riseItem}
          className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-secondary"
        >
          Every analysis is free right now — we&apos;re earning the right to
          charge by proving the strategies win. Early users keep preferred
          pricing when Pro launches.
        </motion.p>
      </motion.div>
      </TextReveal>

      <div className="grid gap-5 md:grid-cols-2">
        <LeafCard index={0}>
          <article className="glass-panel flex h-full flex-col rounded-[--radius-panel] p-8 ring-1 ring-accent/30">
            <div className="flex items-baseline justify-between">
              <h3 className="text-title font-semibold text-ink">Beta</h3>
              <p className="font-mono text-3xl font-medium tracking-tight text-ink">
                $0
              </p>
            </div>
            <p className="machine-label mt-1">Available now · no card required</p>
            <ul className="mt-6 flex flex-col gap-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <ButtonLink href="/analyze" variant="primary" size="lg" className="w-full sm:w-auto">
                Start free
                <ButtonChip>
                  <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                </ButtonChip>
              </ButtonLink>
            </div>
          </article>
        </LeafCard>

        <LeafCard index={1}>
          <article className="glass-panel flex h-full flex-col rounded-[--radius-panel] p-8 opacity-90">
            <div className="flex items-baseline justify-between">
              <h3 className="text-title font-semibold text-ink">Pro</h3>
              <span className="rounded-full bg-data-ghost px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-data uppercase">
                Coming soon
              </span>
            </div>
            <p className="machine-label mt-1">For teams & agencies</p>
            <ul className="mt-6 flex flex-col gap-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-ink-faint" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-sm text-ink-tertiary">
              Use the beta today — your account carries over.
            </p>
          </article>
        </LeafCard>
      </div>
    </section>
  );
}
