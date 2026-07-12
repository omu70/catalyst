import type {
  StrategyInput,
  StrategyResponse,
} from "@/types/creative-universe";

/* ============================================================================
   Typed API client — the ONLY place the browser talks to the engine.

   Guarantees to callers:
   - Always resolves to a StrategyResponse (never throws to the UI layer).
   - Network failures, aborts, and non-JSON responses are folded into the
     same stable error-code taxonomy the server uses.
   ========================================================================== */

/** Client-side ceiling — slightly above the server's 90s generation budget. */
const REQUEST_TIMEOUT_MS = 120_000;

export async function requestStrategy(
  input: StrategyInput,
): Promise<StrategyResponse> {
  try {
    const response = await fetch("/api/generate-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    // The route always returns a StrategyResponse envelope — even on 4xx/5xx.
    const payload = (await response.json()) as StrategyResponse;
    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return {
        ok: false,
        error: {
          code: "provider_timeout",
          message: "The engine took too long to respond.",
        },
      };
    }
    return {
      ok: false,
      error: {
        code: "provider_unavailable",
        message: "Could not reach the engine. Check your connection and retry.",
      },
    };
  }
}
