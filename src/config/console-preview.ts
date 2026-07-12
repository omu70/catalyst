/**
 * Static preview data for the hero <StrategyConsole /> artifact.
 *
 * This is deliberately typed identically to how the Phase 2 "Creative
 * Universe" API payload will look, so when the Gemini brain comes online
 * the console swaps from constants to live data with zero UI changes.
 */

import type { TestingPriority } from "@/types/creative-universe";

export interface AnglePreview {
  /** Creative angle name, as a strategist would write it. */
  readonly name: string;
  /** Composite opportunity score, 0–100. */
  readonly score: number;
  readonly priority: TestingPriority;
}

export const CONSOLE_HEADER = {
  title: "Creative Universe",
  meta: "34 angles mapped · 6 gaps found",
} as const;

export const CONSOLE_ANGLES: readonly AnglePreview[] = [
  { name: "Us-vs-them comparison", score: 92, priority: "scale" },
  { name: "Founder-story UGC", score: 87, priority: "test" },
  { name: "Problem–agitate hook", score: 81, priority: "test" },
  { name: "Price-anchoring demo", score: 74, priority: "iterate" },
  { name: "Social-proof mashup", score: 68, priority: "watch" },
] as const;

export const CONSOLE_FOOTER = {
  label: "Next test window",
  value: "Mon 09:00",
} as const;

/** Chip styling lives in the shared UI config — one source of truth. */
export { PRIORITY_STYLES } from "@/config/universe-ui";
