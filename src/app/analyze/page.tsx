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
    <main>
      <Navbar />
      <AnalyzeView />
    </main>
  );
}
