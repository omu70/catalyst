"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

import { useStrategyStore } from "@/store/strategy-store";
import { SPRING_CINEMATIC, SPRING_SMOOTH } from "@/lib/motion/springs";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { InputEngine } from "@/components/dashboard/InputEngine";
import { EngineStatus } from "@/components/dashboard/EngineStatus";
import { ErrorPanel } from "@/components/dashboard/ErrorPanel";
import { UnderstandingCards } from "@/components/dashboard/UnderstandingCards";
import { CreativeMatrix } from "@/components/dashboard/CreativeMatrix";
import { AngleCards } from "@/components/dashboard/AngleCards";
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

export function AnalyzeView(): React.JSX.Element {
  const status = useStrategyStore((s) => s.status);
  const universe = useStrategyStore((s) => s.universe);
  const reset = useStrategyStore((s) => s.reset);

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
                  Creative Universe · generated
                </p>
                <h1 className="text-display font-semibold tracking-tight text-ink">
                  Your next winning ad is{" "}
                  <span className="editorial text-lit-accent">in here.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-secondary">
                  {universe.executiveSummary}
                </p>
              </div>
              <Button variant="glass" size="md" onClick={reset} className="shrink-0">
                <RotateCcw className="size-4" strokeWidth={2.25} />
                New analysis
              </Button>
            </header>

            {/* Dashboard sections — alternating parallax speeds for depth */}
            <div className="flex flex-col gap-20">
              <Parallax speed={0.12}>
                <UnderstandingCards understanding={universe.productUnderstanding} />
              </Parallax>
              <Parallax speed={0.2}>
                <CreativeMatrix universe={universe} />
              </Parallax>
              <Parallax speed={0.12}>
                <AngleCards universe={universe} />
              </Parallax>
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
