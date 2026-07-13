import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { ChapterIndex } from "@/components/layout/ChapterIndex";
import { ChapterDivider } from "@/components/layout/ChapterDivider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { HypothesisMarquee } from "@/components/marketing/HypothesisMarquee";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { ProductFrame } from "@/components/marketing/ProductFrame";
import { EngineProcess } from "@/components/marketing/EngineProcess";
import { WhatItDoes } from "@/components/marketing/WhatItDoes";
import { CoverageRadar } from "@/components/marketing/CoverageRadar";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTABand } from "@/components/marketing/CTABand";

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
      <ScrollProgress />
      <Navbar />
      <ChapterIndex />
      <Hero />
      <ChapterDivider index="01" label="What it does" />
      <WhatItDoes />
      <CoverageRadar />
      <ChapterDivider index="02" label="Sample output" />
      <ProductFrame />
      <HypothesisMarquee />
      <ChapterDivider index="03" label="Methodology" />
      <EngineProcess />
      <ChapterDivider index="04" label="Pricing" />
      <Pricing />
      <ChapterDivider index="05" label="FAQ" />
      <FAQ />
      <CTABand />
      <Footer />
    </main>
  );
}
