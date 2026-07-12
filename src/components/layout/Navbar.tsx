"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Command } from "lucide-react";

import { NAV_LINKS, SITE } from "@/config/site";
import { navReveal } from "@/lib/motion/variants";
import { Button, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   <Navbar /> — floating glass command bar.

   Deliberately detached from the viewport edge (inset + rounded) — the
   "floating instrument" pattern reads as OS chrome rather than website
   header. Height is compact (56px) to keep the density signal high.
   ========================================================================== */

export function Navbar(): React.JSX.Element {
  return (
    <motion.header
      variants={navReveal}
      initial="hidden"
      animate="visible"
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1120px,calc(100%-2rem))]"
    >
      <nav className="glass-nav flex h-14 items-center justify-between rounded-2xl pr-2.5 pl-5">
        {/* Wordmark — logomark is a live "engine" beacon, not a static icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink"
          aria-label={`${SITE.name} home`}
        >
          <span className="relative flex size-6 items-center justify-center rounded-md bg-accent-ghost">
            <Command className="size-3.5 text-accent-bright" strokeWidth={2.25} />
            <span className="animate-beacon absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-data" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        {/* Center rail — hidden on mobile; mobile menu ships with app shell */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm text-ink-secondary transition-colors duration-200 hover:bg-glass hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="md" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <ButtonLink href="/analyze" variant="primary" size="md">
            Analyze my store
            <ArrowUpRight className="size-4" strokeWidth={2.25} />
          </ButtonLink>
        </div>
      </nav>
    </motion.header>
  );
}
