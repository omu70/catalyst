/**
 * Site-level configuration — the single source for product copy constants,
 * navigation structure, and metadata. No component hardcodes these strings.
 */

export const SITE = {
  name: "Catalyst",
  tagline: "The Creative Intelligence Platform",
  description:
    "Paste your product and audience. Catalyst maps every angle you could run, flags the gaps your competitors miss, and hands your buyer a four-week test plan — before you brief a single creator.",
  url: "https://catalyst.app",
} as const;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Methodology", href: "/#process" },
  { label: "Analyze", href: "/analyze" },
  { label: "History", href: "/history" },
] as const;

/**
 * Hero telemetry strip — HONEST product facts only. No invented performance
 * claims: this product sells to professional skeptics, and one fabricated
 * number discovered = trust gone forever. Real aggregate outcomes replace
 * these once the learning loop has data.
 */
export interface HeroMetric {
  readonly value: string;
  readonly label: string;
}

export const HERO_METRICS: readonly HeroMetric[] = [
  { value: "90s", label: "Brief → tested roadmap" },
  { value: "6–12", label: "Falsifiable hypotheses per run" },
  { value: "4 wks", label: "Sequenced testing plan" },
] as const;
