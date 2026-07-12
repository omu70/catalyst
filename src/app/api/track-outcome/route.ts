import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/db/supabase-clients";

/* ============================================================================
   POST /api/track-outcome — THE LEARNING LOOP'S INTAKE.

   A signed-in user marks a hypothesis as tested / won / lost. RLS enforces
   ownership (authenticated inserts only, auth.uid() must match), so this
   route stays thin: validate, upsert, done.
   ========================================================================== */

const OutcomeSchema = z.object({
  analysisId: z.string().uuid(),
  hypothesisTitle: z.string().min(3).max(120),
  status: z.enum(["tested", "won", "lost"]),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body must be JSON" },
      { status: 400 },
    );
  }

  const parsed = OutcomeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid outcome payload" },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Auth is not configured" },
      { status: 503 },
    );
  }
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json(
      { ok: false, error: "Sign in to track outcomes" },
      { status: 401 },
    );
  }

  const { error } = await supabase.from("catalyst_outcomes").upsert(
    {
      analysis_id: parsed.data.analysisId,
      user_id: userData.user.id,
      hypothesis_title: parsed.data.hypothesisTitle,
      status: parsed.data.status,
      note: parsed.data.note ?? null,
    },
    { onConflict: "analysis_id,user_id,hypothesis_title" },
  );

  if (error) {
    console.error("[track-outcome] upsert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Could not save outcome" },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
