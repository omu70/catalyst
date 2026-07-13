"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/* ============================================================================
   <ScrollProgress /> — the thin accent beam that tracks reading position.

   A fixed 2px bar across the top of the viewport whose width follows the
   document's scroll progress through a spring, so it glides rather than
   steps. An always-on, unmistakable cue that the page is scroll-reactive.
   ========================================================================== */

export function ScrollProgress(): React.JSX.Element | null {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.6,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent print:hidden"
    />
  );
}
