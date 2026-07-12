import type { Metadata } from "next";

import { getSupabaseServer } from "@/lib/db/supabase-clients";
import {
  CreativeUniverseSchema,
  type CreativeUniverse,
} from "@/types/creative-universe";
import { Navbar } from "@/components/layout/Navbar";
import { AnalyzeView } from "@/components/dashboard/AnalyzeView";

/* ============================================================================
   /analyze — the product. Server shell; when ?id= references one of the
   caller's saved analyses (RLS-enforced), it hydrates the dashboard with
   the stored universe — the history revisit flow.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Analyze",
  description:
    "Feed Catalyst your product and audience — get your Creative Universe: falsifiable hypotheses, gaps, and a 4-week Meta testing roadmap.",
};

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await searchParams;

  let savedUniverse: CreativeUniverse | null = null;
  let savedAnalysisId: string | null = null;

  if (id) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { data } = await supabase
        .from("catalyst_analyses")
        .select("id, universe")
        .eq("id", id)
        .maybeSingle();
      const parsed = CreativeUniverseSchema.safeParse(
        (data as { universe?: unknown } | null)?.universe,
      );
      if (data && parsed.success) {
        savedUniverse = parsed.data;
        savedAnalysisId = (data as { id: string }).id;
      }
    }
  }

  return (
    <main className="relative z-10 min-h-svh">
      <Navbar />
      <AnalyzeView
        savedUniverse={savedUniverse}
        savedAnalysisId={savedAnalysisId}
      />
    </main>
  );
}
