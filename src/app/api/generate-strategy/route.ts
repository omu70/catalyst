import { NextResponse } from "next/server";

import { isAIProviderError, type AIErrorCode } from "@/lib/ai/types";
import { generateCreativeUniverse } from "@/lib/services/strategy-service";
import {
  StrategyInputSchema,
  type StrategyResponse,
} from "@/types/creative-universe";

/* ============================================================================
   POST /api/generate-strategy — the single entry point to the engine.

   Contract:
   - Body: StrategyInput (validated with zod; 400 + fieldErrors on failure)
   - Success: { ok: true, universe: CreativeUniverse }
   - Failure: { ok: false, error: { code, message } } with a stable code the
     client switches on. Internals are never leaked to the response.

   Node runtime (not edge): generation runs up to 90s and uses the vendor SDK.
   ========================================================================== */

export const runtime = "nodejs";
export const maxDuration = 120;

/** AIErrorCode → HTTP status. Single source for the route's error surface. */
const ERROR_STATUS: Record<AIErrorCode, number> = {
  not_configured: 503,
  provider_timeout: 504,
  rate_limited: 429,
  provider_unavailable: 502,
  invalid_response: 502,
};

/** Client-safe messages — never echo provider internals. */
const ERROR_MESSAGE: Record<AIErrorCode, string> = {
  not_configured:
    "The engine is not configured yet. Add an AI provider key and retry.",
  provider_timeout: "Generation took too long. Try again.",
  rate_limited: "The engine is at capacity. Wait a moment and retry.",
  provider_unavailable: "The AI provider is unavailable. Try again shortly.",
  invalid_response: "The engine returned an unusable result. Try again.",
};

export async function POST(request: Request): Promise<NextResponse<StrategyResponse>> {
  /* 1 · Parse body — malformed JSON is a client error, not a crash. */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "invalid_input", message: "Request body must be JSON" },
      } satisfies StrategyResponse,
      { status: 400 },
    );
  }

  /* 2 · Validate input against the domain schema. */
  const parsed = StrategyInputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_root";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "invalid_input",
          message: "Check the highlighted fields and try again",
          fieldErrors,
        },
      } satisfies StrategyResponse,
      { status: 400 },
    );
  }

  /* 3 · Generate — all failures arrive as AIProviderError with stable codes. */
  try {
    const universe = await generateCreativeUniverse(parsed.data);
    return NextResponse.json(
      { ok: true, universe } satisfies StrategyResponse,
      { status: 200 },
    );
  } catch (error) {
    if (isAIProviderError(error)) {
      // Log the real cause server-side; return only the safe surface.
      console.error(
        `[generate-strategy] ${error.code}: ${error.message}`,
        error.cause ?? "",
      );
      return NextResponse.json(
        {
          ok: false,
          error: { code: error.code, message: ERROR_MESSAGE[error.code] },
        } satisfies StrategyResponse,
        { status: ERROR_STATUS[error.code] },
      );
    }

    console.error("[generate-strategy] unexpected:", error);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "internal", message: "Something went wrong. Try again." },
      } satisfies StrategyResponse,
      { status: 500 },
    );
  }
}
