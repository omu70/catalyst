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
      {/* 1 · Forge beams — wide, blurred horizontal light streaks.
             The ember beam rakes across the upper third (the "heat line");
             a fainter brass beam grounds the lower right. Oversized so the
             drift animation never exposes an edge. */}
      <div className="animate-forge absolute top-[16%] left-1/2 h-[42vh] w-[160vw] -translate-x-1/2 -rotate-6 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(255_92_31/0.12)_0%,_rgb(255_92_31/0.04)_45%,_transparent_70%)] blur-2xl" />
      <div className="animate-forge-slow absolute top-[55%] left-[60%] h-[36vh] w-[120vw] -translate-x-1/2 rotate-3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(201_169_110/0.07)_0%,_transparent_65%)] blur-2xl" />
      {/* Warm floor glow — grounds the composition */}
      <div className="absolute -bottom-[20%] left-1/2 h-[50vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgb(26_23_18/0.9)_0%,_transparent_70%)]" />

      {/* 2 · WebGL mote field — skipped entirely under reduced motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-70">
          <IntelligenceField />
        </div>
      )}

      {/* 3 · Machined grid — engineering ruling, masked toward the canvas
             center-left where the headline sits */}
      <div
        className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_45%_40%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(244 239 228 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(244 239 228 / 0.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* 4 · Film grain — static (see globals.css for rationale) */}
      <div className="grain absolute inset-0" />

      {/* 5 · Vignette — pulls the eye to the content column */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_45%_35%,_transparent_30%,_rgb(11_10_8/0.88)_100%)]" />
    </div>
  );
}
