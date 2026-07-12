# Catalyst

**The Creative Intelligence Platform** — an AI system that decodes your product, your customer, and your creative universe, then hands your Meta ads team the exact testing roadmap to run next.

**Art direction: Molten Obsidian.** Warm charcoal blacks (zero blue cast), ivory ink, ember + brass accents used semantically, Instrument Serif italics against Geist, and a forge-light atmosphere — a precision instrument, not an AI template.

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

- **Phase 1 — Foundation & bespoke UI** ✅ *(this commit)* design tokens, motion grammar, WebGL atmosphere, navbar, hero.
- **Phase 2 — The Gemini Brain** `/api/generate-strategy` route, provider-agnostic AI service, structured JSON "Creative Universe" schema, input validation, full error taxonomy.
- **Phase 3 — Intelligence Dashboard** `<CreativeMatrix />`, `<TestingRoadmap />`, understanding cards, staggered data-resolve choreography.
