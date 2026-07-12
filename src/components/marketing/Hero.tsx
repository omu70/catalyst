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
import { ArrowRight, Sparkles } from "lucide-react";

import { HERO_METRICS, SITE } from "@/config/site";
import { popItem, riseItem, staggerContainer } from "@/lib/motion/variants";
import { ButtonLink } from "@/components/ui/Button";
import { Parallax } from "@/components/motion/Parallax";
import { StrategyConsole } from "@/components/marketing/StrategyConsole";

gsap.registerPlugin(SplitText, useGSAP);

/* ============================================================================
   <Hero /> — the opening statement.

   NORTH STAR: a skeptical senior media buyer must feel, within one glance,
   that this is a precision instrument that already knows their next winning
   ad. Message = certainty. Hierarchy: promise (headline) → proof (console
   artifact) → action (CTA). Everything else is atmosphere.

   Motion architecture (two engines, strict roles):
   - GSAP + SplitText → the headline: masked line-by-line reveal. Typography
     choreography is GSAP's home turf.
   - Framer Motion    → everything else: declarative variants shared with
     the rest of the product.
   Both respect prefers-reduced-motion.
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

  /*
   * Scroll-scrub recede: as the hero scrolls out, it softly fades, shrinks,
   * and lifts — the page feels like layered sheets rather than one flat
   * scroll. GPU transforms only; disabled under reduced motion.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -48]);

  /*
   * Masked line reveal: SplitText slices the h1 into lines, each wrapped in
   * an overflow-clipped parent; lines rise from below their mask. The h1
   * starts at opacity-0 (CSS class) to prevent any flash-of-unsplit-text,
   * and GSAP lifts it the same frame the split completes.
   */
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
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pt-40 pb-24 lg:pt-44"
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: heroOpacity, scale: heroScale, y: heroY }
        }
        className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10"
      >
        {/* ————— Left: the promise ————— */}
        <div className="lg:col-span-7">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow — machine voice sets the instrument tone */}
            <motion.div variants={popItem}>
              <span className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
                <span className="animate-beacon size-1.5 rounded-full bg-accent" />
                <span className="machine-label text-ink-secondary">
                  Creative Intelligence · Meta Ads
                </span>
              </span>
            </motion.div>
          </motion.div>

          {/* Headline — GSAP masked reveal. Serif italics carry the
              editorial voice on the two words that sell certainty. */}
          <h1
            ref={headlineRef}
            className="mt-8 max-w-2xl text-display font-semibold tracking-tight text-ink opacity-0 md:text-display-xl"
          >
            Know your next winning ad{" "}
            <span className="editorial text-lit-accent">before</span> you spend a{" "}
            <span className="editorial text-data-bright">dollar.</span>
          </h1>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Sub — the mechanism, one breath */}
            <motion.p
              variants={riseItem}
              className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-ink-secondary"
            >
              {SITE.description}
            </motion.p>

            {/* CTAs — one high-emphasis action, one curiosity path */}
            <motion.div
              variants={riseItem}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href="/analyze" variant="primary" size="lg">
                <Sparkles className="size-4" strokeWidth={2.25} />
                Analyze my store
              </ButtonLink>
              <ButtonLink href="#process" variant="glass" size="lg">
                See the methodology
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>

        {/* ————— Right: the proof — rides its own parallax depth ————— */}
        <div className="lg:col-span-5">
          <Parallax speed={-0.18}>
            <StrategyConsole />
          </Parallax>
        </div>
      </motion.div>

      {/* ————— Telemetry strip — outcome proof in machine voice ————— */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-24"
      >
        <motion.div variants={riseItem} className="hairline-x mb-9" />
        <motion.dl
          variants={riseItem}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1.5">
              <dd className="order-1 font-mono text-3xl font-medium tracking-tight text-ink">
                {metric.value}
              </dd>
              <dt className="machine-label order-2">{metric.label}</dt>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
