import { create } from "zustand";

import { requestStrategy } from "@/lib/api/client";
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
  error: StrategyErrorResponse["error"] | null;

  /** Submit input to the engine. Safe to call again for retries. */
  generate: (input: StrategyInput) => Promise<void>;
  /** Retry the last submission (error-state affordance). */
  retry: () => Promise<void>;
  /** Back to a clean slate (new analysis). */
  reset: () => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  status: "idle",
  input: null,
  universe: null,
  error: null,

  generate: async (input) => {
    set({ status: "loading", input, error: null });

    const result = await requestStrategy(input);

    // Guard against a stale response landing after a reset.
    if (get().input !== input) return;

    if (result.ok) {
      set({ status: "success", universe: result.universe, error: null });
    } else {
      set({ status: "error", error: result.error, universe: null });
    }
  },

  retry: async () => {
    const { input, generate } = get();
    if (input) await generate(input);
  },

  reset: () => set({ status: "idle", input: null, universe: null, error: null }),
}));
