"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import type { CreativeAngle, CreativeUniverse } from "@/types/creative-universe";
import type { AwarenessStage, TestingPriority } from "@/types/creative-universe";
import {
  FORMAT_LABELS,
  PRIORITY_STYLES,
  PRIORITY_WEIGHT,
  STAGE_LABELS,
  STAGE_ORDER,
} from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";
import { HypothesisPanel } from "@/components/dashboard/HypothesisPanel";

/* ============================================================================
   <AngleExplorer /> — the working surface for hypotheses.

   Not a card dump: a filterable, searchable board. Filter by funnel stage
   or priority, search across titles/hooks/audiences, click any card and
   its full working file opens in the side panel. The whole universe is
   here — nothing hidden behind "top 6".
   ========================================================================== */

const PRIORITIES: readonly TestingPriority[] = ["scale", "test", "iterate", "watch"];

export function AngleExplorer({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<AwarenessStage | null>(null);
  const [priority, setPriority] = useState<TestingPriority | null>(null);
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  const ranked = useMemo(
    () =>
      [...universe.angles].sort(
        (a, b) =>
          PRIORITY_WEIGHT[a.testingPriority] - PRIORITY_WEIGHT[b.testingPriority] ||
          b.score - a.score,
      ),
    [universe.angles],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((a) => {
      if (stage && a.awarenessStage !== stage) return false;
      if (priority && a.testingPriority !== priority) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.hook.toLowerCase().includes(q) ||
        a.targetAudience.toLowerCase().includes(q) ||
        a.emotion.toLowerCase().includes(q)
      );
    });
  }, [ranked, query, stage, priority]);

  const openAngle: CreativeAngle | null =
    ranked.find((a) => a.title === openTitle) ?? null;
  const openRank = openAngle ? ranked.indexOf(openAngle) + 1 : 0;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="angles-heading"
    >
      <motion.div variants={riseItem} className="mb-5">
        <h2 id="angles-heading" className="machine-label">
          04 · Creative hypotheses — {universe.angles.length} in this universe, click any to open its working file
        </h2>
        <p className="mt-2.5 max-w-3xl text-[13px] leading-relaxed text-ink-tertiary">
          <span className="font-medium text-ink-secondary">How to read this:</span>{" "}
          score (0–100) = the engine&apos;s confidence this beats what you run
          now. <span className="font-mono text-[11px] uppercase">Scale</span> =
          proven pattern, put money on it ·{" "}
          <span className="font-mono text-[11px] uppercase">Test</span> = high
          upside, unproven ·{" "}
          <span className="font-mono text-[11px] uppercase">Iterate</span> =
          refine after a winner ·{" "}
          <span className="font-mono text-[11px] uppercase">Watch</span> = save
          for later.
        </p>
      </motion.div>

      {/* Control rail — search + filters, Linear energy */}
      <motion.div
        variants={riseItem}
        className="mb-6 flex flex-wrap items-center gap-2 print:hidden"
      >
        <label className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-tertiary" strokeWidth={2.25} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hooks, audiences…"
            className="h-9 w-56 rounded-full border border-line bg-vault pr-4 pl-9 text-[13px] text-ink outline-none placeholder:text-ink-tertiary focus:border-accent/50"
          />
        </label>

        <span aria-hidden className="mx-1 h-5 w-px bg-line" />

        {STAGE_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(stage === s ? null : s)}
            className={cn(
              "h-9 cursor-pointer rounded-full border px-3.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors",
              stage === s
                ? "border-accent bg-accent-ghost text-accent-deep"
                : "border-line bg-vault text-ink-secondary hover:border-line-strong",
            )}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}

        <span aria-hidden className="mx-1 h-5 w-px bg-line" />

        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(priority === p ? null : p)}
            className={cn(
              "h-9 cursor-pointer rounded-full border px-3.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors",
              priority === p
                ? "border-accent bg-accent-ghost text-accent-deep"
                : "border-line bg-vault text-ink-secondary hover:border-line-strong",
            )}
          >
            {p}
          </button>
        ))}
      </motion.div>

      {/* The board */}
      {visible.length === 0 ? (
        <motion.p variants={riseItem} className="rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center text-sm text-ink-tertiary">
          Nothing matches — clear a filter or the search.
        </motion.p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((angle) => {
            const rank = ranked.indexOf(angle) + 1;
            return (
              <motion.button
                key={angle.title}
                variants={riseItem}
                type="button"
                onClick={() => setOpenTitle(angle.title)}
                className="group cursor-pointer rounded-[--radius-panel] border border-line bg-vault p-5 text-left shadow-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_20px_48px_-24px_rgb(8_102_255/0.3)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-data">
                    {String(rank).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-ink">
                      {angle.score}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${PRIORITY_STYLES[angle.testingPriority]}`}
                    >
                      {angle.testingPriority}
                    </span>
                  </span>
                </div>

                <h3 className="mt-3 text-[16px] leading-snug font-semibold text-ink group-hover:text-accent-deep">
                  {angle.title}
                </h3>

                <p className="editorial mt-2.5 line-clamp-2 text-[15px] leading-snug text-ink-secondary">
                  “{angle.hook}”
                </p>

                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="machine-label">{STAGE_LABELS[angle.awarenessStage]}</span>
                  <span className="machine-label">{FORMAT_LABELS[angle.format]}</span>
                </div>

                {/* Print-only full detail — exports stay complete */}
                <div className="hidden print:block">
                  <p className="mt-3 text-xs">{angle.statement}</p>
                  <p className="mt-1 text-xs">{angle.whyItWorks}</p>
                  <p className="mt-1 font-mono text-xs">Confirm if: {angle.prediction}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <HypothesisPanel
        angle={openAngle}
        rank={openRank}
        onClose={() => setOpenTitle(null)}
      />
    </motion.section>
  );
}
