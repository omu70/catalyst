import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Editorial voice — Instrument Serif italics, self-hosted via @fontsource
// (deterministic builds, no third-party font fetch).
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";

import { SITE } from "@/config/site";
import { BackgroundLayer } from "@/components/layout/BackgroundLayer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

import "./globals.css";

/* ============================================================================
   Root layout — server component.

   Owns: fonts, metadata, the fixed atmosphere layer, and the content stack.
   Contains zero interactivity itself; all motion lives in client leaf
   components so the RSC payload stays minimal.
   ========================================================================== */

/*
 * Fonts: the official `geist` package self-hosts the files inside the repo,
 * so builds are deterministic (no network fetch to Google Fonts at build
 * time) and the font is served from our own edge. GeistSans/GeistMono
 * already expose the --font-geist-sans / --font-geist-mono CSS variables
 * that globals.css consumes.
 */

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        {/* Inertial smooth scrolling — makes every scroll effect feel liquid */}
        <SmoothScroll />
        {/* Fixed atmosphere — washes, WebGL motes, grid, grain, vignette */}
        <BackgroundLayer />
        {/* Content stack — everything scrolls above the atmosphere */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
