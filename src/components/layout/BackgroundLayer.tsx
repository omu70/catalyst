"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

/* ============================================================================
   <BackgroundLayer /> — the fixed atmosphere. IMMERSIVE INTELLIGENCE:
   a rich near-black void lit by two ambient radial glows (blue + violet at
   ~15% opacity), a scroll-reactive WebGL particle field, an engineering
   grid, cinematic grain, and a vignette.

   Accessibility: prefers-reduced-motion removes the WebGL layer and (via
   globals.css) freezes ambient drift — identical brand, zero motion.
   Performance: Three.js is code-split (ssr:false); glows are transform-only.
   ========================================================================== */

const IntelligenceField = dynamic(
  () => import("@/components/three/IntelligenceField"),
  { ssr: false, loading: () => null },
);

export function BackgroundLayer(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* 1 · Washes — near-neutral atmosphere on the light canvas: one
             whisper of cobalt (the pop budget), one graphite shadow wash,
             and a sheet of daylight. */}
      <div className="animate-beam absolute top-[14%] left-1/2 h-[46vh] w-[160vw] -translate-x-1/2 -rotate-6 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(37_99_235/0.06)_0%,_rgb(37_99_235/0.02)_45%,_transparent_70%)] blur-2xl" />
      <div className="animate-beam-slow absolute top-[55%] left-[60%] h-[36vh] w-[120vw] -translate-x-1/2 rotate-3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_rgb(17_18_19/0.04)_0%,_transparent_65%)] blur-2xl" />
      <div className="absolute -top-[10%] left-1/2 h-[45vh] w-[130vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgb(255_255_255/0.8)_0%,_transparent_70%)]" />

      {/* 2 · WebGL field — scroll-reactive; skipped under reduced motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-80">
          <IntelligenceField />
        </div>
      )}

      {/* 3 · Engineering grid — masked toward the content column */}
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_45%_40%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(17 18 19 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 18 19 / 0.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* 4 · Cinematic grain — static (see globals.css for rationale) */}
      <div className="grain absolute inset-0" />

      {/* 5 · Vignette — focuses luminance toward the content column */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_45%_35%,_transparent_45%,_rgb(17_18_19/0.06)_100%)]" />
    </div>
  );
}
