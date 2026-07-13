"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <StackDeck /> + <StackDeckCard /> — the Editions-style pinned card stack.

   Each card pins near the top of the viewport while the next one scrolls
   up and lands on top of it; covered cards recede — shrinking and dimming
   slightly — so the section reads as a physical deck being dealt upward.
   This is deliberately the loudest scroll choreography on the page.

   Mechanics: CSS `position: sticky` does the pinning (zero JS on the hot
   path); one shared scroll progress across the deck drives each covered
   card's scale/brightness through per-index transforms.

   Accessibility: under prefers-reduced-motion the cards render as a plain
   vertical list — full content, no pinning, no transforms.
   ========================================================================== */

/** How much a fully covered card shrinks. */
const COVERED_SCALE = 0.94;
/** Sticky offset from the viewport top, px. */
const PIN_TOP_PX = 112;
/** Extra offset per card so stacked top edges peek out, px. */
const PEEK_PX = 22;

interface StackDeckProps {
  children: ReactNode;
  className?: string;
}

interface StackDeckCardProps {
  children: ReactNode;
  /** Card position in the deck, 0-based. */
  index: number;
  /** Total cards in the deck. */
  total: number;
  /** Shared deck progress from useStackDeckProgress (parent's scroll). */
  progress: MotionValue<number>;
  className?: string;
}

/** Shared scroll progress across the whole deck container. */
export function useStackDeckProgress(): {
  ref: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return { ref, progress: scrollYProgress };
}

export function StackDeck({ children, className }: StackDeckProps): React.JSX.Element {
  return <div className={cn("relative", className)}>{children}</div>;
}

export function StackDeckCard({
  children,
  index,
  total,
  progress,
  className,
}: StackDeckCardProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  // This card's segment of the deck's journey: it is "covered" once the
  // NEXT card starts arriving, i.e. from the end of its own segment on.
  const segment = 1 / total;
  const coveredFrom = (index + 1) * segment;

  // Depth ramp: how many cards have landed on top of this one so far.
  const scale = useTransform(
    progress,
    [coveredFrom, Math.min(coveredFrom + segment, 1)],
    [1, COVERED_SCALE],
    { clamp: true },
  );
  const brightness = useTransform(
    progress,
    [coveredFrom, Math.min(coveredFrom + segment, 1)],
    [1, 0.82],
    { clamp: true },
  );
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  if (prefersReducedMotion) {
    return <div className={cn("mb-6", className)}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{
        position: "sticky",
        top: PIN_TOP_PX + index * PEEK_PX,
        // Later cards must paint above the ones they cover.
        zIndex: index + 1,
        // Scroll runway between arrivals — this gap is the animation time.
        marginBottom: index === total - 1 ? 0 : "38vh",
      }}
    >
      <motion.div style={{ scale, filter, transformOrigin: "top center" }}>
        {children}
      </motion.div>
    </div>
  );
}
