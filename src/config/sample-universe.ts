import type { CreativeUniverse } from "@/types/creative-universe";

/* ============================================================================
   Sample Creative Universe — one fixture, three jobs:
   1. The MockProvider's deterministic output (dev/CI without an API key)
   2. The "See a sample report" path on /analyze (zero-friction first value)
   3. A living example of the quality bar every real generation must meet

   The subject is a fictional cookware brand so prospects see a familiar
   D2C shape, clearly labeled as a sample everywhere it renders.
   ========================================================================== */

export const SAMPLE_UNIVERSE: CreativeUniverse = {
  productUnderstanding: {
    jobsToBeDone: [
      "Cook daily meals without worrying what's leaching into the food",
      "Feel like a competent, informed home chef — not a marketing victim",
      "Upgrade the kitchen once, properly, instead of replacing cheap pans yearly",
    ],
    corePainPoints: [
      "Nonstick coatings scratch, flake, and end up in the food",
      "Conflicting safety claims make every cookware purchase feel like research homework",
      "Premium cookware prices feel unjustifiable without proof of difference",
    ],
    desiredOutcomes: [
      "One pan set that handles everything and lasts a decade",
      "Confidence that family meals are toxin-free",
      "A kitchen that looks like they take cooking seriously",
    ],
    objections: [
      "\"Ceramic coatings wear out just like teflon — this is marketing\"",
      "\"$249 is triple what a decent set costs at Target\"",
      "\"I've been burned by 'non-toxic' claims before — where's the proof?\"",
    ],
    purchaseTriggers: [
      "The old pan visibly flaking into dinner",
      "Moving in together / first real kitchen",
      "A creator they trust switching sets on camera",
    ],
    hiddenDesires: [
      "Being the friend whose kitchen others quietly envy",
      "Moral high ground: 'I don't feed my family from teflon'",
      "Buying once, smugly, while others rebuy yearly",
    ],
    dominantAwarenessStage: "problem-aware",
    awarenessRationale:
      "The audience already distrusts nonstick coatings (problem-aware) but most haven't researched ceramic-coated stainless as the specific solution — the gap between fear and solution is where spend converts cheapest.",
  },
  competitorInsights: {
    landscape:
      "Category read (verify in Ad Library): premium cookware ads are dominated by kitchen-porn beauty shots and celebrity-chef endorsements. Everyone claims 'non-toxic'; almost nobody proves it. The proof territory - lab reports, microscope shots, flake tests - is nearly empty.",
    likelyCompetitors: ["HexClad", "Caraway", "Our Place", "Made In Cookware"],
    commonPatterns: [
      "Glossy lifestyle kitchens with soft music and no product stress-testing",
      "Celebrity and chef endorsements standing in for evidence",
      "'Non-toxic' claimed in text overlays with zero proof shown",
    ],
    exploitableGaps: [
      "Destructive testing on camera - nobody shows a competitor pan failing",
      "Price-per-year math against the replacement cycle of cheap pans",
      "Unedited third-party lab results as the entire creative",
    ],
  },
  angles: [
    {
      title: "The flake test",
      statement:
        "For nonstick-skeptical home cooks, showing a competitor pan flaking into food will beat product-beauty shots, because visceral contamination fear outconverts aspiration in problem-aware audiences.",
      prediction:
        "Hook rate >32% and CPA at or below account average within $150 spend.",
      whyItWorks:
        "Disgust is the fastest emotional pathway to action; it converts an abstract safety worry into a concrete, personal image at dinner.",
      targetAudience: "Health-conscious parents 28-45 who already own an air fryer",
      emotion: "disgust-relief",
      format: "ugc-video",
      testingPriority: "scale",
      awarenessStage: "problem-aware",
      score: 92,
      hook: "This is what your 'nonstick' pan looks like under a microscope after 6 months.",
    },
    {
      title: "Price-per-decade math",
      statement:
        "For value-rational buyers, reframing $249 as $25/year over a decade will beat discount-led messaging, because the objection is justification, not affordability.",
      prediction:
        "CTR parity with control but checkout conversion +15% on landing.",
      whyItWorks:
        "The audience can afford it; they lack a story to justify it. Cost-per-use math hands them the story they'll retell their partner.",
      targetAudience: "Households replacing their second cheap set in 3 years",
      emotion: "vindication",
      format: "comparison-static",
      testingPriority: "test",
      awarenessStage: "solution-aware",
      score: 84,
      hook: "You've spent $240 on pans that died. This one costs $25 a year.",
    },
    {
      title: "Founder lab tour",
      statement:
        "For proof-demanding skeptics, a founder walking through third-party lab results will beat influencer endorsements, because this segment's objection is evidence, not popularity.",
      prediction:
        "Lower thumbstop than UGC but +20% higher landing-page dwell and best assisted-conversion rate.",
      whyItWorks:
        "Radical transparency is category-atypical in cookware; showing the actual test report converts the hardest, highest-LTV skeptics.",
      targetAudience: "Research-heavy buyers who read ingredient labels",
      emotion: "trust",
      format: "founder-video",
      testingPriority: "test",
      awarenessStage: "product-aware",
      score: 78,
      hook: "We paid an independent lab to test our coating. Here's the unedited report.",
    },
    {
      title: "The inheritance frame",
      statement:
        "For buyers with hidden status desires, 'the pan your kids will fight over' will beat functional durability claims, because legacy framing flatters identity while implying durability.",
      prediction:
        "Higher saves/shares than any functional ad; CPA within 20% of account average.",
      whyItWorks:
        "Legacy language converts a $249 purchase into a family heirloom narrative — status and prudence in one message.",
      targetAudience: "Home cooks 30-45 who host and post their kitchens",
      emotion: "pride",
      format: "static-image",
      testingPriority: "iterate",
      awarenessStage: "most-aware",
      score: 71,
      hook: "Buy the pan your kids will argue about in 2055.",
    },
    {
      title: "Air-fryer graduation",
      statement:
        "For air-fryer owners, positioning the set as 'your kitchen's next graduation' will beat generic cookware messaging, because it anchors to a purchase they already feel smart about.",
      prediction:
        "Best CPM efficiency of the batch via interest-stacking; hook rate >28%.",
      whyItWorks:
        "It borrows trust from an existing purchase decision the audience is proud of, lowering the perceived risk of the next upgrade.",
      targetAudience: "Air-fryer-first households under 35",
      emotion: "competence",
      format: "carousel",
      testingPriority: "watch",
      awarenessStage: "unaware",
      score: 64,
      hook: "You upgraded frying. Your pans didn't get the memo.",
    },
    {
      title: "Trust-stack testimonial",
      statement:
        "For warm retargeting traffic, stacked micro-testimonials from verified buyers will beat single-story testimonials, because volume of proof answers the 'too good to be true' objection.",
      prediction:
        "Retargeting CPA -25% vs current control within one week's spend.",
      whyItWorks:
        "At the decision stage, breadth of social proof compresses perceived risk faster than depth; 12 five-second voices beat one polished story.",
      targetAudience: "Cart abandoners and pricing-page visitors",
      emotion: "reassurance",
      format: "testimonial-video",
      testingPriority: "test",
      awarenessStage: "most-aware",
      score: 76,
      hook: "1,400 kitchens switched last quarter. Here's 30 seconds of why.",
    },
  ],
  missingAngleTitles: [
    "Chef-abuse stress test (10,000 scrambles)",
    "Anti-influencer: 'we sent this to zero celebrities'",
    "Registry positioning for engaged couples",
  ],
  roadmap: [
    {
      week: 1,
      theme: "Fear vs. math",
      objective:
        "Baseline the two strongest psychological levers — contamination fear and cost-justification — against current account control.",
      angleTitles: ["The flake test", "Price-per-decade math"],
      successMetric: "One variant beats control CPA at $150+ spend each",
    },
    {
      week: 2,
      theme: "Earn the skeptics",
      objective:
        "Deploy evidence-led creative against the proof objection while fear/math winners keep spending.",
      angleTitles: ["Founder lab tour", "Trust-stack testimonial"],
      successMetric: "Landing dwell +20% and assisted conversions up on lab-tour traffic",
    },
    {
      week: 3,
      theme: "Identity expansion",
      objective:
        "Test status-frame messaging on engaged audiences; iterate week-1 winner with two fresh hooks.",
      angleTitles: ["The inheritance frame", "The flake test"],
      successMetric: "Saves/shares rate 2x account average on identity creative",
    },
    {
      week: 4,
      theme: "Scale and widen",
      objective:
        "3x budget on proven winners; open the unaware funnel with the air-fryer bridge.",
      angleTitles: ["Air-fryer graduation", "Price-per-decade math"],
      successMetric: "Blended ROAS +15% vs pre-test baseline at scaled spend",
    },
  ],
  executiveSummary:
    "This brand's fastest path to lower CPA is weaponizing the audience's existing distrust of nonstick coatings: lead with visceral contamination proof (the flake test) while cost-per-decade math neutralizes the price objection in parallel. Evidence-led founder content converts the skeptical high-LTV tail in week two, and identity framing expands reach once trust is banked. By week three you'll know whether fear or math is this account's dominant lever; week four scales the winner and opens cold traffic through the air-fryer bridge. Every hypothesis above names its kill-metric — test them in order and let the losers die fast.",
};
