"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <LeafCard /> — the overleaf entrance.

   Cards begin tilted away in 3D (rotateX, hinged at the top edge, like the
   next page of a book) and turn flat as they travel into view — scrubbed
   to scroll position, so the motion is reversible and feels physically
   attached to the page, not a one-shot animation.

   Performance: transform + opacity only, driven by framer's scroll
   progress (no scroll listeners of our own). Reduced motion renders flat.
   ========================================================================== */

/** Tilt at entry, in degrees — a clearly visible page-turn. */
const LEAF_TILT_DEG = 34;
/** Rise distance in px while turning flat — the upward stack motion. */
const LEAF_RISE_PX = 120;
/** Cards start slightly small and grow flat — sells the depth. */
const LEAF_SCALE_FROM = 0.92;

interface LeafCardProps {
  children: ReactNode;
  className?: string;
  /** Optional stagger: shifts the finish line slightly per column. */
  index?: number;
}

export function LeafCard({
  children,
  className,
  index = 0,
}: LeafCardProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Start turning when the card's top enters the viewport bottom;
    // finish near the vertical center, so the turn plays across a long,
    // clearly visible stretch of scroll. Small per-index offset staggers
    // columns without JS timers.
    offset: ["start end", `start ${0.45 - Math.min(index, 3) * 0.04}`],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [-LEAF_TILT_DEG, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [LEAF_RISE_PX, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [LEAF_SCALE_FROM, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.9, 1]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn("h-full", className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className="h-full [perspective:1200px]">
      <motion.div
        style={{
          rotateX,
          y,
          scale,
          opacity,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
