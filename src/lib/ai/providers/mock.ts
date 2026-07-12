import type { AIProvider, GenerateJsonParams } from "@/lib/ai/types";
import type { CreativeUniverse } from "@/types/creative-universe";

/* ============================================================================
   Mock adapter — deterministic Creative Universe for development and CI.

   Activated with AI_PROVIDER=mock. Lets the entire product (input engine,
   dashboard, roadmap) be built, demoed, and end-to-end tested without an
   API key or network access, and gives tests a stable fixture.
   ========================================================================== */

/** Simulated engine latency so loading states are honest in development. */
const SIMULATED_LATENCY_MS = 1200;

const MOCK_UNIVERSE: CreativeUniverse = {
  productUnderstanding: {
    jobsToBeDone: [
      "Help me stop wasting ad budget on creative guesses",
      "Make me look like the smartest media buyer in the room",
      "Give my team a shared language for creative strategy",
    ],
    corePainPoints: [
      "Creative fatigue burns winning ads out in under 3 weeks",
      "No systematic way to know which angle to test next",
      "Agencies bill retainers for strategy that is really guesswork",
    ],
    desiredOutcomes: [
      "Lower CPA within the first testing cycle",
      "A repeatable testing system instead of hero-ad luck",
      "Confidence in every dollar of creative production spend",
    ],
    dominantAwarenessStage: "solution-aware",
    awarenessRationale:
      "Buyers already run Meta ads and know creative testing matters; they have not yet seen a tool that systematizes angle selection.",
  },
  angles: [
    {
      title: "Us-vs-them comparison",
      whyItWorks:
        "Direct contrast against agency retainers reframes price into savings and triggers loss aversion.",
      targetAudience: "DTC founders spending $30k+/mo currently using an agency",
      emotion: "vindication",
      format: "comparison-static",
      testingPriority: "scale",
      awarenessStage: "product-aware",
      score: 92,
      hook: "Your agency charges $8k/month to guess. This guesses better — for $99.",
    },
    {
      title: "Founder-story UGC",
      whyItWorks:
        "Authenticity bypasses ad blindness; the founder's spend-waste confession mirrors the viewer's private pain.",
      targetAudience: "Bootstrapped e-commerce operators, $10-50k/mo spend",
      emotion: "trust",
      format: "founder-video",
      testingPriority: "test",
      awarenessStage: "problem-aware",
      score: 87,
      hook: "I burned $40,000 on ads that died in two weeks. Here's what I built instead.",
    },
    {
      title: "Problem-agitate hook",
      whyItWorks:
        "Naming creative fatigue precisely makes the viewer feel seen before any product mention, earning the next 15 seconds.",
      targetAudience: "In-house media buyers at 7-figure brands",
      emotion: "anxiety-relief",
      format: "ugc-video",
      testingPriority: "test",
      awarenessStage: "problem-aware",
      score: 81,
      hook: "Your best ad is dying right now — and you won't know until CPA doubles.",
    },
    {
      title: "Price-anchoring demo",
      whyItWorks:
        "Anchoring the monthly cost against one wasted creative production run makes the subscription feel free.",
      targetAudience: "Performance leads comparing tools",
      emotion: "pragmatism",
      format: "demo-video",
      testingPriority: "iterate",
      awarenessStage: "product-aware",
      score: 74,
      hook: "One bad ad shoot costs $5,000. Watch this find the winner for $99.",
    },
    {
      title: "Social-proof mashup",
      whyItWorks:
        "Stacked micro-testimonials compress credibility into 20 seconds for skeptical, most-aware buyers.",
      targetAudience: "Buyers who visited pricing but did not convert",
      emotion: "fomo",
      format: "testimonial-video",
      testingPriority: "watch",
      awarenessStage: "most-aware",
      score: 68,
      hook: "217 media buyers switched last month. Here's what they found.",
    },
    {
      title: "Spreadsheet funeral",
      whyItWorks:
        "Ritualizing the death of the creative-tracker spreadsheet dramatizes the workflow upgrade with humor that earns shares.",
      targetAudience: "Ops-minded growth marketers",
      emotion: "amusement",
      format: "meme-static",
      testingPriority: "test",
      awarenessStage: "solution-aware",
      score: 71,
      hook: "RIP 'Creative_Tracker_FINAL_v27.xlsx' — you will not be missed.",
    },
  ],
  missingAngleTitles: [
    "Day-in-the-life of a media buyer using the tool",
    "Contrarian take: why more creative volume is losing you money",
    "Before/after account audit walkthrough",
  ],
  roadmap: [
    {
      week: 1,
      theme: "Baseline the bankers",
      objective:
        "Establish CPA baselines on the two highest-scoring angles with 3 hook variants each.",
      angleTitles: ["Us-vs-them comparison", "Founder-story UGC"],
      successMetric: "CPA within 20% of account average at $150+ spend per variant",
    },
    {
      week: 2,
      theme: "Attack problem-awareness",
      objective:
        "Expand into problem-aware territory to widen the funnel beyond retargeting.",
      angleTitles: ["Problem-agitate hook", "Spreadsheet funeral"],
      successMetric: "Thumbstop ratio > 25% and CPM-adjusted CPA parity",
    },
    {
      week: 3,
      theme: "Iterate and anchor",
      objective:
        "Iterate week-1 winners with new hooks; introduce price-anchoring for consideration-stage traffic.",
      angleTitles: ["Price-anchoring demo", "Us-vs-them comparison"],
      successMetric: "One variant beating account-best CPA by 10%",
    },
    {
      week: 4,
      theme: "Scale and close",
      objective:
        "Scale proven winners to 3x budget; deploy social proof against warm audiences to close.",
      angleTitles: ["Social-proof mashup", "Founder-story UGC"],
      successMetric: "Blended ROAS +15% vs. pre-test baseline",
    },
  ],
  executiveSummary:
    "This account's fastest path to lower CPA is aggressive differentiation against the agency status quo, paired with a deliberate push into problem-aware audiences that competitors ignore. The us-vs-them comparison should carry early spend while founder-story UGC builds durable trust. The four-week plan front-loads information gain: by week 3 you will know your winning awareness stage, and week 4 converts that knowledge into scaled spend.",
};

export class MockProvider implements AIProvider {
  readonly name = "mock";

  async generateJson(params: GenerateJsonParams): Promise<unknown> {
    // Honor aborts so timeout behavior is testable against the mock too.
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, SIMULATED_LATENCY_MS);
      params.signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
    // Deep-clone so callers can never mutate the fixture.
    return structuredClone(MOCK_UNIVERSE);
  }
}
