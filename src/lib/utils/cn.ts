import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — the canonical className composer for Catalyst.
 *
 * clsx handles conditional class logic; tailwind-merge resolves conflicting
 * Tailwind utilities deterministically (later classes win), which is what
 * makes component variant overrides safe at scale.
 *
 * Every component in the system accepts `className` and pipes it through cn —
 * this is the contract that keeps components reusable without style leaks.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
