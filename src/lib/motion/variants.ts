import type { Variants } from "framer-motion";

import {
  HERO_SEQUENCE_DELAY,
  SPRING_CINEMATIC,
  SPRING_SMOOTH,
  STAGGER_CHILDREN,
} from "@/lib/motion/springs";

/**
 * Shared framer-motion variants — declarative motion grammar for Catalyst.
 *
 * Naming convention:
 *   *Container → orchestrates children via staggerChildren
 *   *Item      → consumed by children of a container (inherits timing)
 *
 * All variants animate ONLY transform + opacity + filter(blur) — properties
 * the compositor can handle off the main thread. Never animate width, height,
 * top/left, or box-shadow here.
 */

/** Orchestrator for staggered group reveals (hero, card grids, nav). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: HERO_SEQUENCE_DELAY,
    },
  },
};

/** Child: rise + settle. The default entrance for text and cards. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING_SMOOTH },
};

/** Child: cinematic rise with de-blur — reserved for display headlines. */
export const heroRiseItem: Variants = {
  hidden: { opacity: 0, y: 44, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: SPRING_CINEMATIC,
  },
};

/** Child: scale-settle — for pills, badges, and small chrome. */
export const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: SPRING_SMOOTH },
};

/** Top navigation drop-in — plays once on mount, independent of scroll. */
export const navReveal: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: SPRING_SMOOTH },
};
