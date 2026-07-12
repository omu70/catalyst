"use client";

import { forwardRef, type ButtonHTMLAttributes, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
  type MotionValue,
} from "framer-motion";

import { SPRING_SNAP } from "@/lib/motion/springs";
import { cn } from "@/lib/utils/cn";

/* ----------------------------------------------------------------------------
   Magnetic pull — the control leans toward the cursor (max ~6px), springs
   back on leave. GPU transform only; inert on touch (no pointermove stream).
   ---------------------------------------------------------------------------- */

const MAGNET_STRENGTH = 0.25;
const MAGNET_MAX_PX = 6;

interface Magnetic {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

function useMagnetic(): Magnetic {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 320, damping: 22, mass: 0.5 });

  return {
    x,
    y,
    onPointerMove: (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const clamp = (v: number): number =>
        Math.max(-MAGNET_MAX_PX, Math.min(MAGNET_MAX_PX, v));
      rawX.set(clamp((event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH));
      rawY.set(clamp((event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH));
    },
    onPointerLeave: () => {
      rawX.set(0);
      rawY.set(0);
    },
  };
}

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
  /** Ink pill — the reference-language primary. On light surfaces it's a
      near-black pill; inside .surface-dark, ink flips light and it becomes
      the white pill of the FoF pattern. Pair with <ButtonChip>. */
  primary: "bg-ink text-void font-semibold shadow-panel hover:opacity-90",
  /** Frosted secondary — sits on glass panels and any canvas. */
  glass:
    "glass-panel text-ink hover:bg-glass-bright hover:border-line-strong",
  /** Bare — inline/tertiary actions, nav items. */
  ghost: "text-ink-secondary hover:text-ink hover:bg-glass",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "h-10 pl-4 pr-1.5 text-sm gap-2.5 [&:not(:has([data-chip]))]:pr-4",
  lg: "h-12 pl-6 pr-2 text-[15px] gap-3 [&:not(:has([data-chip]))]:pr-6",
};

/**
 * <ButtonChip /> — the circular icon chip that terminates primary CTAs
 * (the "Get started ⊙→" pattern from the reference language). Renders in
 * the button's void color so it inverts correctly on both surfaces.
 */
export function ButtonChip({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <span
      data-chip
      className="grid size-7 shrink-0 place-items-center rounded-full bg-void text-ink"
    >
      {children}
    </span>
  );
}

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Shared class composition — identical surface for button and link forms. */
function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
): string {
  return cn(
    // Pill geometry — the soft-corner system at its softest for controls.
    "inline-flex cursor-pointer items-center justify-center rounded-full select-none",
    "transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-40",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );
}

/** Shared press physics: GPU scale transform only, spring-driven. */
const PRESS_MOTION = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: SPRING_SNAP,
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) {
    const magnet = useMagnetic();
    return (
      <motion.button
        ref={ref}
        {...PRESS_MOTION}
        style={{ x: magnet.x, y: magnet.y }}
        onPointerMove={magnet.onPointerMove}
        onPointerLeave={magnet.onPointerLeave}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

export interface ButtonLinkProps
  extends Omit<HTMLMotionProps<"a">, "children"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

/**
 * <ButtonLink /> — navigation styled as a button (valid HTML: a real <a>,
 * never a button nested in an anchor). Same physics, same variants.
 */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { variant = "primary", size = "md", className, children, href, ...props },
    ref,
  ) {
    const magnet = useMagnetic();
    return (
      <motion.a
        ref={ref}
        href={href}
        {...PRESS_MOTION}
        style={{ x: magnet.x, y: magnet.y }}
        onPointerMove={magnet.onPointerMove}
        onPointerLeave={magnet.onPointerLeave}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {children}
      </motion.a>
    );
  },
);
