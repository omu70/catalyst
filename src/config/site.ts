/**
 * Site-level configuration — the single source for product copy constants,
 * navigation structure, and metadata. No component hardcodes these strings.
 */

export const SITE = {
  name: "Catalyst",
  tagline: "The Creative Intelligence Platform",
  description:
    "Catalyst decodes your product, your customer, and your creative universe — then hands you the exact testing roadmap your Meta ads team should run next.",
  url: "https://catalyst.app",
} as const;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Platform", href: "#platform" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Roadmaps", href: "#roadmaps" },
  { label: "Pricing", href: "#pricing" },
] as const;

/**
 * Hero telemetry strip — outcome-first proof points.
 * These are marketing placeholders until live aggregate metrics exist;
 * keeping them typed + centralized means swapping in real data is a
 * one-file change.
 */
export interface HeroMetric {
  readonly value: string;
  readonly label: string;
}

export const HERO_METRICS: readonly HeroMetric[] = [
  { value: "-31%", label: "Median CPA delta" },
  { value: "2.4×", label: "Creative testing velocity" },
  { value: "48h", label: "Brief → live variant" },
] as const;
