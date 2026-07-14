"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { CreativeAngle, CreativeUniverse } from "@/types/creative-universe";
import type { CreativeFormat } from "@/types/creative-universe";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <TestingQuadrant /> — the decision picture.

   Effort (x) × confidence (y): every hypothesis plotted where a media
   buyer's instinct puts it. Top-left = quick wins (shoot first), top-right
   = big bets, bottom-left = cheap fillers, bottom-right = skip for now.
   Effort is derived deterministically from format; confidence is the score.
   One accent hue for marks (magnitude ≠ rainbow); text wears ink.
   ========================================================================== */

/** Production effort per format, 1 (phone, an afternoon) → 10 (crew day). */
const FORMAT_EFFORT: Record<CreativeFormat, number> = {
  "meme-static": 1,
  "static-image": 2,
  "comparison-static": 3,
  carousel: 4,
  "ugc-video": 5,
  "testimonial-video": 6,
  "demo-video": 7,
  "founder-video": 8,
};

const W = 900;
const H = 460;
const PAD = { top: 28, right: 24, bottom: 44, left: 46 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

/** Score domain — creative scores live in the upper half in practice. */
const Y_MIN = 40;
const Y_MAX = 100;

function x(effort: number): number {
  return PAD.left + ((effort - 0.5) / 9.5) * PLOT_W;
}
function y(score: number): number {
  const clamped = Math.max(Y_MIN, Math.min(Y_MAX, score));
  return PAD.top + (1 - (clamped - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
}

export function TestingQuadrant({
  universe,
}: {
  universe: CreativeUniverse;
}): React.JSX.Element {
  const [hovered, setHovered] = useState<string | null>(null);

  // Deterministic collision nudge: same (format, ~score) dots fan out.
  const seen = new Map<string, number>();
  const points = universe.angles.map((angle: CreativeAngle) => {
    const effort = FORMAT_EFFORT[angle.format];
    const key = `${effort}-${Math.round(angle.score / 4)}`;
    const bump = seen.get(key) ?? 0;
    seen.set(key, bump + 1);
    return { angle, cx: x(effort) + bump * 14, cy: y(angle.score) - bump * 6 };
  });

  const midX = PAD.left + PLOT_W * 0.5;
  const midY = y(72); // conviction threshold: 72+ is worth money now

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-labelledby="quadrant-heading"
    >
      <motion.div variants={riseItem} className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="quadrant-heading" className="machine-label">
          The decision map — effort to produce vs. confidence it wins
        </h2>
        <p className="font-mono text-xs text-ink-tertiary">
          Start top-left · hover any dot
        </p>
      </motion.div>

      <motion.div variants={riseItem} className="glass-panel overflow-hidden rounded-[--radius-panel] p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Scatter plot of creative hypotheses by production effort and confidence score"
        >
          {/* Quadrant tints — barely-there, guidance not decoration */}
          <rect x={PAD.left} y={PAD.top} width={midX - PAD.left} height={midY - PAD.top} fill="rgb(8 102 255 / 0.05)" />
          <rect x={midX} y={midY} width={PAD.left + PLOT_W - midX} height={PAD.top + PLOT_H - midY} fill="rgb(17 18 19 / 0.025)" />

          {/* Quadrant dividers */}
          <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top + PLOT_H} stroke="var(--color-line)" strokeDasharray="4 6" />
          <line x1={PAD.left} y1={midY} x2={PAD.left + PLOT_W} y2={midY} stroke="var(--color-line)" strokeDasharray="4 6" />

          {/* Quadrant labels */}
          {[
            { label: "QUICK WINS — SHOOT FIRST", xx: PAD.left + 10, yy: PAD.top + 18, strong: true },
            { label: "BIG BETS — WORTH A CREW DAY", xx: midX + 10, yy: PAD.top + 18 },
            { label: "CHEAP FILLERS — BATCH THEM", xx: PAD.left + 10, yy: PAD.top + PLOT_H - 10 },
            { label: "SKIP FOR NOW", xx: midX + 10, yy: PAD.top + PLOT_H - 10 },
          ].map((q) => (
            <text
              key={q.label}
              x={q.xx}
              y={q.yy}
              className={q.strong ? "fill-[var(--color-accent-deep)]" : "fill-[var(--color-ink-tertiary)]"}
              fontSize={11}
              fontFamily="var(--font-geist-mono, monospace)"
              letterSpacing="0.1em"
            >
              {q.label}
            </text>
          ))}

          {/* Axes labels */}
          <text x={PAD.left + PLOT_W / 2} y={H - 10} textAnchor="middle" fontSize={11} letterSpacing="0.08em" className="fill-[var(--color-ink-tertiary)]" fontFamily="var(--font-geist-mono, monospace)">
            EFFORT → (phone-shot … crew day)
          </text>
          <text x={16} y={PAD.top + PLOT_H / 2} textAnchor="middle" fontSize={11} letterSpacing="0.08em" className="fill-[var(--color-ink-tertiary)]" fontFamily="var(--font-geist-mono, monospace)" transform={`rotate(-90 16 ${PAD.top + PLOT_H / 2})`}>
            CONFIDENCE →
          </text>

          {/* Dots + labels */}
          {points.map(({ angle, cx, cy }) => {
            const active = hovered === angle.title;
            return (
              <g
                key={angle.title}
                onMouseEnter={() => setHovered(angle.title)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default"
              >
                <circle cx={cx} cy={cy} r={active ? 9 : 6.5} fill="var(--color-accent)" opacity={active ? 1 : 0.85} />
                <circle cx={cx} cy={cy} r={14} fill="transparent" />
                <text
                  x={cx + 12}
                  y={cy + 4}
                  fontSize={12}
                  className={active ? "fill-[var(--color-ink)]" : "fill-[var(--color-ink-secondary)]"}
                  fontWeight={active ? 600 : 500}
                  style={{ paintOrder: "stroke", stroke: "var(--color-vault)", strokeWidth: 4, strokeLinejoin: "round" }}
                >
                  {angle.title.length > 26 ? `${angle.title.slice(0, 25)}…` : angle.title}
                </text>
                {active && (
                  <text
                    x={cx + 12}
                    y={cy + 20}
                    fontSize={11}
                    className="fill-[var(--color-ink-tertiary)]"
                    style={{ paintOrder: "stroke", stroke: "var(--color-vault)", strokeWidth: 4, strokeLinejoin: "round" }}
                  >
                    score {angle.score} · {angle.testingPriority}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>
    </motion.section>
  );
}
