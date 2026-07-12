import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/* ============================================================================
   Supabase SSR clients — session-aware, anon-key, RLS-enforced.

   Distinct from supabase-admin.ts (service role, bypasses RLS): these
   clients act AS the signed-in user, so RLS policies are the security
   boundary. Server-only module (uses next/headers).
   ========================================================================== */

/** True when the public Supabase env vars exist (auth features enabled). */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Session-aware server client, or null when auth isn't configured. */
export async function getSupabaseServer(): Promise<SupabaseClient | null> {
  if (!isAuthConfigured()) return null;

  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot set cookies — safe to ignore; the
            // middleware-free setup refreshes sessions on route handlers.
          }
        },
      },
    },
  );
}

/** The signed-in user's id, or null (anonymous / auth not configured). */
export async function getSessionUserId(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
