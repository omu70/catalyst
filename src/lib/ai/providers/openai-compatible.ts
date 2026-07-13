import {
  AIProviderError,
  type AIProvider,
  type GenerateJsonParams,
} from "@/lib/ai/types";

/* ============================================================================
   OpenAI-compatible adapter — one adapter, many vendors.

   Groq, Mistral, Cerebras, OpenRouter, Together, DeepSeek, and OpenAI itself
   all speak the same /chat/completions dialect. This adapter turns every one
   of them into a Catalyst provider through three env vars:

     AI_PROVIDER=openai-compat
     OPENAI_COMPAT_BASE_URL   e.g. https://api.groq.com/openai/v1
     OPENAI_COMPAT_API_KEY    the vendor key
     OPENAI_COMPAT_MODEL      e.g. llama-3.3-70b-versatile

   Zero SDK dependency — plain fetch, JSON mode requested via
   response_format, and vendor errors mapped to the stable taxonomy.
   ========================================================================== */

const DEFAULT_TEMPERATURE = 0.4;

export class OpenAICompatibleProvider implements AIProvider {
  readonly name: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;

  constructor(baseUrl: string, apiKey: string, model: string) {
    // Normalize: accept with or without trailing slash.
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = apiKey;
    this.model = model;
    this.name = `openai-compat(${new URL(this.baseUrl).hostname})`;
  }

  async generateJson(params: GenerateJsonParams): Promise<unknown> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: params.temperature ?? DEFAULT_TEMPERATURE,
          // Most compatible vendors honor this; those that don't still get
          // the JSON contract in the prompt, and zod validates downstream.
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: params.system },
            { role: "user", content: params.prompt },
          ],
        }),
        signal: params.signal ?? null,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AIProviderError(
          "provider_timeout",
          "Strategy generation timed out",
          error,
        );
      }
      throw new AIProviderError(
        "provider_unavailable",
        "AI provider is unreachable",
        error,
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw mapHttpError(response.status, body);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      throw new AIProviderError(
        "invalid_response",
        "AI provider returned non-JSON transport payload",
        error,
      );
    }

    const raw = extractContent(payload);
    if (!raw || raw.trim().length === 0) {
      throw new AIProviderError(
        "invalid_response",
        "AI provider returned an empty completion",
      );
    }

    try {
      return JSON.parse(stripFences(raw)) as unknown;
    } catch (error) {
      throw new AIProviderError(
        "invalid_response",
        "AI provider returned malformed JSON",
        error,
      );
    }
  }
}

/** choices[0].message.content, defensively. */
function extractContent(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const message = (choices[0] as { message?: { content?: unknown } }).message;
  return typeof message?.content === "string" ? message.content : null;
}

/** Some open models fence their JSON despite json_object mode. */
function stripFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
}

function mapHttpError(status: number, body: string): AIProviderError {
  if (status === 429) {
    return new AIProviderError(
      "rate_limited",
      "AI provider rate limit reached — try again shortly",
      body,
    );
  }
  if (status === 401 || status === 403) {
    return new AIProviderError(
      "not_configured",
      "AI provider API key is invalid or missing permissions",
      body,
    );
  }
  if (status >= 500) {
    return new AIProviderError(
      "provider_unavailable",
      "AI provider is currently unavailable",
      body,
    );
  }
  return new AIProviderError(
    "provider_unavailable",
    `AI provider rejected the request (HTTP ${status})`,
    body,
  );
}
