import { getAIProvider } from "@/lib/ai";
import { AIProviderError } from "@/lib/ai/types";
import { fetchStoreIntel, renderStoreIntel } from "@/lib/services/store-intel";
import {
  deriveSearchTerm,
  fetchCompetitorIntel,
  renderCompetitorIntel,
} from "@/lib/services/competitor-intel";
import {
  STRATEGIST_SYSTEM_PROMPT,
  buildStrategistPrompt,
} from "@/lib/prompts/creative-strategist";
import {
  CreativeUniverseSchema,
  type CreativeUniverse,
  type StrategyInput,
} from "@/types/creative-universe";

/* ============================================================================
   Strategy service — the business logic of strategy generation.

   Owns policy the providers must not know about:
   - the timeout deadline
   - schema validation of whatever the provider returns
   - ONE corrective retry when the model's JSON fails validation
   Pure server-side module: never import from client components.
   ========================================================================== */

/** Hard deadline for a generation call — kept under the route's 60s host
    ceiling so OUR timeout fires first and returns a clean typed error. */
const GENERATION_TIMEOUT_MS = 50_000;

/** Attempts: 1 initial + 1 corrective retry on schema mismatch. */
const MAX_ATTEMPTS = 2;

export async function generateCreativeUniverse(
  input: StrategyInput,
): Promise<CreativeUniverse> {
  const provider = getAIProvider();

  // Enrichment — both sources fetched concurrently, both non-fatal:
  //   1. The brand's own storefront (products.json)
  //   2. Live competitor ads (Meta Ad Library, when token configured)
  const storePromise = input.shopifyUrl
    ? fetchStoreIntel(input.shopifyUrl)
    : Promise.resolve(null);

  const storeIntel = await storePromise;
  const searchTerm = deriveSearchTerm(
    input.productDetails,
    storeIntel?.products[0]?.productType,
  );
  const competitorIntel = await fetchCompetitorIntel(searchTerm);

  const sections = [
    storeIntel ? renderStoreIntel(storeIntel) : null,
    competitorIntel ? renderCompetitorIntel(competitorIntel) : null,
  ].filter((s): s is string => s !== null);

  const prompt = buildStrategistPrompt(
    input,
    sections.length > 0 ? sections.join("\n\n") : undefined,
  );

  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

  try {
    let lastValidationMessage = "";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const raw = await provider.generateJson({
        system: STRATEGIST_SYSTEM_PROMPT,
        prompt:
          attempt === 1
            ? prompt
            : // Corrective retry: feed the validator's complaint back so the
              // model can repair its own structural mistake.
              `${prompt}\n\nYour previous response failed validation with:\n${lastValidationMessage}\nReturn corrected JSON that satisfies the contract exactly.`,
        schemaDescription: "CreativeUniverse JSON contract (embedded in prompt)",
        signal: controller.signal,
      });

      const parsed = CreativeUniverseSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }

      lastValidationMessage = parsed.error.issues
        .slice(0, 8)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
    }

    throw new AIProviderError(
      "invalid_response",
      `Model output failed schema validation after ${MAX_ATTEMPTS} attempts: ${lastValidationMessage}`,
    );
  } finally {
    clearTimeout(deadline);
  }
}
