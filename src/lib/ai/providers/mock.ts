import type { AIProvider, GenerateJsonParams } from "@/lib/ai/types";
import { SAMPLE_UNIVERSE } from "@/config/sample-universe";

/* ============================================================================
   Mock adapter — deterministic Creative Universe for development and CI.

   Activated with AI_PROVIDER=mock. Returns the shared sample fixture so the
   entire product can be built, demoed, and end-to-end tested without an
   API key or network access.
   ========================================================================== */

/** Simulated engine latency so loading states are honest in development. */
const SIMULATED_LATENCY_MS = 1200;

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
    return structuredClone(SAMPLE_UNIVERSE);
  }
}
