"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/* ============================================================================
   Browser Supabase client — anon key, cookie-backed session, RLS-enforced.
   Singleton per tab; returns null when auth env isn't configured so the
   app degrades gracefully to anonymous mode.
   ========================================================================== */

let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    cached = null;
    return cached;
  }
  cached = createBrowserClient(url, anonKey);
  return cached;
}
