"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ============================================================================
   <TextReveal /> — the Editions-style dim→bright scrub.

   Content enters the viewport dim and slightly low, then brightens to full
   presence as it climbs toward the upper-middle band — scrubbed to scroll,
   so walking back down the page re-dims it. Shopify Editions applies this
   to nearly every text block; it is what makes the page feel lit by the
   reader's attention.

   Composes safely around variant-driven children: no `animate` prop here,
   so parent stagger variants keep propagating through.
   ========================================================================== */

interface TextRevealProps {
  children: ReactNode;
  className?: string;
}

export function TextReveal({
  children,
  className,
}: TextRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Fully dim at the viewport bottom; fully lit by the upper-middle.
    offset: ["start 0.98", "start 0.55"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.16, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [26, 0]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}
