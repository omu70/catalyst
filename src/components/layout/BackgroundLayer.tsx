"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

/* ============================================================================
   <BackgroundLayer /> — the fixed, layered atmosphere behind all content.
   Art direction: MOLTEN OBSIDIAN — a machine shop at night, not outer space.

   Compositing stack (back → front):
     1. Forge beams        — two wide horizontal light streaks (ember/brass)
     2. WebGL mote field   — <IntelligenceField />, client-only chunk
     3. Machined grid      — faint engineering ruling, radially masked
     4. Film grain         — static SVG noise (kills gradient banding)
     5. Vignette           — focuses luminance toward the content column

   Accessibility: prefers-reduced-motion removes the WebGL layer and (via
   globals.css) freezes the beam drift — identical brand, zero motion.

   Performance: Three.js is code-split via next/dynamic (ssr:false) so it
   never blocks first paint and never enters the server bundle.
   ========================================================================== */

const IntelligenceField = dynamic(
  () => import("@/components/three/IntelligenceField"),
  {
    ssr: false,
    // No placeholder — the beam layer already fills the frame; the motes
    // simply fade in when their chunk resolves.
    loading: () => null,
  },
);

export function BackgroundLayer(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* 1 · Washes — 70/20/10 discipline: the atmosphere is near-neutral.
             One whisper of emerald (the color budget), one graphite shadow
             wash, and a sheet of daylight. Oversized so drift never exposes
             an edge. */}
      <div className="animate-beam absolute top-[14%] left-1/2 h-[46vh] w-[160vw] -translate-x-1/2 -rotate-6 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(14_159_110/0.05)_0%,_rgb(14_159_110/0.02)_45%,_transparent_70%)] blur-2xl" />
      <div className="animate-beam-slow absolute top-[55%] left-[60%] h-[36vh] w-[120vw] -translate-x-1/2 rotate-3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(17_18_19/0.04)_0%,_transparent_65%)] blur-2xl" />
      {/* Bright ceiling — a sheet of daylight that lifts the top of the page */}
      <div className="absolute -top-[10%] left-1/2 h-[45vh] w-[130vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgb(255_255_255/0.8)_0%,_transparent_70%)]" />

      {/* 2 · WebGL mote field — skipped entirely under reduced motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-70">
          <IntelligenceField />
        </div>
      )}

      {/* 3 · Machined grid — engineering ruling, masked toward the canvas
             center-left where the headline sits */}
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_45%_40%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(17 18 19 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 18 19 / 0.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* 4 · Film grain — static (see globals.css for rationale) */}
      <div className="grain absolute inset-0" />

      {/* 5 · Paper vignette — a soft darkening at the frame edges that pulls
             the eye to the content column without reading as "dark mode" */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_45%_35%,_transparent_45%,_rgb(17_18_19/0.06)_100%)]" />
    </div>
  );
}
