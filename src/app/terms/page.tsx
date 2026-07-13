import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Catalyst.",
};

/* Plain-language terms for the beta. Replace with counsel-reviewed text
   before charging customers. */
export default function TermsPage(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <section className="relative z-10 mx-auto w-[min(760px,calc(100%-2rem))] pt-36 pb-24">
        <p className="machine-label mb-3">Legal</p>
        <h1 className="text-display font-semibold tracking-tight text-ink">
          Terms of service
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink-secondary">
          <p>
            <span className="font-semibold text-ink">The service.</span>{" "}
            {SITE.name} generates AI-assisted creative strategy for
            advertising. It is provided as-is during beta, without warranties
            of any kind, and may change or be interrupted at any time.
          </p>
          <p>
            <span className="font-semibold text-ink">Your content.</span>{" "}
            You retain all rights to the details you submit and may use the
            strategies generated for you commercially. You are responsible for
            ensuring you have the right to submit any information you provide.
          </p>
          <p>
            <span className="font-semibold text-ink">
              No guarantee of results.
            </span>{" "}
            Strategies are hypotheses to test, not promises of performance.
            Advertising outcomes depend on execution, budgets, and platforms
            outside our control. Nothing here is financial or legal advice.
          </p>
          <p>
            <span className="font-semibold text-ink">Fair use.</span>{" "}
            Automated scraping, abuse of rate limits, or attempts to disrupt
            the service may result in access being suspended.
          </p>
          <p className="machine-label">Last updated · July 2026 · Beta terms</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
