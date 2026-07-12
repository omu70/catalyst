import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/db/supabase-clients";

/* ============================================================================
   GET /auth/callback — magic-link landing. Exchanges the one-time code for
   a session cookie, then sends the user to their history.
   ========================================================================== */

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(new URL("/history", url.origin));
}
