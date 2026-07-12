import { NextResponse } from "next/server";

import { isAIProviderError, type AIErrorCode } from "@/lib/ai/types";
import { generateCreativeUniverse } from "@/lib/services/strategy-service";
import { saveAnalysis } from "@/lib/services/analysis-repository";
import { getSessionUserId } from "@/lib/db/supabase-clients";
import { checkRateLimit } from "@/lib/utils/rate-limit";
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
/* 60s fits every host tier (incl. Vercel Hobby); Gemini Flash typically
   completes in 10–30s. The service's own budget is set separately below
   the host ceiling. */
export const maxDuration = 60;

/** Per-client budget: 5 generations per 10 minutes protects AI spend. */
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } as const;

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
  /* 0 · App rate limit — keyed by forwarded client IP. Disabled in local
     development so testing is never throttled by our own budget. */
  if (process.env.NODE_ENV === "production") {
    const clientKey =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const rate = checkRateLimit(clientKey, RATE_LIMIT);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "app_rate_limited",
            message: `Analysis limit reached — try again in about ${Math.max(1, Math.ceil(rate.retryAfterSeconds / 60))} min.`,
          },
        } satisfies StrategyResponse,
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        },
      );
    }
  }

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
    const startedAt = Date.now();
    const universe = await generateCreativeUniverse(parsed.data);

    /* 4 · Persist (non-fatal) — the customer gets their result regardless.
       Signed-in runs are owned by the user (history + learning loop). */
    const userId = await getSessionUserId().catch(() => null);
    const analysisId = await saveAnalysis(
      parsed.data,
      universe,
      {
        provider: process.env.AI_PROVIDER ?? "gemini",
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
        generationMs: Date.now() - startedAt,
      },
      userId,
    );

    return NextResponse.json(
      {
        ok: true,
        universe,
        ...(analysisId ? { analysisId } : {}),
      } satisfies StrategyResponse,
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
