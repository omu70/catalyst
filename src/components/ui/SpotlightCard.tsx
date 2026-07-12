"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <SpotlightCard /> — glass card with a cursor-following light.

   Technique: mousemove writes two CSS custom properties on the card; a
   pointer-events-none overlay paints a radial gradient at that position.
   Writing CSS vars avoids React re-renders entirely — the browser
   composites the gradient move, so this stays 60fps on any card count.
   Touch devices simply never fire the effect.
   ========================================================================== */

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Spotlight tint. Blue by default; violet available for variety. */
  tint?: "accent" | "aura";
}

const TINTS: Record<NonNullable<SpotlightCardProps["tint"]>, string> = {
  accent: "rgb(59 130 246 / 0.14)",
  aura: "rgb(139 92 246 / 0.13)",
};

export function SpotlightCard({
  children,
  className,
  tint = "accent",
}: SpotlightCardProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>): void {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    el.style.setProperty("--spot-alpha", "1");
  }

  function handleMouseLeave(): void {
    ref.current?.style.setProperty("--spot-alpha", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("group/spot relative overflow-hidden", className)}
    >
      {/* The light — composited gradient, fades in/out via --spot-alpha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-alpha, 0)" as unknown as number,
          background: `radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${TINTS[tint]}, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
