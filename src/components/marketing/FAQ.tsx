"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <FAQ /> — the questions a skeptical media buyer actually asks, answered
   honestly. Accordion with height-animated reveals (GPU-safe: the panel
   animates height via layout spring on a small element count).
   ========================================================================== */

const ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Is this another AI ad generator?",
    a: "No — Catalyst never writes finished ads or generates images. It produces creative strategy: falsifiable hypotheses about which message will win for which audience, with the reasoning, format, and success metric for each. Your team (or your AI tools) executes the creative; Catalyst decides what's worth making.",
  },
  {
    q: "Where does the intelligence come from?",
    a: "Three places: your inputs (product, audience), your actual storefront — we read your public product catalog automatically — and, where enabled, live competitor ads from the Meta Ad Library. A strategist framework (jobs-to-be-done, awareness stages, objection mapping) turns that into ranked hypotheses.",
  },
  {
    q: "How is this different from asking ChatGPT?",
    a: "Structure and falsifiability. Every hypothesis must name what beats what, for whom, why, and the metric that proves it — enforced by schema, not vibes. Plus Catalyst reads your real store data, and when you mark test outcomes, it accumulates knowledge of what actually works that a chat thread never retains.",
  },
  {
    q: "What does it cost?",
    a: "It's free during beta, no card required. Pro (team workspaces, competitor intelligence on every run, performance analytics) is coming; beta users keep preferred pricing.",
  },
  {
    q: "What happens to the data I enter?",
    a: "It's used to generate your strategy and, if you're signed in, saved to your private history — protected so only your account can read it. We don't sell data or share it with advertisers. Details in the privacy policy.",
  },
] as const;

export function FAQ(): React.JSX.Element {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] scroll-mt-28 pb-28"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <motion.p variants={riseItem} className="machine-label mb-4">
            Questions
          </motion.p>
          <motion.h2
            variants={riseItem}
            id="faq-heading"
            className="text-display font-semibold tracking-tight text-ink"
          >
            Asked by every{" "}
            <span className="editorial text-lit-accent">skeptic.</span>
          </motion.h2>
        </div>

        <motion.div variants={riseItem} className="flex flex-col lg:col-span-8">
          {ITEMS.map((item, i) => (
            <div key={item.q} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[16px] font-medium text-ink">
                  {item.q}
                </span>
                <Plus
                  className={cn(
                    "size-4 shrink-0 text-ink-tertiary transition-transform duration-300",
                    open === i && "rotate-45",
                  )}
                  strokeWidth={2.25}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 34 }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-secondary">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
