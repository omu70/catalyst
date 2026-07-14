"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Printer, RotateCcw } from "lucide-react";

import type { CreativeUniverse } from "@/types/creative-universe";
import { useStrategyStore } from "@/store/strategy-store";
import { SPRING_CINEMATIC, SPRING_SMOOTH } from "@/lib/motion/springs";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { InputEngine } from "@/components/dashboard/InputEngine";
import { EngineStatus } from "@/components/dashboard/EngineStatus";
import { ErrorPanel } from "@/components/dashboard/ErrorPanel";
import { UnderstandingCards } from "@/components/dashboard/UnderstandingCards";
import { StartHere } from "@/components/dashboard/StartHere";
import { CommandBrief } from "@/components/dashboard/CommandBrief";
import { MarketRead } from "@/components/dashboard/MarketRead";
import { CompetitorInsights } from "@/components/dashboard/CompetitorInsights";
import { AngleExplorer } from "@/components/dashboard/AngleExplorer";
import { TestingQuadrant } from "@/components/dashboard/TestingQuadrant";
import { CreativeMatrix } from "@/components/dashboard/CreativeMatrix";
import { TestingRoadmap } from "@/components/dashboard/TestingRoadmap";

/* ============================================================================
   <AnalyzeView /> — the flow orchestrator: idle → loading → error | success.

   One state machine (the store), one AnimatePresence, layered layout
   transitions between phases. Success renders the full intelligence
   dashboard with scroll-parallax depth between sections.
   ========================================================================== */

const PHASE_TRANSITION = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
} as const;

interface AnalyzeViewProps {
  /** A saved analysis loaded server-side (from /history), hydrated once. */
  savedUniverse?: CreativeUniverse | null;
  savedAnalysisId?: string | null;
}

export function AnalyzeView({
  savedUniverse = null,
  savedAnalysisId = null,
}: AnalyzeViewProps): React.JSX.Element {
  const status = useStrategyStore((s) => s.status);
  const universe = useStrategyStore((s) => s.universe);
  const isSample = useStrategyStore((s) => s.isSample);
  const input = useStrategyStore((s) => s.input);
  const reset = useStrategyStore((s) => s.reset);

  // Agency reality: reports get compared across clients — every report
  // must say WHAT was analyzed and WHEN, on screen and in the PDF export.
  const brandLabel = isSample
    ? "Sample report · fictional cookware brand"
    : input
      ? `${input.productDetails.slice(0, 64).trim()}${input.productDetails.length > 64 ? "…" : ""}`
      : "Creative Universe";
  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Hydrate a saved analysis exactly once (history → revisit flow).
  useEffect(() => {
    if (savedUniverse) {
      useStrategyStore.setState({
        status: "success",
        universe: savedUniverse,
        analysisId: savedAnalysisId,
        isSample: false,
        error: null,
      });
    }
  }, [savedUniverse, savedAnalysisId]);

  return (
    <div className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pt-36 pb-24">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" {...PHASE_TRANSITION} transition={SPRING_SMOOTH}>
            <header className="mx-auto mb-10 max-w-2xl text-center">
              <h1 className="text-display font-semibold tracking-tight text-ink">
                Run the <span className="editorial text-lit-accent">engine.</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-secondary">
                Three inputs. Ninety seconds. A complete creative strategy your
                media buyer can execute Monday morning.
              </p>
            </header>
            <InputEngine />
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div key="loading" {...PHASE_TRANSITION} transition={SPRING_SMOOTH} className="pt-16">
            <EngineStatus />
          </motion.div>
        )}

        {status === "error" && (
          <motion.div key="error" {...PHASE_TRANSITION} transition={SPRING_SMOOTH} className="pt-16">
            <ErrorPanel />
          </motion.div>
        )}

        {status === "success" && universe && (
          <motion.div key="success" {...PHASE_TRANSITION} transition={SPRING_CINEMATIC}>
            {/* Verdict header */}
            <header className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="machine-label mb-3">
                  {brandLabel} · {generatedOn}
                </p>
                <h1 className="text-display font-semibold tracking-tight text-ink">
                  Your next winning ad is{" "}
                  <span className="editorial text-lit-accent">in here.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-secondary">
                  {universe.executiveSummary}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 print:hidden">
                <Button
                  variant="glass"
                  size="md"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" strokeWidth={2.25} />
                  Export brief
                </Button>
                <Button variant="glass" size="md" onClick={reset}>
                  <RotateCcw className="size-4" strokeWidth={2.25} />
                  New analysis
                </Button>
              </div>
            </header>

            {/* Dashboard sections — alternating parallax speeds for depth */}
            <div className="flex flex-col gap-20">
              <CommandBrief universe={universe} />
              <StartHere universe={universe} />
              <TestingQuadrant universe={universe} />
              <Parallax speed={0.12}>
                <UnderstandingCards understanding={universe.productUnderstanding} />
              </Parallax>
              <Parallax speed={0.16}>
                <MarketRead universe={universe} />
              </Parallax>
              <Parallax speed={0.2}>
                <CreativeMatrix universe={universe} />
              </Parallax>
              {universe.competitorInsights ? (
                <Parallax speed={0.12}>
                  <CompetitorInsights insights={universe.competitorInsights} />
                </Parallax>
              ) : null}
              <AngleExplorer universe={universe} />
              <Parallax speed={0.2}>
                <TestingRoadmap universe={universe} />
              </Parallax>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
