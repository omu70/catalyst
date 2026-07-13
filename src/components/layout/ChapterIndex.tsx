"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <ChapterIndex /> — the Editions-style sticky chapter rail.

   A floating pill bar that appears once the reader is past the hero,
   tracks the active section via IntersectionObserver (no scroll-handler
   math), and jumps between chapters through Lenis-smoothed anchors.
   Desktop-only: on mobile the hamburger menu owns navigation.
   ========================================================================== */

const CHAPTERS = [
  { id: "what", label: "What it does" },
  { id: "sample", label: "Sample" },
  { id: "process", label: "Methodology" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

/** Show the rail only after the reader has left the hero. */
const REVEAL_SCROLL_PX = 640;

export function ChapterIndex(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > REVEAL_SCROLL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll-spy: the chapter crossing the upper-middle band wins.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const { id } of CHAPTERS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={SPRING_SMOOTH}
          aria-label="Page chapters"
          className="fixed top-[4.75rem] left-1/2 z-40 hidden -translate-x-1/2 lg:block print:hidden"
        >
          <div className="glass-nav flex items-center gap-1 rounded-full p-1.5">
            {CHAPTERS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
                  active === id
                    ? "bg-ink text-void"
                    : "text-ink-secondary hover:bg-glass hover:text-ink",
                )}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
