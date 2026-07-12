import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { ButtonChip, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   404 — a dead end that still feels like the product.
   Server component; machine-voice framing keeps the brand intact.
   ========================================================================== */

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <section className="relative z-10 mx-auto flex min-h-svh w-[min(1180px,calc(100%-2rem))] flex-col items-start justify-center">
        <p className="machine-label mb-4">Error 404 · Uncharted territory</p>
        <h1 className="max-w-2xl text-display font-semibold tracking-tight text-ink md:text-display-xl">
          This angle doesn&apos;t{" "}
          <span className="editorial text-lit-accent">exist yet.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-secondary">
          The page you&apos;re looking for was never mapped. Head back — your
          next winning ad is waiting on the other side.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary" size="lg">
            Back to Catalyst
            <ButtonChip>
              <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
            </ButtonChip>
          </ButtonLink>
          <ButtonLink href="/analyze" variant="glass" size="lg">
            Run an analysis
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
