import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  AIProviderError,
  type AIProvider,
  type GenerateJsonParams,
} from "@/lib/ai/types";

/* ============================================================================
   Gemini adapter — one implementation detail of the AIProvider seam.

   Everything vendor-specific lives here and ONLY here: SDK construction,
   model naming, JSON-mode config, and the mapping from Google's error
   surface to Catalyst's stable AIErrorCode taxonomy.
   ========================================================================== */

/** Default model — overridable per-environment without a deploy. */
const DEFAULT_MODEL = "gemini-2.5-flash";

/** Conservative generation config for strategy work: consistent > creative. */
const DEFAULT_TEMPERATURE = 0.4;

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private readonly client: GoogleGenerativeAI;
  private readonly model: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async generateJson(params: GenerateJsonParams): Promise<unknown> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: params.system,
      generationConfig: {
        temperature: params.temperature ?? DEFAULT_TEMPERATURE,
        // Native JSON mode — the model cannot emit prose or fences.
        responseMimeType: "application/json",
      },
    });

    let raw: string;
    try {
      const result = await model.generateContent(
        { contents: [{ role: "user", parts: [{ text: params.prompt }] }] },
        { signal: params.signal },
      );
      raw = result.response.text();
    } catch (error) {
      throw mapGeminiError(error);
    }

    if (!raw || raw.trim().length === 0) {
      throw new AIProviderError(
        "invalid_response",
        "Gemini returned an empty response",
      );
    }

    try {
      return JSON.parse(raw) as unknown;
    } catch (error) {
      throw new AIProviderError(
        "invalid_response",
        "Gemini returned malformed JSON",
        error,
      );
    }
  }
}

/** Maps Google SDK failures into the stable Catalyst error taxonomy. */
function mapGeminiError(error: unknown): AIProviderError {
  // Our own deadline fired (service layer aborts the signal).
  if (error instanceof DOMException && error.name === "AbortError") {
    return new AIProviderError(
      "provider_timeout",
      "Strategy generation timed out",
      error,
    );
  }

  const message = error instanceof Error ? error.message : String(error);

  if (/429|quota|rate/i.test(message)) {
    return new AIProviderError(
      "rate_limited",
      "Gemini rate limit reached — try again shortly",
      error,
    );
  }
  if (/401|403|API key|permission/i.test(message)) {
    return new AIProviderError(
      "not_configured",
      "Gemini API key is invalid or missing permissions",
      error,
    );
  }
  return new AIProviderError(
    "provider_unavailable",
    "Gemini is currently unavailable",
    error,
  );
}
