"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { SPRING_SNAP } from "@/lib/motion/springs";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <Button /> — the single button primitive for Catalyst.

   Variants are semantic, not visual: callers declare intent ("primary"),
   the design system decides appearance. Motion is built in — every button
   shares identical press physics, so the whole product feels like one
   material.
   ========================================================================== */

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "md" | "lg";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  /** Ember-filled — the one high-emphasis action per view. */
  primary:
    "bg-accent text-void font-semibold shadow-glow-accent hover:bg-accent-bright",
  /** Frosted secondary — sits on glass panels and dark canvas alike. */
  glass:
    "glass-panel text-ink hover:bg-glass-bright hover:border-line-strong",
  /** Bare — inline/tertiary actions, nav items. */
  ghost: "text-ink-secondary hover:text-ink hover:bg-glass",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2.5",
};

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        // Shared press physics: GPU scale transform only, spring-driven.
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING_SNAP}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-[--radius-control] select-none",
          "transition-colors duration-200",
          "disabled:pointer-events-none disabled:opacity-40",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
