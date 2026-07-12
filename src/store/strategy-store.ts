import { create } from "zustand";

import { requestStrategy } from "@/lib/api/client";
import { SAMPLE_UNIVERSE } from "@/config/sample-universe";
import type {
  CreativeUniverse,
  StrategyErrorResponse,
  StrategyInput,
} from "@/types/creative-universe";

/* ============================================================================
   Strategy store — the analyze flow's single state machine.

   Explicit discriminated statuses (never derived booleans) so every screen
   state the PRD demands — idle, loading, success, error (incl. timeout) —
   is a first-class, exhaustively-switchable case.
   ========================================================================== */

export type EngineStatus = "idle" | "loading" | "success" | "error";

interface StrategyState {
  status: EngineStatus;
  /** The last submitted input — kept for retry. */
  input: StrategyInput | null;
  universe: CreativeUniverse | null;
  /** Persisted analysis id (present when the backend saved the run). */
  analysisId: string | null;
  /** True when showing the bundled sample instead of a real generation. */
  isSample: boolean;
  error: StrategyErrorResponse["error"] | null;

  /** Submit input to the engine. Safe to call again for retries. */
  generate: (input: StrategyInput) => Promise<void>;
  /** Show the bundled sample universe instantly (zero-friction first value). */
  loadSample: () => void;
  /** Retry the last submission (error-state affordance). */
  retry: () => Promise<void>;
  /** Back to a clean slate (new analysis). */
  reset: () => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  status: "idle",
  input: null,
  universe: null,
  analysisId: null,
  isSample: false,
  error: null,

  generate: async (input) => {
    set({ status: "loading", input, error: null, isSample: false });

    const result = await requestStrategy(input);

    // Guard against a stale response landing after a reset.
    if (get().input !== input) return;

    if (result.ok) {
      set({
        status: "success",
        universe: result.universe,
        analysisId: result.analysisId ?? null,
        error: null,
      });
    } else {
      set({ status: "error", error: result.error, universe: null });
    }
  },

  loadSample: () => {
    set({
      status: "success",
      universe: SAMPLE_UNIVERSE,
      analysisId: null,
      isSample: true,
      input: null,
      error: null,
    });
  },

  retry: async () => {
    const { input, generate } = get();
    if (input) await generate(input);
  },

  reset: () =>
    set({
      status: "idle",
      input: null,
      universe: null,
      analysisId: null,
      isSample: false,
      error: null,
    }),
}));
