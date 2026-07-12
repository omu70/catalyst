import type { Transition } from "framer-motion";

/**
 * Motion physics constants — the single vocabulary of movement in Catalyst.
 *
 * Rule: components never inline spring numbers. They import a named physics
 * profile, so the entire product's motion character can be retuned here.
 * All profiles are spring-based (no duration/ease pairs for interactive
 * motion) because springs interrupt and re-target gracefully mid-gesture.
 */

/** Standard UI response — panels, cards, list items entering. */
export const SPRING_SMOOTH: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.9,
} as const;

/** Snappy — buttons, toggles, small controls. Fast settle, no wobble. */
export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 480,
  damping: 38,
  mass: 0.6,
} as const;

/** Cinematic — hero elements, page-level transitions. Long, weighty settle. */
export const SPRING_CINEMATIC: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 26,
  mass: 1.1,
} as const;

/** Stagger cadence (seconds) for orchestrated group reveals. */
export const STAGGER_CHILDREN = 0.07 as const;

/** Delay before the hero sequence begins — lets the WebGL field paint first. */
export const HERO_SEQUENCE_DELAY = 0.15 as const;
