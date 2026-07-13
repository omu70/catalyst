import { AIProviderError, type AIProvider } from "@/lib/ai/types";
import { GeminiProvider } from "@/lib/ai/providers/gemini";
import { MockProvider } from "@/lib/ai/providers/mock";
import { OpenAICompatibleProvider } from "@/lib/ai/providers/openai-compatible";

/* ============================================================================
   Provider factory — the ONLY place that knows which vendors exist.

   Selection is environment-driven:
     AI_PROVIDER=gemini (default) → GeminiProvider (requires GEMINI_API_KEY)
     AI_PROVIDER=mock             → MockProvider   (dev/CI, no key needed)

   Adding OpenAI/Claude/Groq later = one adapter file + one case here.
   ========================================================================== */

const PROVIDER_IDS = ["gemini", "mock", "openai-compat"] as const;
type ProviderId = (typeof PROVIDER_IDS)[number];

function resolveProviderId(): ProviderId {
  const raw = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  if ((PROVIDER_IDS as readonly string[]).includes(raw)) {
    return raw as ProviderId;
  }
  throw new AIProviderError(
    "not_configured",
    `Unknown AI_PROVIDER "${raw}". Valid values: ${PROVIDER_IDS.join(", ")}`,
  );
}

/** Lazily constructed singleton — one client per server instance. */
let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cached) return cached;

  const id = resolveProviderId();
  switch (id) {
    case "mock": {
      cached = new MockProvider();
      break;
    }
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new AIProviderError(
          "not_configured",
          "GEMINI_API_KEY is not set. Add it to .env.local (or set AI_PROVIDER=mock for development).",
        );
      }
      cached = new GeminiProvider(apiKey, process.env.GEMINI_MODEL);
      break;
    }
    case "openai-compat": {
      const baseUrl = process.env.OPENAI_COMPAT_BASE_URL;
      const apiKey = process.env.OPENAI_COMPAT_API_KEY;
      const model = process.env.OPENAI_COMPAT_MODEL;
      if (!baseUrl || !apiKey || !model) {
        throw new AIProviderError(
          "not_configured",
          "AI_PROVIDER=openai-compat requires OPENAI_COMPAT_BASE_URL, OPENAI_COMPAT_API_KEY, and OPENAI_COMPAT_MODEL.",
        );
      }
      cached = new OpenAICompatibleProvider(baseUrl, apiKey, model);
      break;
    }
  }
  return cached;
}
