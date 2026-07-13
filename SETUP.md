# Catalyst — Keys-Only Setup Runbook

Everything is built. This document is the complete list of what to paste
where. Total hands-on time: ~15 minutes (+ Meta's 1–2 week verification for
the optional competitor layer).

---

## 1 · The keys

| Env var | Required? | Where to get it | What it powers |
|---|---|---|---|
| `GEMINI_API_KEY` | **YES — nothing works without it** | aistudio.google.com → Get API key. **Enable billing on the key's Google Cloud project** (free tier exhausts in minutes; paid ≈ $0.005/analysis) | The AI engine |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase dashboard → Project Settings → API | Database + auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Same page (anon/publishable key) | Sign-in, history, outcomes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Same page (service_role — keep secret) | Saving analyses |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your deployed URL (e.g. `https://catalyst-ten-zeta.vercel.app`) | Share images, sitemap |
| `AI_PROVIDER` | Optional | `gemini` (default), `openai-compat` (Groq/Mistral/Cerebras/OpenRouter free keys), or `mock` (demo without a key) | Provider switch |
| `GEMINI_MODEL` | Optional | e.g. `gemini-2.5-flash-lite` for bigger free quota | Model choice |
| `OPENAI_COMPAT_BASE_URL` | With openai-compat | e.g. `https://api.groq.com/openai/v1` or `https://api.mistral.ai/v1` | Alt-provider endpoint |
| `OPENAI_COMPAT_API_KEY` | With openai-compat | console.groq.com / console.mistral.ai (free, no card) | Alt-provider auth |
| `OPENAI_COMPAT_MODEL` | With openai-compat | e.g. `llama-3.3-70b-versatile` (Groq) or `mistral-large-latest` | Alt-provider model |
| `META_AD_LIBRARY_TOKEN` | Optional | developers.facebook.com → app → Ad Library API access → Graph token (identity verification takes 1–2 weeks) | Competitive landscape section |

**Local dev:** copy `.env.example` → `.env.local`, fill values, `npm run dev`.
**Production (Vercel):** Project → Settings → Environment Variables → add all → **redeploy** (env changes need a fresh deployment).

## 2 · Database (run once, in order)

Supabase dashboard → SQL Editor → run:
1. `supabase/migrations/0001_catalyst_analyses.sql`
2. `supabase/migrations/0002_users_and_outcomes.sql`

## 3 · Auth URLs (run once)

Supabase → Authentication → URL Configuration:
- **Site URL:** your deployed URL
- **Redirect URLs:** add `<your-url>/auth/callback`

## 4 · Smoke test (5 minutes, on the live site)

1. Landing loads; "What it does" section reads clearly.
2. /analyze → "See a sample report" renders instantly.
3. Run a REAL analysis → hypotheses render → check Supabase
   `catalyst_analyses` table has a new row.
4. Sign in via magic link → run another analysis → it appears in /history.
5. Open a hypothesis → mark **Won** → check `catalyst_outcomes` has a row.
6. Click **Export brief** → print dialog shows a clean paper document.

When all six pass, the product is live end-to-end and the learning loop is
collecting. 🚀

## Troubleshooting

- **"The AI provider hit its quota"** → your Gemini key is throttled/exhausted.
  Enable billing or set `GEMINI_MODEL=gemini-2.5-flash-lite`. This is a Google
  account issue, never an app bug.
- **"The engine isn't configured"** → `GEMINI_API_KEY` missing in the
  environment the server is running in (check Vercel env + redeploy).
- **Magic link lands on localhost** → fix Site URL / Redirect URLs (step 3).
- **Analyses not saving** → `SUPABASE_SERVICE_ROLE_KEY` missing, or
  migration 0001 not run.
