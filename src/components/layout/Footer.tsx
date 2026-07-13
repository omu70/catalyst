import Link from "next/link";
import { Command } from "lucide-react";

import { SITE } from "@/config/site";

/* ============================================================================
   <Footer /> — the ElevenLabs-pattern close: a rich multi-column directory
   over the dark band, signed off with a giant dimmed wordmark. Server
   component: zero JS shipped. surface-dark re-themes every token inside.
   ========================================================================== */

const COLUMNS: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    heading: "Product",
    links: [
      { label: "What it does", href: "/#what" },
      { label: "Sample output", href: "/#sample" },
      { label: "Methodology", href: "/#process" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Analyze a store", href: "/analyze" },
      { label: "Past analyses", href: "/history" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer(): React.JSX.Element {
  return (
    /* Dark closing band — part of the 30% black. Runs full-bleed. */
    /* Fused beneath the CTA horizon — one continuous dark close. */
    <footer className="surface-dark print:hidden relative z-10 overflow-hidden bg-void">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] pt-16 pb-8">
        {/* ————— Directory grid ————— */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="max-w-xs lg:col-span-5">
            <div className="flex items-center gap-2.5 text-ink">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent-ghost">
                <Command className="size-3.5 text-accent-deep" strokeWidth={2.25} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-tertiary">
              The creative intelligence platform for Meta advertisers. Know
              what to test before you spend — and bank the learning either
              way.
            </p>
            <p className="machine-label mt-6">
              Built for performance marketers
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column, i) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className={
                i === 0 ? "lg:col-span-2 lg:col-start-7" : "lg:col-span-2"
              }
            >
              <p className="machine-label mb-4">{column.heading}</p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-secondary transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ————— Legal rail ————— */}
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="machine-label">
            © {new Date().getFullYear()} {SITE.name} · All rights reserved
          </p>
          <p className="machine-label">
            Uses public data from the Meta Ad Library
          </p>
        </div>
      </div>

      {/* ————— The giant sign-off wordmark ————— */}
      <div aria-hidden className="pointer-events-none select-none">
        <p className="mx-auto w-[min(1180px,calc(100%-2rem))] translate-y-[18%] bg-gradient-to-b from-[rgb(244_244_246/0.14)] to-[rgb(244_244_246/0.01)] bg-clip-text text-center text-[clamp(4rem,14.5vw,13rem)] leading-none font-semibold tracking-tight text-transparent">
          CATALYST
        </p>
      </div>
    </footer>
  );
}
