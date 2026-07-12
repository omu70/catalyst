# CATALYST — Complete System Audit

**Date:** 2026-07-12 · **Auditor:** acting Staff Eng / PM / CTO / Security / QA / Creative Strategist
**Scope:** full codebase + live deployment (catalyst-ten-zeta.vercel.app) + live end-to-end test
**Method:** evidence over opinion. Every finding below was verified in code, in the production build, or against the live deployment.

---

## 0 · Executive summary

Catalyst has a genuinely strong foundation — clean provider-agnostic architecture, schema-enforced AI output, a distinctive design system, real error taxonomy — wrapped around a product that is **not yet a business**: no accounts, no way for users to retrieve what they paid attention to create, an engine that currently fails in production on a quota-starved free API key, and "intelligence" that is entirely model-generated with zero proprietary data. It is a very good **demo of a product**. Verdict: **Private Beta** at most. Public launch would burn first impressions on a broken analyze flow.

**The single live-blocking bug (verified):** production `/api/generate-strategy` returns 429 from the *provider path* (no Retry-After header = Gemini's own refusal, not our limiter). The deployed Gemini key is free-tier and exhausted. Until billing is enabled or the key replaced, the core product does not function for anyone.

---

## 1 · Product vision — 6/10

Positioning is clear and honest: creative *strategy* engine, not a copywriter. The 10-second test mostly passes: "Know your next winning ad before you spend a dollar" + a visible product artifact communicates fast.

Brutal problems:
- **The proof is fabricated.** "-31% median CPA delta", "2.4× testing velocity", "217 media buyers switched" — invented placeholder numbers presented as fact, and the frame says "OUTPUT SHOWN IS A REAL ENGINE RUN" over hardcoded mock data. To a skeptical media buyer (the exact persona), discovered fabrication = instant dead trust. This is the fastest way to lose the audience the product targets.
- Would agencies pay? Not yet — agencies need multi-client workspaces, exports, and白-label outputs. Would brands pay? Possibly $49–99/mo IF the output survives their first sniff test. Daily use? No — nothing pulls a user back (no saved history, no tracking of what they actually tested).

## 2 · UX — 5/10

Working well: full state machine (idle/loading/error/timeout), honest loading narration, per-cause error panels with retry, reduced-motion handling, keyboard focus rings.

Failures:
- **Mobile navigation does not exist.** Nav links are `hidden md:flex` with no hamburger. Phone users cannot navigate the site at all. Critical.
- **Dead UI everywhere:** "Sign in" does nothing. "Pricing" links to `/#pricing` — an anchor that doesn't exist. Footer repeats the dead links. Every dead control teaches users the product is unfinished.
- Results are **ephemeral** — refresh and the strategy is gone forever (it's in the DB, but no user can reach it). This makes the 90-second wait feel risky.
- No onboarding/example: an empty form with no "try a sample" path wastes the most motivated moment of a first visit.
- 60s+ waits with no streaming — narration helps, but a single long await with no partial output is fragile UX (and a lost connection loses everything).
- Intermittent (observed once in live testing, unreproduced): after a 429 the UI returned to idle instead of the error panel. Needs a client-side race investigation in `strategy-store` (guard `get().input !== input` may drop legitimate error states on rapid resubmits).

## 3 · Design quality — 7.5/10

The 70/20/10 system (white editorial canvas / black instrument surfaces / cobalt pop), dual-scope tokens, serif-italic editorial moments, magnetic buttons, spotlight cards, scroll-reactive field — this does NOT read as a Tailwind template, and the dark product frame is a genuinely premium move. Weaknesses: four art-direction pivots left minor voice drift (copy still says "ninety seconds" in two different tones); landing has only 3 sections — thin versus the references (no social proof section, no FAQ, no pricing); Awwwards shortlist plausible for the landing, not a win without a signature interactive moment.

## 4 · Architecture — 7.5/10

Genuinely good: strict TS + `noUncheckedIndexedAccess`, zero `any`; clean seams (`AIProvider` interface, semantic tokens, zod as single source of truth shared by client validation, server validation, and prompt contract); RSC shells with client leaves; non-fatal persistence.

Debts:
- **Zero automated tests.** No unit tests for the schema edge cases, no integration test for the route, no CI. The E2E "suite" is manual Playwright runs in a chat session. For a revenue product this is the largest engineering debt.
- No monitoring: `console.error` is the entire observability story. No Sentry, no structured logs, no alerting. You will learn about outages from angry users.
- In-memory rate limiter is per-instance and resets each deploy; keyed on spoofable `x-forwarded-for`. Fine for beta, not for launch (needs Upstash/Redis + better keying).
- `catalyst_analyses` is write-only in practice — data with no read path and no retention policy is a liability, not an asset, until history ships.

## 5 · AI system — 5.5/10

Good: native JSON mode + zod validation + one corrective retry that feeds validator errors back; stable error taxonomy; 50s budget under the 60s host ceiling; deterministic mock for dev/CI.

Weak:
- **`shopifyUrl` is accepted and then ignored.** The form promises store analysis; the engine never fetches the store. This is a product lie until store-intel ships (was scoped, not yet built).
- Prompt-injection surface: user text is interpolated raw into the prompt; the system prompt never instructs the model to treat user content as data. Add an explicit guard line + delimiters. (Output-side risk IS mitigated by schema validation — good.)
- Model-invented "scores" (92, 87…) present pseudo-precision with zero grounding. A strategist reading "92" will ask "of what?" — no answer exists.
- No streaming, no partial results, no cost tracking per analysis, no eval harness measuring output quality drift across prompt changes.

## 6 · Creative intelligence — 6/10 (the honest core)

What the schema forces is real strategist structure: JTBD, pains, outcomes, awareness diagnosis, angle×stage matrix, gaps, sequenced 4-week plan with success metrics. Mock/live outputs are specific and shootable — clearly above "ChatGPT, give me ad ideas."

What's missing vs. a $100M-brand strategist: **objections and counter-messaging, purchase triggers, competitor ad intelligence** (the schema has no competitor dimension at all), offer/landing-page congruence, seasonal context. Could an agency cut 50 distinct creatives from one report? No — from 6–12 angles with one hook each, realistically 15–20 before repetition. The fix is depth per angle (3 hooks, 3 formats each) + the missing psychological dimensions. And the deepest strategic truth: **Foreplay/MagicBrief own real ad-library data; Catalyst reasons from a text box.** Without ingesting real signals (the store, its ads, its competitors' ads), the moat is a prompt — and prompts don't defend.

## 7 · Output quality — 6.5/10 · specific and prioritized, yes; unique and trusted, partially (scores undermine trust; no citations of evidence because there is no evidence ingested).

## 8 · Performance — 6/10 (measured)

Production build: static prerender for all pages (good). But **~2.6MB total JS chunks; largest chunk 868KB raw / 228KB gz** — three.js+R3F on the landing page is the bulk. That's a heavy first load for a marketing page on mobile networks; Lighthouse mobile will not be green. Fixes: lazy-mount the WebGL field only on desktop + after idle; it's already code-split but still fetched eagerly on page load; consider IntersectionObserver + `matchMedia('(min-width: 1024px)')` gating, or replace with CSS-only atmosphere on mobile. Fonts: three families is defensible but Instrument Serif could subset. No images to optimize (good). Animations are compositor-only (verified by construction) — the discipline held.

## 9 · Security — 5/10

OK: server-only secrets, zod on every input, RLS-locked table with service-role-only access, SQL injection N/A (no raw SQL), React escaping for XSS, no auth = no session vulns (by absence, not by design).

Gaps: rate limiter spoofable/per-instance (API cost abuse is the #1 realistic attack — someone scripts your endpoint and burns your Gemini bill); prompt injection unaddressed input-side; no CAPTCHA/turnstile; no request size limit beyond zod maxes; no CSP headers; no dependency audit in CI; upcoming store-fetch feature must ship with SSRF guards (private-IP/localhost blocking) or it becomes the worst hole in the app.

## 10 · Database — 6.5/10 · Schema is clean, indexed, commented, RLS-locked. Missing: `user_id` (blocked on auth), retention policy, and any read path. JSONB universe is fine at this scale.

## 11 · API — 7/10 · Single endpoint done properly: envelope contract, stable codes, correct statuses (400/429/502/503/504), Retry-After on app limit, internals never leaked. Missing: request IDs, structured logging, idempotency keys, and the split of provider-429 vs app-429 exists in code but wasn't deployed at audit time.

## 12 · Business logic — 3/10 · Generate: yes. Export/reuse/compare/organize/search/history: none of it exists. A strategy tool with no memory is a toy.

## 13 · Missing features

**Critical (blocks charging money):** auth + saved analyses + history UI; working Gemini billing; mobile nav; remove fabricated metrics or replace with real ones; pricing page (or remove the links).
**Important:** PDF/Notion export; store-intel (make `shopifyUrl` real); streaming or progress persistence; monitoring (Sentry) + uptime alert; distributed rate limiting; sample analysis ("see one first"); legal pages (privacy/terms — you're storing user business data).
**Nice:** angle → 3-hook expansion; compare two analyses; team workspaces; Meta ad-library competitor pull.
**Future:** performance feedback loop (which angles actually won — THE moat), agency multi-client, white-label reports.

## 14 · PMF — honest read

The problem is real (creative guesswork burns budgets), the wedge (strategy before spend) is smart and differentiated from the asset-library incumbents. But retention requires memory (history) and compounding (feedback on tested angles). One-shot free tool → viral spike possible; recurring revenue → needs the loop. Agencies won't adopt without exports and client separation.

## 15 · Competitive position

vs Foreplay/MagicBrief/CreativeOS (ad libraries + swipe files): they have data, Catalyst has reasoning — complementary, not substitutive; vs raw ChatGPT/Claude/Gemini: Catalyst's structured methodology, enforced schema, and instrument-grade UI beat a chat box for THIS job, but the delta must widen with proprietary inputs or it's replicable in a weekend by a competent prompt engineer. Real advantage today: the framework + the UX. Durable advantage: only the data loop (store ingestion → tested-angle outcomes) will provide it.

## 16 · Monetization (suggested)

Free: 2 analyses, watermarked export. Pro $49/mo: unlimited analyses, PDF export, history. Growth $149/mo: 3 seats, compare, competitor pulls. Agency $399/mo: 10 client workspaces, white-label. Do not launch paid before auth + history + export exist — there is literally nothing to gate today.

## 17 · Scores

Product 5.5 · UI 7.5 · UX 5 · Architecture 7.5 · Performance 6 · Security 5 · AI 5.5 · Strategy quality 6 · Business potential 6 · Scalability 6.5 · **Overall 5.9/10**

## 18 · Release decision

**⚠ Private Beta** — after (1) working Gemini key with billing, (2) mobile nav, (3) fabricated metrics removed, (4) dead links resolved. Not public: no accounts, no monitoring, no tests, spoofable rate limiting, and the trust-killing fake numbers.

## 19 · Top-50 roadmap (priority order, condensed into 10 tranches)

1. Fix Gemini billing/key; verify live E2E; add Sentry + uptime check.
2. Mobile nav; remove/replace fabricated metrics; kill dead links; sample-analysis button.
3. Supabase Auth (magic link) + user_id column + RLS policies + /history page.
4. PDF export; copy-to-clipboard per angle; shareable read-only link.
5. Store-intel: products.json ingestion w/ SSRF guards; prompt injection hardening.
6. Distributed rate limiting (Upstash) + turnstile on anonymous use.
7. Test suite: schema unit tests, route integration tests, one Playwright E2E in CI.
8. Streaming generation; per-angle hook expansion (3 hooks × formats).
9. Stripe + pricing page + plan gating; legal pages.
10. The moat: tested-angle outcome tracking → feedback into future prompts; Meta ad-library competitor context.

## 20 · Final verdict

Invest $1M? Not at today's state — but yes to the team velocity if the data loop ships. Replace my workflow? As a brainstorm-compressor, yes weekly; daily needs memory. Biggest weakness: **no proprietary data — the intelligence is rented.** Biggest strength: **the encoded methodology + schema enforcement — it thinks in strategist structure, not chat mush.** Category-defining feature: **close the loop — let users mark which angles they tested and what happened, and feed that back. Then Catalyst learns what wins per category, and no prompt-wrapper can follow.**
