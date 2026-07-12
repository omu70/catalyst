"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, LogOut, Menu, X } from "lucide-react";

import { NAV_LINKS, SITE } from "@/config/site";
import { navReveal } from "@/lib/motion/variants";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { getSupabaseBrowser } from "@/lib/db/supabase-browser";
import { Button, ButtonChip, ButtonLink } from "@/components/ui/Button";

/* ============================================================================
   <Navbar /> — floating glass command bar.

   Session-aware: shows Sign in (no session) or user email + sign-out.
   Mobile: hamburger opens a glass sheet with every destination — no user
   is ever stranded without navigation.
   ========================================================================== */

export function Navbar(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    void supabase.auth
      .getUser()
      .then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setUserEmail(session?.user.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut(): Promise<void> {
    await getSupabaseBrowser()?.auth.signOut();
    window.location.href = "/";
  }

  return (
    <motion.header
      variants={navReveal}
      initial="hidden"
      animate="visible"
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1120px,calc(100%-2rem))] print:hidden"
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

        {/* Center rail — desktop */}
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
          {userEmail ? (
            <Button
              variant="ghost"
              size="md"
              onClick={() => void signOut()}
              className="hidden sm:inline-flex"
              title={userEmail}
            >
              <LogOut className="size-4" strokeWidth={2.25} />
              Sign out
            </Button>
          ) : (
            <ButtonLink
              href="/login"
              variant="ghost"
              size="md"
              className="hidden sm:inline-flex"
            >
              Sign in
            </ButtonLink>
          )}
          <ButtonLink
            href="/analyze"
            variant="primary"
            size="md"
            className="hidden sm:inline-flex"
          >
            Analyze my store
            <ButtonChip>
              <ArrowUpRight className="size-3" strokeWidth={2.5} />
            </ButtonChip>
          </ButtonLink>

          {/* Mobile: hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-ink md:hidden"
          >
            {menuOpen ? (
              <X className="size-5" strokeWidth={2.25} />
            ) : (
              <Menu className="size-5" strokeWidth={2.25} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING_SMOOTH}
            className="glass-nav mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-glass"
              >
                {link.label}
              </Link>
            ))}
            <div className="hairline-x my-2" />
            {userEmail ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="cursor-pointer rounded-xl px-4 py-3 text-left text-[15px] font-medium text-ink-secondary transition-colors duration-200 hover:bg-glass"
              >
                Sign out ({userEmail})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink-secondary transition-colors duration-200 hover:bg-glass"
              >
                Sign in
              </Link>
            )}
            <ButtonLink
              href="/analyze"
              variant="primary"
              size="lg"
              className="mt-1 w-full"
            >
              Analyze my store
              <ButtonChip>
                <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
              </ButtonChip>
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
