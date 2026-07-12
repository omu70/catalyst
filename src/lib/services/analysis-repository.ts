import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import type {
  CreativeUniverse,
  StrategyInput,
} from "@/types/creative-universe";

/* ============================================================================
   Analysis repository — persistence for generated Creative Universes.

   Design decisions:
   - NON-FATAL: a database hiccup must never cost a customer their result.
     The universe was already generated and validated; if the insert fails
     we log and return null, and the API still returns the strategy.
   - Server-only module (imports the admin client).
   ========================================================================== */

export interface AnalysisTelemetry {
  provider: string;
  model?: string;
  generationMs: number;
}

/** Persists an analysis; returns its id, or null when skipped/failed. */
export async function saveAnalysis(
  input: StrategyInput,
  universe: CreativeUniverse,
  telemetry: AnalysisTelemetry,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null; // persistence not configured — run stateless

  try {
    const { data, error } = await supabase
      .from("catalyst_analyses")
      .insert({
        shopify_url: input.shopifyUrl ?? null,
        product_details: input.productDetails,
        target_audience: input.targetAudience,
        universe,
        provider: telemetry.provider,
        model: telemetry.model ?? null,
        generation_ms: telemetry.generationMs,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[analysis-repository] insert failed:", error.message);
      return null;
    }
    return (data as { id: string }).id;
  } catch (error) {
    console.error("[analysis-repository] unexpected:", error);
    return null;
  }
}
