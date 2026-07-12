/**
 * Static preview data for the hero <StrategyConsole /> artifact.
 *
 * This is deliberately typed identically to how the Phase 2 "Creative
 * Universe" API payload will look, so when the Gemini brain comes online
 * the console swaps from constants to live data with zero UI changes.
 */

/** Testing priority — drives chip color + sort order in the console. */
export type TestingPriority = "scale" | "test" | "iterate" | "watch";

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

/** Chip styling per priority — semantic, resolved from design tokens. */
export const PRIORITY_STYLES: Record<TestingPriority, string> = {
  scale: "bg-accent-ghost text-accent-bright",
  test: "bg-data-ghost text-data-bright",
  iterate: "bg-glass-bright text-ink-secondary",
  watch: "bg-glass text-ink-tertiary",
};
