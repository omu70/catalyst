import type {
  AwarenessStage,
  CreativeFormat,
  TestingPriority,
} from "@/types/creative-universe";
import { AWARENESS_STAGES } from "@/types/creative-universe";

/* ============================================================================
   Universe UI config — display metadata for the Creative Universe domain.

   Single source for labels and chip styling; consumed by the dashboard,
   the marketing console, and (later) exports/reports. No component invents
   a label or a chip color locally.
   ========================================================================== */

/** Awareness stages in funnel order — drives Creative Matrix columns. */
export const STAGE_ORDER: readonly AwarenessStage[] = AWARENESS_STAGES;

export const STAGE_LABELS: Record<AwarenessStage, string> = {
  unaware: "Unaware",
  "problem-aware": "Problem-aware",
  "solution-aware": "Solution-aware",
  "product-aware": "Product-aware",
  "most-aware": "Most-aware",
};

export const FORMAT_LABELS: Record<CreativeFormat, string> = {
  "ugc-video": "UGC video",
  "founder-video": "Founder video",
  "static-image": "Static",
  carousel: "Carousel",
  "comparison-static": "Comparison",
  "demo-video": "Demo video",
  "testimonial-video": "Testimonial",
  "meme-static": "Meme",
};

/** Chip styling per testing priority — semantic, token-resolved. */
export const PRIORITY_STYLES: Record<TestingPriority, string> = {
  scale: "bg-accent-ghost text-accent-deep",
  test: "bg-data-ghost text-data",
  iterate: "bg-glass-bright text-ink-secondary border border-line",
  watch: "bg-glass text-ink-tertiary border border-line",
};

/** Sort weight — scale first, watch last. */
export const PRIORITY_WEIGHT: Record<TestingPriority, number> = {
  scale: 0,
  test: 1,
  iterate: 2,
  watch: 3,
};
