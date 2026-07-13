/* ============================================================================
   <ChapterDivider /> — the Editions-style numbered chapter opener.

   A quiet typographic beat between major sections: hairline rule, mono
   chapter index, machine-voice label. Purely decorative (each section owns
   its real heading), so it's hidden from assistive tech.

   Server component — ships no JavaScript.
   ========================================================================== */

interface ChapterDividerProps {
  /** Two-digit chapter number, e.g. "01". */
  index: string;
  label: string;
}

export function ChapterDivider({
  index,
  label,
}: ChapterDividerProps): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="relative z-10 mx-auto w-[min(1180px,calc(100%-2rem))] pb-10"
    >
      <div className="hairline-x mb-4" />
      <div className="flex items-baseline justify-between">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-medium text-accent">
            {index}
          </span>
          <span className="machine-label">{label}</span>
        </span>
        <span className="machine-label hidden sm:block">Catalyst · Creative intelligence</span>
      </div>
    </div>
  );
}
