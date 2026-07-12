import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ============================================================================
   Supabase admin client — SERVER ONLY.

   Uses the service_role key, which bypasses RLS; it must never be imported
   from a client component (no NEXT_PUBLIC_ prefix on the key guarantees the
   bundler cannot leak it).

   Persistence is deliberately OPTIONAL: when env vars are absent (local dev
   without keys, CI), the app runs fine and simply skips saving. This keeps
   the engine usable with zero infrastructure.
   ========================================================================== */

let cached: SupabaseClient | null | undefined;

/** Returns the admin client, or null when persistence isn't configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return cached;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
