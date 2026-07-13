"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import type { CreativeAngle } from "@/types/creative-universe";
import {
  FORMAT_DIRECTIONS,
  FORMAT_LABELS,
  PRIORITY_STYLES,
  STAGE_LABELS,
} from "@/config/universe-ui";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { OutcomeTracker } from "@/components/dashboard/OutcomeTracker";

/* ============================================================================
   <HypothesisPanel /> — the Linear-style slide-over.

   Click a hypothesis anywhere → its complete working file slides in from
   the right: the claim, the psychology, the hook, the exact deliverable,
   a production checklist the shooter can follow line by line, the kill
   metric, and the outcome tracker. The report browses; this panel works.
   ========================================================================== */

/** Deterministic production checklist — derived from format, not the model. */
function checklist(angle: CreativeAngle): string[] {
  const steps = [
    `Write 3 hook variants (start from: “${angle.hook.slice(0, 60)}${angle.hook.length > 60 ? "…" : ""}”)`,
    `Produce: ${FORMAT_DIRECTIONS[angle.format]}`,
  ];
  if (angle.format.includes("video")) {
    steps.push(
      "Hook on screen + spoken inside the first 2 seconds",
      "Keep text overlays inside the vertical safe zone",
      "Export 9:16 master, then 4:5 crop + 1 still frame as image ad",
    );
  } else {
    steps.push(
      "One bold central visual — readable at thumbnail size",
      "Also export a 9:16 version with the hook as overlay",
    );
  }
  steps.push(
    "Launch under a Sales objective ad set",
    `Judge ONLY by: ${angle.prediction}`,
  );
  return steps;
}

interface HypothesisPanelProps {
  angle: CreativeAngle | null;
  rank: number;
  onClose: () => void;
}

export function HypothesisPanel({
  angle,
  rank,
  onClose,
}: HypothesisPanelProps): React.JSX.Element {
  // Escape closes — table stakes for a working tool.
  useEffect(() => {
    if (!angle) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [angle, onClose]);

  return (
    <AnimatePresence>
      {angle && (
        <>
          {/* Scrim */}
          <motion.button
            aria-label="Close hypothesis panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] cursor-default bg-ink/20 backdrop-blur-[2px] print:hidden"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-label={`Hypothesis: ${angle.title}`}
            initial={{ x: "104%" }}
            animate={{ x: 0 }}
            exit={{ x: "104%" }}
            transition={SPRING_SMOOTH}
            className="fixed inset-y-3 right-3 z-[80] flex w-[min(480px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[--radius-panel] border border-line bg-vault shadow-[0_48px_120px_-32px_rgb(17_18_19/0.4)] print:hidden"
          >
            {/* Header rail */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-data">
                  {String(rank).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm font-medium text-ink">
                  {angle.score}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${PRIORITY_STYLES[angle.testingPriority]}`}
                >
                  {angle.testingPriority}
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-tertiary transition-colors hover:bg-glass hover:text-ink"
              >
                <X className="size-4" strokeWidth={2.25} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-accent-ghost px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-accent-deep uppercase">
                  {STAGE_LABELS[angle.awarenessStage]}
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-ink-secondary uppercase">
                  {FORMAT_LABELS[angle.format]}
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-ink-tertiary uppercase">
                  {angle.emotion}
                </span>
              </div>

              <h2 className="mt-4 text-[22px] leading-snug font-semibold tracking-tight text-ink">
                {angle.title}
              </h2>

              <section className="mt-5">
                <p className="machine-label mb-1.5">The claim</p>
                <p className="text-sm leading-relaxed font-medium text-ink">
                  {angle.statement}
                </p>
              </section>

              <section className="mt-4">
                <p className="machine-label mb-1.5">Why it should work</p>
                <p className="text-sm leading-relaxed text-ink-secondary">
                  {angle.whyItWorks}
                </p>
              </section>

              <section className="mt-4">
                <p className="machine-label mb-1.5">Who sees it</p>
                <p className="text-sm leading-relaxed text-ink-secondary">
                  {angle.targetAudience}
                </p>
              </section>

              <blockquote className="editorial mt-5 border-l-2 border-accent pl-4 text-[18px] leading-snug text-ink">
                “{angle.hook}”
              </blockquote>

              <section className="mt-6">
                <p className="machine-label mb-2.5">Production checklist</p>
                <ol className="flex flex-col gap-2">
                  {checklist(angle).map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-secondary">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-void font-mono text-[10px] text-ink-tertiary">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>

              <p className="mt-6 rounded-xl bg-void px-4 py-3 font-mono text-xs leading-relaxed text-ink-secondary">
                Kill metric — confirm if: {angle.prediction}
              </p>

              <OutcomeTracker hypothesisTitle={angle.title} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
