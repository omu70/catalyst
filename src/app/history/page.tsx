import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getSupabaseServer } from "@/lib/db/supabase-clients";
import { Navbar } from "@/components/layout/Navbar";
import { ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   /history — the user's strategy memory. Server component: session-aware
   Supabase client + RLS means the query can only ever return the caller's
   own rows. Three states: signed-out, empty, list.
   ========================================================================== */

export const metadata: Metadata = { title: "My analyses" };
export const dynamic = "force-dynamic";

interface AnalysisRow {
  id: string;
  created_at: string;
  shopify_url: string | null;
  product_details: string;
  universe: { executiveSummary?: string; angles?: unknown[] };
}

export default async function HistoryPage(): Promise<React.JSX.Element> {
  const supabase = await getSupabaseServer();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  let rows: AnalysisRow[] = [];
  if (supabase && user) {
    const { data } = await supabase
      .from("catalyst_analyses")
      .select("id, created_at, shopify_url, product_details, universe")
      .order("created_at", { ascending: false })
      .limit(50);
    rows = (data as AnalysisRow[] | null) ?? [];
  }

  return (
    <main className="relative z-10 min-h-svh">
      <Navbar />
      <section className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pt-36 pb-24">
        <p className="machine-label mb-3">Strategy memory</p>
        <h1 className="text-display font-semibold tracking-tight text-ink">
          My <span className="editorial text-lit-accent">analyses.</span>
        </h1>

        {/* Signed out */}
        {!user && (
          <div className="glass-panel mt-12 max-w-xl rounded-[--radius-panel] p-10">
            <h2 className="text-title font-semibold text-ink">
              Sign in to build memory
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
              Signed-in analyses are saved here forever — and once you mark
              which hypotheses you tested and which won, Catalyst starts
              learning what works for your brand.
            </p>
            <ButtonLink href="/login" variant="primary" size="md" className="mt-7">
              Sign in
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </ButtonLink>
          </div>
        )}

        {/* Signed in, no analyses yet */}
        {user && rows.length === 0 && (
          <div className="glass-panel mt-12 max-w-xl rounded-[--radius-panel] p-10">
            <h2 className="text-title font-semibold text-ink">
              Nothing saved yet
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
              Run your first analysis and it will appear here automatically.
            </p>
            <ButtonLink href="/analyze" variant="primary" size="md" className="mt-7">
              Run the engine
              <ArrowUpRight className="size-4" strokeWidth={2.25} />
            </ButtonLink>
          </div>
        )}

        {/* List */}
        {user && rows.length > 0 && (
          <div className="mt-12 flex flex-col gap-4">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/analyze?id=${row.id}`}
                className="glass-panel group block rounded-[--radius-panel] p-6 transition-colors duration-200 hover:bg-glass-bright"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold text-ink">
                    {row.shopify_url ?? row.product_details.slice(0, 80)}
                  </span>
                  <span className="machine-label">
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {Array.isArray(row.universe?.angles)
                      ? `${row.universe.angles.length} hypotheses`
                      : "saved"}
                  </span>
                </div>
                {row.universe?.executiveSummary && (
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-ink-secondary">
                    {row.universe.executiveSummary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
