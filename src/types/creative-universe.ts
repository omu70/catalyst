import { z } from "zod";

/* ============================================================================
   The Creative Universe — Catalyst's core domain contract.

   These zod schemas are the SINGLE SOURCE OF TRUTH for the strategy payload:
   - The AI service validates every provider response against them (so a
     hallucinated shape can never reach the UI).
   - The API route derives its response type from them.
   - Phase 3 dashboard components consume the inferred types.
   - The JSON schema sent to the model is generated FROM these (one contract,
     zero drift).

   Provider-agnostic by design: nothing in this file knows Gemini exists.
   ========================================================================== */

/* ----------------------------------------------------------------------------
   INPUT — what the user gives the engine
   ---------------------------------------------------------------------------- */

export const StrategyInputSchema = z.object({
  /** Optional storefront URL — used as context, never fetched client-side. */
  shopifyUrl: z
    .string()
    .trim()
    .url("Enter a valid URL (https://...)")
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  /** What the product is, what it costs, what makes it different. */
  productDetails: z
    .string()
    .trim()
    .min(20, "Describe the product in at least 20 characters")
    .max(4000),
  /** Who buys it — demographics, psychographics, current beliefs. */
  targetAudience: z
    .string()
    .trim()
    .min(10, "Describe the audience in at least 10 characters")
    .max(2000),
});

export type StrategyInput = z.infer<typeof StrategyInputSchema>;

/* ----------------------------------------------------------------------------
   OUTPUT — the Creative Universe the engine returns
   ---------------------------------------------------------------------------- */

/** Eugene Schwartz awareness stages — the backbone of the framework. */
export const AWARENESS_STAGES = [
  "unaware",
  "problem-aware",
  "solution-aware",
  "product-aware",
  "most-aware",
] as const;
export const AwarenessStageSchema = z.enum(AWARENESS_STAGES);
export type AwarenessStage = z.infer<typeof AwarenessStageSchema>;

/** Testing priority — drives the roadmap and the console UI. */
export const TESTING_PRIORITIES = ["scale", "test", "iterate", "watch"] as const;
export const TestingPrioritySchema = z.enum(TESTING_PRIORITIES);
export type TestingPriority = z.infer<typeof TestingPrioritySchema>;

/** Ad formats the strategist can prescribe. */
export const CREATIVE_FORMATS = [
  "ugc-video",
  "founder-video",
  "static-image",
  "carousel",
  "comparison-static",
  "demo-video",
  "testimonial-video",
  "meme-static",
] as const;
export const CreativeFormatSchema = z.enum(CREATIVE_FORMATS);
export type CreativeFormat = z.infer<typeof CreativeFormatSchema>;

/**
 * One creative HYPOTHESIS — the core unit of Catalyst intelligence.
 * Not an "angle": a falsifiable claim a media buyer can prove wrong with
 * a test. `statement` asserts what beats what for whom; `prediction`
 * names the observable outcome that would confirm it.
 */
export const CreativeAngleSchema = z.object({
  title: z.string().min(3).max(120),
  /** Falsifiable claim: "For [audience], [message A] beats [message B]". */
  statement: z.string().min(20).max(400),
  /** The psychological mechanism — WHY this should win. */
  whyItWorks: z.string().min(10).max(600),
  /** Observable confirmation: metric + direction the test should show. */
  prediction: z.string().min(10).max(300),
  targetAudience: z.string().min(5).max(300),
  /** The single dominant emotion the hypothesis triggers. */
  emotion: z.string().min(3).max(60),
  format: CreativeFormatSchema,
  testingPriority: TestingPrioritySchema,
  /** Awareness stage this hypothesis speaks to — powers the Matrix. */
  awarenessStage: AwarenessStageSchema,
  /** Opportunity score 0–100 — powers ranking + bar visualizations. */
  score: z.number().int().min(0).max(100),
  /** A ready-to-shoot opening hook line. */
  hook: z.string().min(5).max(300),
});
export type CreativeAngle = z.infer<typeof CreativeAngleSchema>;

