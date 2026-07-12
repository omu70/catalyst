"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* ============================================================================
   <SmoothScroll /> — inertial scrolling for the whole document.

   Lenis interpolates the scroll position each frame, which is what makes
   parallax layers, whileInView reveals, and scroll-scrub effects feel
   liquid instead of stepped. Mounted once in the root layout; renders
   nothing.

   - Respects prefers-reduced-motion: native scrolling is left untouched.
   - Anchor links (#process) are routed through Lenis for eased travel.
   ========================================================================== */

/** Interpolation factor per frame — lower = heavier, more cinematic. */
const LENIS_LERP = 0.1;

export function SmoothScroll(): null {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      anchors: true, // eased in-page anchor navigation
    });

    let frame: number;
    const raf = (time: number): void => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
