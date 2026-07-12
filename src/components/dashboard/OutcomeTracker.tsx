"use client";

import { useState } from "react";
import { Check, FlaskConical, X } from "lucide-react";

import { useStrategyStore } from "@/store/strategy-store";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <OutcomeTracker /> — the learning loop's UI: three small controls on
   every hypothesis card. Marking Tested / Won / Lost writes the outcome
   to the user's account; this data is the company's compounding moat.

   States: idle → saving → saved | needs-auth | error. Optimistic UI with
   rollback; hidden entirely for unsaved (sample) universes.
   ========================================================================== */

type OutcomeStatus = "tested" | "won" | "lost";

const OPTIONS: Array<{
  status: OutcomeStatus;
  label: string;
  icon: typeof Check;
  activeClass: string;
}> = [
  { status: "tested", label: "Tested", icon: FlaskConical, activeClass: "bg-glass-bright text-ink" },
  { status: "won", label: "Won", icon: Check, activeClass: "bg-accent-ghost text-accent-deep" },
  { status: "lost", label: "Lost", icon: X, activeClass: "bg-data-ghost text-data" },
];

export function OutcomeTracker({
  hypothesisTitle,
}: {
  hypothesisTitle: string;
}): React.JSX.Element | null {
  const analysisId = useStrategyStore((s) => s.analysisId);
  const [selected, setSelected] = useState<OutcomeStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // The sample and unsaved runs have nothing to learn from.
  if (!analysisId) return null;

  async function mark(status: OutcomeStatus): Promise<void> {
    const previous = selected;
    setSelected(status); // optimistic
    setMessage(null);

    const response = await fetch("/api/track-outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisId, hypothesisTitle, status }),
    });

    if (response.status === 401) {
      setSelected(previous);
      setMessage("Sign in to track outcomes");
    } else if (!response.ok) {
      setSelected(previous);
      setMessage("Couldn't save — retry");
    }
  }

  return (
    <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 print:hidden">
      <span className="machine-label mr-1">Outcome</span>
      {OPTIONS.map(({ status, label, icon: Icon, activeClass }) => (
        <button
          key={status}
          type="button"
          onClick={() => void mark(status)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors duration-150",
            selected === status
              ? activeClass
              : "text-ink-tertiary hover:bg-glass hover:text-ink-secondary",
          )}
        >
          <Icon className="size-3" strokeWidth={2.5} />
          {label}
        </button>
      ))}
      {message && <span className="ml-1 text-[11px] text-data">{message}</span>}
    </div>
  );
}
