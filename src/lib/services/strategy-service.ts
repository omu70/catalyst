import { getAIProvider } from "@/lib/ai";
import { AIProviderError } from "@/lib/ai/types";
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
  const prompt = buildStrategistPrompt(input);

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
