import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { ProductFrame } from "@/components/marketing/ProductFrame";
import { EngineProcess } from "@/components/marketing/EngineProcess";

/* ============================================================================
   Landing page — server component composition shell.

   This file stays a pure composition of sections: no logic, no state, no
   styling decisions. New landing sections (Platform, Intelligence, Roadmaps)
   mount here as siblings in later phases.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Catalyst — The Creative Intelligence Platform",
};

export default function LandingPage(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductFrame />
      <EngineProcess />
    </main>
  );
}
