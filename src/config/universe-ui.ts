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

/** What to physically produce, per format — turns angles into shot lists. */
export const FORMAT_DIRECTIONS: Record<CreativeFormat, string> = {
  "ugc-video": "15–30s vertical video · creator reads the hook to camera, phone-shot energy",
  "founder-video": "30–60s vertical video · founder on camera, direct and unpolished",
  "static-image": "1 bold image · hook as short overlay headline, product centered",
  carousel: "3–5 cards · one idea per card, hook on card 1",
  "comparison-static": "Split-frame image · yours vs theirs, hook as verdict line",
  "demo-video": "15–30s video · product doing the thing, hook in first 2 seconds",
  "testimonial-video": "15–30s vertical video · real customer voice, hook = their words",
  "meme-static": "Native meme format · hook is the caption, zero branding polish",
};

/** Plain-language read of each awareness stage — for the Market Read panel. */
export const STAGE_MEANINGS: Record<AwarenessStage, string> = {
  unaware: "They don't yet feel the problem — creative must name the pain before selling anything.",
  "problem-aware": "They feel the pain but don't know solutions exist — creative should dramatize the problem and reveal the category.",
  "solution-aware": "They know solutions exist but not yours — creative should prove your mechanism beats the alternatives.",
  "product-aware": "They know you but haven't bought — creative should crush the final objections with proof.",
  "most-aware": "They're ready — creative should give a reason to act now: offer, urgency, identity.",
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
