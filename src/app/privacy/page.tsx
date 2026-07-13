import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Catalyst collects, uses, and protects your data.",
};

/* Plain-language privacy policy for the beta. Replace with counsel-reviewed
   text before charging customers. */
export default function PrivacyPage(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <section className="relative z-10 mx-auto w-[min(760px,calc(100%-2rem))] pt-36 pb-24">
        <p className="machine-label mb-3">Legal</p>
        <h1 className="text-display font-semibold tracking-tight text-ink">
          Privacy policy
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink-secondary">
          <p>
            <span className="font-semibold text-ink">What we collect.</span>{" "}
            When you run an analysis, we store the details you submit (store
            URL, product description, target audience) and the strategy the
            engine generates. If you sign in, we store your email address and
            associate your analyses and outcome marks with your account.
          </p>
          <p>
            <span className="font-semibold text-ink">How we use it.</span>{" "}
            To generate your strategy, show you your history, and improve the
            engine&apos;s recommendations over time. We do not sell your data
            or share it with advertisers.
          </p>
          <p>
            <span className="font-semibold text-ink">Processing.</span>{" "}
            Analysis inputs are processed by our AI provider (Google Gemini)
            to generate your strategy, and stored in our database (Supabase).
            Anonymous usage analytics are collected via Vercel Analytics
            without cookies.
          </p>
          <p>
            <span className="font-semibold text-ink">Your choices.</span>{" "}
            You can use {SITE.name} without an account. To request deletion of
            your account and all associated analyses, contact us and we will
            remove them.
          </p>
          <p className="machine-label">Last updated · July 2026 · Beta policy</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
