"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { SITE } from "@/config/site";
import { popItem, riseItem, staggerContainer } from "@/lib/motion/variants";
import { ButtonChip, ButtonLink } from "@/components/ui/Button";

gsap.registerPlugin(SplitText, useGSAP);

/* ============================================================================
   <Hero /> — split-editorial opening, per the reference language:
   enormous tight display type anchored left, supporting paragraph + CTAs
   offset right and baseline-aligned. The product itself follows immediately
   below in <ProductFrame /> — the hero sells the promise, the frame proves it.

   Motion: GSAP masked line reveal on the headline; Framer variants for the
   rest; scroll-scrub recede as the section leaves. Reduced-motion safe.
   ========================================================================== */

/** GSAP timing constants — headline choreography only. */
const HEADLINE_REVEAL = {
  DURATION: 1.1,
  STAGGER: 0.09,
  DELAY: 0.25,
  EASE: "expo.out",
} as const;

export function Hero(): React.JSX.Element {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* Scroll-scrub recede — the page feels like layered sheets. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  /* Masked line reveal (see Phase 1 notes) — h1 hidden until split. */
  useGSAP(
    () => {
      const headline = headlineRef.current;
      if (!headline) return;

      if (prefersReducedMotion) {
        gsap.set(headline, { opacity: 1 });
        return;
      }

      const split = SplitText.create(headline, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      gsap.set(headline, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: HEADLINE_REVEAL.DURATION,
        stagger: HEADLINE_REVEAL.STAGGER,
        delay: HEADLINE_REVEAL.DELAY,
        ease: HEADLINE_REVEAL.EASE,
      });
    },
    { dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pt-40 pb-16 lg:pt-44"
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: heroOpacity, scale: heroScale, y: heroY }
        }
        className="grid items-end gap-10 lg:grid-cols-12"
      >
        {/* ————— Left: the promise, at reference scale ————— */}
        <div className="lg:col-span-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={popItem}>
              <span className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
                <span className="animate-beacon size-1.5 rounded-full bg-accent" />
                <span className="machine-label text-ink-secondary">
                  Creative Intelligence · Meta Ads
                </span>
              </span>
            </motion.div>
          </motion.div>

          <h1
            ref={headlineRef}
            className="mt-8 text-display font-semibold tracking-tight text-ink opacity-0 md:text-display-xl"
          >
            Know your next winning ad{" "}
            <span className="editorial text-lit-accent">before</span> you
            spend a <span className="editorial text-lit-data">dollar.</span>
          </h1>
        </div>

        {/* ————— Right: the mechanism + action, baseline-offset ————— */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 lg:col-span-4 lg:pb-2"
        >
          <motion.p
            variants={riseItem}
            className="text-[17px] leading-relaxed text-pretty text-ink-secondary"
          >
            {SITE.description}
          </motion.p>

          <motion.div variants={riseItem} className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/analyze" variant="primary" size="lg">
              Analyze my store
              <ButtonChip>
                <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
              </ButtonChip>
            </ButtonLink>
            <ButtonLink href="#process" variant="glass" size="lg">
              The methodology
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
