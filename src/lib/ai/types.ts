/* ============================================================================
   AI provider abstraction — the seam that keeps Catalyst vendor-independent.

   Business logic (services/) depends ONLY on this interface. Gemini, OpenAI,
   Claude, Groq, Mistral, OpenRouter — each is an adapter in providers/.
   Swapping vendors is a factory change, never a business-logic change.
   ========================================================================== */

/** Parameters for a structured-JSON generation call. */
export interface GenerateJsonParams {
  /** System persona/instructions. */
  system: string;
  /** The user-turn prompt. */
  prompt: string;
  /**
   * Human-readable JSON contract appended to the prompt AND (where the
   * vendor supports it) enforced natively. Validation still happens with
   * zod at the service layer — providers are never trusted.
   */
  schemaDescription: string;
  /** 0–1. Strategy generation runs low (0.4) for consistency. */
  temperature?: number;
  /** Abort signal — the service layer owns timeout policy, not providers. */
  signal?: AbortSignal;
}

/** Every adapter implements exactly this. */
export interface AIProvider {
  /** Vendor identifier for logs/telemetry. */
  readonly name: string;
  /**
   * Generate a JSON document. Returns the PARSED (JSON.parse'd) but
   * UNVALIDATED value — schema validation is the service layer's job.
   * Must throw AIProviderError (never vendor-specific errors).
   */
  generateJson(params: GenerateJsonParams): Promise<unknown>;
}

/** Stable error taxonomy — vendor exceptions are mapped into these codes. */
export type AIErrorCode =
  | "not_configured" // missing API key / provider misconfigured
  | "provider_timeout" // aborted by our deadline
  | "rate_limited" // vendor 429
  | "provider_unavailable" // vendor 5xx / network failure
  | "invalid_response"; // vendor returned non-JSON or empty

export class AIProviderError extends Error {
  readonly code: AIErrorCode;
  /** Overrides ES2022 Error#cause with an explicit, typed assignment. */
  override readonly cause?: unknown;

  constructor(code: AIErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.cause = cause;
  }
}

/** Type guard used by the API route's error mapper. */
export function isAIProviderError(error: unknown): error is AIProviderError {
  return error instanceof AIProviderError;
}
