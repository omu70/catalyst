"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCw, TriangleAlert } from "lucide-react";

import { useStrategyStore } from "@/store/strategy-store";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { Button } from "@/components/ui/Button";
import type { StrategyErrorResponse } from "@/types/creative-universe";

/* ============================================================================
   <ErrorPanel /> — every failure state, made calm.

   Copy switches on the STABLE error code (never on message strings).
   Timeout gets its own voice per the PRD's five-state requirement.
   Every state has exactly one primary action: retry or start over.
   ========================================================================== */

type ErrorCode = StrategyErrorResponse["error"]["code"];

interface ErrorCopy {
  title: string;
  body: string;
  isTimeout?: boolean;
}

const ERROR_COPY: Record<ErrorCode, ErrorCopy> = {
  provider_timeout: {
    title: "The engine ran long",
    body: "Deep analyses occasionally exceed our time budget. Your input is intact — run it again and it usually completes.",
    isTimeout: true,
  },
  rate_limited: {
    title: "The AI provider hit its quota",
    body: "Gemini declined the request — on free-tier keys this happens after a few rapid runs. Wait a minute and retry, or enable billing on your key at aistudio.google.com for uninterrupted generation.",
  },
  app_rate_limited: {
    title: "Analysis limit reached",
    body: "To keep the engine fast for everyone, each user gets 5 analyses per 10 minutes. Your input is intact — retry shortly.",
  },
  provider_unavailable: {
    title: "The engine is unreachable",
    body: "The AI provider didn't respond. This is usually momentary — retry now.",
  },
  invalid_response: {
    title: "The engine returned noise",
    body: "The model produced an unusable result — rare, and a retry almost always resolves it.",
  },
  not_configured: {
    title: "The engine isn't configured",
    body: "No AI provider key is set on the server. Add GEMINI_API_KEY (or AI_PROVIDER=mock for a demo) and restart.",
  },
  invalid_input: {
    title: "The input didn't validate",
    body: "Something about the submission was rejected server-side. Start over and re-enter your details.",
  },
  internal: {
    title: "Something broke on our side",
    body: "An unexpected error occurred. It's been logged — retry, and if it persists, start a new analysis.",
  },
};

export function ErrorPanel(): React.JSX.Element | null {
  const error = useStrategyStore((s) => s.error);
  const retry = useStrategyStore((s) => s.retry);
  const reset = useStrategyStore((s) => s.reset);

  if (!error) return null;
  const copy = ERROR_COPY[error.code];
  const Icon = copy.isTimeout ? Clock : TriangleAlert;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_SMOOTH}
      className="glass-panel mx-auto w-full max-w-2xl rounded-[--radius-panel] p-10 text-center"
      role="alert"
    >
      <span className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-data-ghost">
        <Icon className="size-5 text-data" strokeWidth={2.25} />
      </span>

      <h2 className="text-title font-semibold text-ink">{copy.title}</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-secondary">
        {copy.body}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="primary" size="md" onClick={() => void retry()}>
          <RefreshCw className="size-4" strokeWidth={2.25} />
          Run it again
        </Button>
        <Button variant="glass" size="md" onClick={reset}>
          Start a new analysis
        </Button>
      </div>
    </motion.div>
  );
}
