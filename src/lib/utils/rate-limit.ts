/* ============================================================================
   Sliding-window rate limiter — in-memory, per server instance.

   Protects the AI provider budget from a single abusive client. This is the
   right FIRST line of defense for a single-instance deploy; a multi-region
   fleet upgrades this to a shared store (Upstash/Redis) behind the same
   function signature — callers never change.
   ========================================================================== */

interface RateLimitConfig {
  /** Max requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

const hits = new Map<string, number[]>();

/** Periodic sweep so the map can't grow unbounded across long uptimes. */
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
let lastSweep = 0;

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (now - lastSweep > SWEEP_INTERVAL_MS) {
    lastSweep = now;
    for (const [k, stamps] of hits) {
      const alive = stamps.filter((t) => now - t < config.windowMs);
      if (alive.length === 0) hits.delete(k);
      else hits.set(k, alive);
    }
  }

  const windowStart = now - config.windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= config.limit) {
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((oldest + config.windowMs - now) / 1000),
    };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}
