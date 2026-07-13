import type { CreativeUniverse } from "@/types/creative-universe";
import { STAGE_ORDER } from "@/config/universe-ui";

/* ============================================================================
   Universe metrics — every Command Center number is COMPUTED from the data,
   never invented by the model. Deterministic, testable, honest.
   ========================================================================== */

export interface UniverseMetrics {
  /** Mean score of the top-3 hypotheses — the batch's headline strength. */
  creativeScore: number;
  /** Awareness stages with at least one hypothesis (0–5). */
  stagesCovered: number;
  /** Distinct creative formats present in the batch. */
  formatsUsed: number;
  /** 0–100: breadth across stages and formats — the anti-monoculture score. */
  diversityScore: number;
  /** Highest-value unclaimed territory (first flagged gap), if any. */
  biggestOpportunity: string | null;
  /** What the category over-runs (first competitor common pattern), if known. */
  overusedInCategory: string | null;
  /** High score but parked priority — the sleeper the team should question. */
  undervalued: string | null;
  /** Recommended asset count: each hypothesis remixed into ~3 variants. */
  recommendedAssets: number;
}

export function computeUniverseMetrics(
  universe: CreativeUniverse,
): UniverseMetrics {
  const byScore = [...universe.angles].sort((a, b) => b.score - a.score);
  const top3 = byScore.slice(0, 3);
  const creativeScore =
    top3.length > 0
      ? Math.round(top3.reduce((sum, a) => sum + a.score, 0) / top3.length)
      : 0;

  const stagesCovered = STAGE_ORDER.filter((s) =>
    universe.angles.some((a) => a.awarenessStage === s),
  ).length;
  const formatsUsed = new Set(universe.angles.map((a) => a.format)).size;

  // Breadth of coverage: half from funnel spread, half from format spread.
  const diversityScore = Math.round(
    (stagesCovered / 5) * 50 + (Math.min(formatsUsed, 5) / 5) * 50,
  );

  // A hypothesis scoring ≥75 that is not marked scale/test is a sleeper.
  const sleeper = byScore.find(
    (a) => a.score >= 75 && (a.testingPriority === "iterate" || a.testingPriority === "watch"),
  );

  return {
    creativeScore,
    stagesCovered,
    formatsUsed,
    diversityScore,
    biggestOpportunity: universe.missingAngleTitles[0] ?? null,
    overusedInCategory: universe.competitorInsights?.commonPatterns[0] ?? null,
    undervalued: sleeper?.title ?? null,
    recommendedAssets: universe.angles.length * 3,
  };
}
