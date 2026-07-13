"use client";

import { motion } from "framer-motion";

import { STAGE_LABELS, STAGE_ORDER } from "@/config/universe-ui";
import { riseItem, staggerContainer } from "@/lib/motion/variants";

/* ============================================================================
   <CoverageRadar /> — the 360° promise, made visible.

   A radar scanning the full circle of creative territory: hypothesis dots
   plotted at every bearing, awareness stages as the five compass points,
   and a continuously sweeping beam that says "nothing is left behind."

   Implementation: one SVG (rings, ticks, dots — static, deterministic) +
   one conic-gradient beam rotated by a CSS animation (GPU transform only).
   Reduced motion: the beam parks; the map remains.
   ========================================================================== */

const SIZE = 480;
const CENTER = SIZE / 2;
const OUTER_R = 218;

/** Deterministic hypothesis dots — bearing° × radius fraction × emphasis. */
const DOTS: ReadonlyArray<{ angle: number; radius: number; hot?: boolean }> = [
  { angle: 12, radius: 0.86, hot: true },
  { angle: 38, radius: 0.62 },
  { angle: 67, radius: 0.9 },
  { angle: 95, radius: 0.55, hot: true },
  { angle: 121, radius: 0.78 },
  { angle: 148, radius: 0.68 },
  { angle: 176, radius: 0.88 },
  { angle: 204, radius: 0.6, hot: true },
  { angle: 231, radius: 0.82 },
  { angle: 259, radius: 0.7 },
  { angle: 286, radius: 0.9 },
  { angle: 312, radius: 0.58 },
  { angle: 339, radius: 0.76, hot: true },
];

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

export function CoverageRadar(): React.JSX.Element {
  return (
    <section
      aria-labelledby="coverage-heading"
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pb-28"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid items-center gap-12 lg:grid-cols-12"
      >
        {/* ————— Copy ————— */}
        <div className="lg:col-span-5">
          <motion.p variants={riseItem} className="machine-label mb-4">
            Full-circle coverage
          </motion.p>
          <motion.h2
            variants={riseItem}
            id="coverage-heading"
            className="text-display font-semibold tracking-tight text-balance text-ink"
          >
            Every angle. All{" "}
            <span className="editorial text-lit-accent">360°.</span>
          </motion.h2>
          <motion.p
            variants={riseItem}
            className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-secondary"
          >
            Human brainstorms orbit the same three familiar ideas. Catalyst
            sweeps the entire circle — every awareness stage, every emotion,
            every format — and plots each viable hypothesis on the map. What
            you don&apos;t test is a decision, never an oversight.
          </motion.p>
          <motion.ul variants={riseItem} className="mt-6 flex flex-col gap-2.5">
            {[
              "5 awareness stages scanned, unaware → most-aware",
              "8 creative formats considered per angle",
              "Gaps flagged explicitly — uncovered territory is named",
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ————— The radar ————— */}
        <motion.div variants={riseItem} className="lg:col-span-7">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            {/* Sweep beam — conic gradient wedge, pure GPU rotation */}
            <div
              aria-hidden
              className="animate-radar absolute inset-[4%] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgb(8 102 255 / 0.22) 0deg, rgb(8 102 255 / 0.05) 42deg, transparent 70deg)",
              }}
            />

            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="relative h-full w-full overflow-visible"
              role="img"
              aria-label="Radar diagram showing creative hypotheses plotted across all 360 degrees of the strategy space"
            >
              {/* Rings */}
              {[1, 0.72, 0.44].map((f) => (
                <circle
                  key={f}
                  cx={CENTER}
                  cy={CENTER}
                  r={OUTER_R * f}
                  fill="none"
                  stroke="var(--color-line)"
                  strokeWidth={1}
                  strokeDasharray={f === 1 ? "none" : "3 6"}
                />
              ))}

              {/* 36 bearing ticks — the "every degree" texture */}
              {Array.from({ length: 36 }, (_, i) => {
                const a = i * 10;
                const outer = polar(a, OUTER_R);
                const inner = polar(a, OUTER_R - (i % 9 === 0 ? 14 : 7));
                return (
                  <line
                    key={a}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={i % 9 === 0 ? "var(--color-line-strong)" : "var(--color-line)"}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Stage spokes + labels at the five compass points */}
              {STAGE_ORDER.map((stage, i) => {
                const a = i * 72;
                const tip = polar(a, OUTER_R);
                const label = polar(a, OUTER_R + 26);
                return (
                  <g key={stage}>
                    <line
                      x1={CENTER}
                      y1={CENTER}
                      x2={tip.x}
                      y2={tip.y}
                      stroke="var(--color-line)"
                      strokeWidth={1}
                    />
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-[var(--color-ink-tertiary)] font-mono text-[9px] tracking-[0.12em] uppercase"
                    >
                      {STAGE_LABELS[stage]}
                    </text>
                  </g>
                );
              })}

              {/* Hypothesis dots — plotted around the full circle */}
              {DOTS.map(({ angle, radius, hot }) => {
                const p = polar(angle, OUTER_R * radius);
                return (
                  <g key={angle}>
                    {hot && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={9}
                        fill="rgb(8 102 255 / 0.15)"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hot ? 4 : 3}
                      fill={hot ? "var(--color-accent)" : "var(--color-ink-faint)"}
                    />
                  </g>
                );
              })}

              {/* Core */}
              <circle cx={CENTER} cy={CENTER} r={30} fill="var(--color-vault)" stroke="var(--color-line)" />
              <text
                x={CENTER}
                y={CENTER - 3}
                textAnchor="middle"
                className="fill-[var(--color-ink)] font-mono text-[15px] font-medium"
              >
                360°
              </text>
              <text
                x={CENTER}
                y={CENTER + 11}
                textAnchor="middle"
                className="fill-[var(--color-ink-tertiary)] font-mono text-[6.5px] tracking-[0.14em] uppercase"
              >
                covered
              </text>
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
