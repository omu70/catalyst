import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { AnalyzeView } from "@/components/dashboard/AnalyzeView";

/* ============================================================================
   /analyze — the product. Server shell; all interactivity lives in the
   client orchestrator so the RSC payload stays minimal.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Analyze",
  description:
    "Feed Catalyst your product and audience — get your Creative Universe: angles, gaps, and a 4-week Meta testing roadmap.",
};

export default function AnalyzePage(): React.JSX.Element {
  return (
    /*
     * The product surface is cinematic-dark (reference pattern: light
     * marketing canvas, dark instrument). `.surface-dark` re-themes every
     * token below; the opaque bg-void covers the light atmosphere layer.
     */
    <main className="surface-dark relative z-10 min-h-svh bg-void">
      <Navbar />
      <AnalyzeView />
    </main>
  );
}
