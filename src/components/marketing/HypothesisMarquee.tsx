import { SAMPLE_UNIVERSE } from "@/config/sample-universe";
import { STAGE_LABELS } from "@/config/universe-ui";

/* ============================================================================
   <HypothesisMarquee /> — the Editions-style horizontal gallery.

   A full-bleed strip of real sample hypotheses gliding sideways beneath the
   product frame: what comes OUT of the machine, readable at a glance. The
   loop is a duplicated track driven by one CSS keyframe (GPU transform
   only, zero JS) and pauses on hover so cards can actually be read.

   Server component — ships no JavaScript.
   ========================================================================== */

const ANGLES = SAMPLE_UNIVERSE.angles.slice(0, 6);

function AngleCard({
  angle,
}: {
  angle: (typeof ANGLES)[number];
}): React.JSX.Element {
  return (
    <article className="w-[340px] shrink-0 rounded-[--radius-panel] border border-line bg-vault p-6 shadow-[0_16px_40px_-24px_rgb(17_18_19/0.18)] sm:w-[380px]">
      <div className="flex items-center justify-between gap-3">
        <span className="machine-label">
          {STAGE_LABELS[angle.awarenessStage]}
        </span>
        <span className="flex items-baseline gap-1 font-mono text-sm font-medium text-accent">
          {angle.score}
          <span className="text-[10px] text-ink-tertiary">/100</span>
        </span>
      </div>
      <h3 className="mt-3 text-[17px] font-semibold tracking-tight text-ink">
        {angle.title}
      </h3>
      <p className="editorial mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-ink-secondary">
        &ldquo;{angle.hook}&rdquo;
      </p>
    </article>
  );
}

export function HypothesisMarquee(): React.JSX.Element {
  return (
    <section
      aria-label="Sample hypotheses produced by Catalyst"
      className="marquee-group relative z-10 pb-28"
    >
      <div className="mx-auto mb-8 flex w-[min(1180px,calc(100%-2rem))] items-baseline justify-between gap-4">
        <p className="machine-label">Straight off the press · sample run</p>
        <p className="machine-label hidden sm:block">Hover to pause</p>
      </div>

      {/* Full-bleed track with soft edge fades */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div className="animate-marquee flex w-max gap-5 pr-5">
          {/* Track rendered twice for a seamless -50% loop */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 gap-5"
            >
              {ANGLES.map((angle) => (
                <AngleCard key={`${copy}-${angle.title}`} angle={angle} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
