# Catalyst

**The Creative Intelligence Platform** — an AI system that decodes your product, your customer, and your creative universe, then hands your Meta ads team the exact testing roadmap to run next.

**Art direction: Emerald Ledger · Daylight.** Warm paper canvas, green-cast near-black ink, emerald + bronze accents used semantically, Instrument Serif italics against Geist — a printed private-banking ledger, not an AI template. Tokens are semantic (`accent`/`data`/`ink`/`line`): swapping the entire palette (or flipping back to dark) touches only the `@theme` block in `globals.css`.

---

## Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 (App Router, RSC-first, Turbopack)        |
| Language   | TypeScript — strict + `noUncheckedIndexedAccess`     |
| Styling    | Tailwind CSS v4 (CSS-first tokens via `@theme`)      |
| Motion     | Framer Motion (variant grammar) + GSAP (SplitText typography choreography) |
| 3D         | React Three Fiber + Three.js (single-draw-call field) |
| Data/Auth  | Supabase (PostgreSQL) — wired in Phase 2+            |
| AI         | Google Gemini via provider-agnostic service layer    |

> **Note on `tailwind.config.ts`:** Tailwind v4 replaced the JS config with
> CSS-first tokens. The entire design system lives in
> `src/app/globals.css` under `@theme` — same power, runtime-themable,
> and the tokens are real CSS variables.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys (Phase 2+)
npm run dev
```

## Architecture

```
src/
├── app/                  # Routes only — composition shells, no logic
│   ├── globals.css       # THE design system: tokens, utilities, keyframes
│   ├── layout.tsx        # Fonts, metadata, atmosphere layer (RSC)
│   └── page.tsx          # Landing composition (RSC)
├── components/
│   ├── layout/           # Chrome: Navbar, BackgroundLayer
│   ├── marketing/        # Landing sections: Hero
│   ├── three/            # WebGL: IntelligenceField (client-only chunk)
│   └── ui/               # Primitives: Button (variant-driven, motion built in)
├── config/               # site.ts — copy, nav, metrics. Zero magic strings.
└── lib/
    ├── motion/           # springs.ts (physics constants), variants.ts (grammar)
    └── utils/            # cn.ts — canonical className composer
```

**Rules of the codebase**

1. No component introduces ad-hoc colors, shadows, or easing — everything resolves to a token in `globals.css`.
2. Motion is a shared grammar: components import named variants/springs, never inline physics numbers.
3. Animate only compositor properties (`transform`, `opacity`, `filter`). Never layout properties.
4. `app/` files are composition shells. Logic lives in `lib/`, UI in `components/`.
5. Strict TS: no `any`, no ignored errors, indexed access is checked.

## Performance contract

- WebGL field = **one draw call** (1,600 nodes in a single `THREE.Points`), DPR capped at 1.75, zero allocations per frame.
- Three.js is code-split via `next/dynamic` (`ssr: false`) — never blocks first paint, never enters the server bundle.
- `prefers-reduced-motion` disables the WebGL layer and all ambient loops while keeping the full brand atmosphere.
- Fonts self-hosted via the `geist` package — deterministic builds, no third-party fetch.

## Roadmap

- **Phase 1 — Foundation & bespoke UI** ✅ design tokens, motion grammar (Framer + GSAP SplitText), WebGL atmosphere, navbar, hero, strategy console.
- **Phase 2 — The Brain** ✅ `/api/generate-strategy` (zod-validated, typed error taxonomy), provider-agnostic AI layer (`AIProvider` seam), Gemini adapter with native JSON mode, mock adapter for dev/CI, the Creative Strategist prompt framework, 90s timeout + one corrective retry on schema mismatch.
- **Phase 3 — Intelligence Dashboard** `<CreativeMatrix />`, `<TestingRoadmap />`, understanding cards, input engine wired to the API, staggered data-resolve choreography.

### Trying the engine now

```bash
# Without a key (deterministic fixture):
AI_PROVIDER=mock npm run dev

# With Gemini (get a key at aistudio.google.com):
echo "GEMINI_API_KEY=your_key" >> .env.local && npm run dev

curl -X POST http://localhost:3000/api/generate-strategy \
  -H "Content-Type: application/json" \
  -d '{"productDetails":"<what you sell, price, differentiator>","targetAudience":"<who buys it>"}'
```
