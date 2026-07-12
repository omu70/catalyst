"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ============================================================================
   <Parallax /> — scroll-linked depth for any block.

   Elements at different `speed` values move at different rates while
   scrolling, creating layered depth. Positive speed drifts the element
   upward as it travels through the viewport; negative drifts downward
   (reads as "further away").

   Performance: transform-only (GPU), driven by framer's scroll spring-free
   transform — no scroll listeners of our own, no layout reads.
   Accessibility: renders static under prefers-reduced-motion.
   ========================================================================== */

/** Max translation in px at speed = 1. */
const PARALLAX_RANGE_PX = 96;

interface ParallaxProps {
  children: ReactNode;
  /** -1 (drifts down / far) … 1 (drifts up / near). Default 0.3. */
  speed?: number;
  className?: string;
}

export function Parallax({
  children,
  speed = 0.3,
  className,
}: ParallaxProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Track the element across its full journey through the viewport.
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [PARALLAX_RANGE_PX * speed, -PARALLAX_RANGE_PX * speed],
  );

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
