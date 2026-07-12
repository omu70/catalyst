import Link from "next/link";
import { Command } from "lucide-react";

import { NAV_LINKS, SITE } from "@/config/site";

/* ============================================================================
   <Footer /> — quiet close of the page. Server component: zero JS shipped.
   The machine-voice legal rail keeps the instrument character to the end.
   ========================================================================== */

export function Footer(): React.JSX.Element {
  return (
    <footer className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pb-10">
      <div className="hairline-x mb-10" />

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {/* Wordmark + one-line thesis */}
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 text-ink">
            <span className="flex size-6 items-center justify-center rounded-md bg-accent-ghost">
              <Command className="size-3.5 text-accent-deep" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              {SITE.name}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-tertiary">
            {SITE.tagline} for Meta ads teams.
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-secondary transition-colors duration-200 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Legal rail — machine voice */}
      <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="machine-label">
          © {new Date().getFullYear()} {SITE.name} · All rights reserved
        </p>
        <p className="machine-label">Built for performance marketers</p>
      </div>
    </footer>
  );
}