/** Product & customer psychology — the understanding cards. */
export const ProductUnderstandingSchema = z.object({
  /** Jobs-To-Be-Done — the functional/emotional/social jobs customers hire the product for. */
  jobsToBeDone: z.array(z.string().min(5).max(300)).min(2).max(6),
  corePainPoints: z.array(z.string().min(5).max(300)).min(2).max(6),
  desiredOutcomes: z.array(z.string().min(5).max(300)).min(2).max(6),
  /** Objections — the reasons people DON'T buy, each a counter-message target. */
  objections: z.array(z.string().min(5).max(300)).min(2).max(6),
  /** Purchase triggers — the moments/events that flip consideration to buying. */
  purchaseTriggers: z.array(z.string().min(5).max(300)).min(2).max(6),
  /** Hidden desires — what buyers want but won't say out loud. */
  hiddenDesires: z.array(z.string().min(5).max(300)).min(2).max(6),
  /** Where the bulk of the addressable audience sits today. */
  dominantAwarenessStage: AwarenessStageSchema,
  awarenessRationale: z.string().min(10).max(500),
});
export type ProductUnderstanding = z.infer<typeof ProductUnderstandingSchema>;

/** A single week in the testing roadmap. */
export const RoadmapWeekSchema = z.object({
  week: z.number().int().min(1).max(4),
  theme: z.string().min(3).max(120),
  objective: z.string().min(10).max(400),
  /** Titles referencing angles in the universe (loose coupling by title). */
  angleTitles: z.array(z.string().min(3).max(120)).min(1).max(4),
  successMetric: z.string().min(5).max(200),
});
export type RoadmapWeek = z.infer<typeof RoadmapWeekSchema>;

/**
 * Competitor insights — present only when live Ad Library data was fed to
 * the engine. OPTIONAL so analyses generated without the Meta token (and
 * all previously saved analyses) remain schema-valid.
 */
export const CompetitorInsightsSchema = z.object({
  /** One-paragraph read of the competitive creative landscape. */
  landscape: z.string().min(20).max(800),
  /** Named brands the buyer actually cross-shops (verifiable, never invented). */
  likelyCompetitors: z.array(z.string().min(2).max(80)).max(8).optional(),
  /** Patterns most competitors currently run (saturated territory). */
  commonPatterns: z.array(z.string().min(5).max(300)).min(1).max(6),
  /** Approaches conspicuously absent — the exploitable openings. */
  exploitableGaps: z.array(z.string().min(5).max(300)).min(1).max(6),
});
export type CompetitorInsights = z.infer<typeof CompetitorInsightsSchema>;

/** The full Creative Universe payload. */
export const CreativeUniverseSchema = z.object({
  productUnderstanding: ProductUnderstandingSchema,
  competitorInsights: CompetitorInsightsSchema.optional(),
  /** 6–12 angles: enough to map coverage, few enough to act on. */
  angles: z.array(CreativeAngleSchema).min(6).max(12),
  /** Angles the account is missing — the Creative Matrix "gaps". */
  missingAngleTitles: z.array(z.string().min(3).max(120)).max(8),
  roadmap: z.array(RoadmapWeekSchema).length(4),
  /** One-paragraph strategist's verdict shown atop the dashboard. */
  executiveSummary: z.string().min(50).max(1200),
});
export type CreativeUniverse = z.infer<typeof CreativeUniverseSchema>;

/* ----------------------------------------------------------------------------
   API envelope — every response from /api/generate-strategy
   ---------------------------------------------------------------------------- */

export interface StrategySuccessResponse {
  ok: true;
  universe: CreativeUniverse;
  /** Persisted analysis id — present when the backend is connected. */
  analysisId?: string;
}

export interface StrategyErrorResponse {
  ok: false;
  error: {
    /** Stable machine code — the UI switches on this, never on messages. */
    code:
      | "invalid_input"
      | "provider_unavailable"
      | "provider_timeout"
      | "rate_limited" // the AI provider's quota (e.g. Gemini free tier)
      | "app_rate_limited" // Catalyst's own per-client budget
      | "invalid_response"
      | "not_configured"
      | "internal";
    message: string;
    /** Field-level issues when code === "invalid_input". */
    fieldErrors?: Record<string, string[]>;
  };
}

export type StrategyResponse = StrategySuccessResponse | StrategyErrorResponse;
