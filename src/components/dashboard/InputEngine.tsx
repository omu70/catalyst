"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";

import { useStrategyStore } from "@/store/strategy-store";
import { StrategyInputSchema } from "@/types/creative-universe";
import { riseItem, staggerContainer } from "@/lib/motion/variants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <InputEngine /> — the intake instrument.

   Three fields, zero friction: store URL (optional), what you sell, who
   buys it. Client-side validation reuses the SAME zod schema the API
   enforces, so the two layers can never disagree about what's valid.
   ========================================================================== */

type FieldErrors = Partial<Record<"shopifyUrl" | "productDetails" | "targetAudience", string>>;

const FIELD_BASE_CLASSES =
  "w-full rounded-[--radius-control] border border-line bg-vault px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgb(14_159_110/0.12)] focus:outline-none";

export function InputEngine(): React.JSX.Element {
  const generate = useStrategyStore((s) => s.generate);
  const status = useStrategyStore((s) => s.status);

  const [shopifyUrl, setShopifyUrl] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const isLoading = status === "loading";

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = StrategyInputSchema.safeParse({
      shopifyUrl,
      productDetails,
      targetAudience,
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (
          field === "shopifyUrl" ||
          field === "productDetails" ||
          field === "targetAudience"
        ) {
          next[field] ??= issue.message;
        }
      }
      setErrors(next);
      return;
    }

    setErrors({});
    void generate(parsed.data);
  }

  return (
    <motion.form
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      noValidate
      className="glass-panel mx-auto w-full max-w-2xl rounded-[--radius-panel] p-8 sm:p-10"
    >
      {/* Console header */}
      <motion.div variants={riseItem} className="mb-8 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent-ghost">
          <Store className="size-4 text-accent-deep" strokeWidth={2.25} />
        </span>
        <div>
          <h2 className="text-title font-semibold text-ink">
            Feed the engine
          </h2>
          <p className="machine-label mt-0.5">
            90 seconds · No account connection required
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Store URL — optional */}
        <motion.div variants={riseItem}>
          <label htmlFor="shopifyUrl" className="machine-label mb-2 block">
            Store URL <span className="text-ink-faint">— optional</span>
          </label>
          <input
            id="shopifyUrl"
            type="url"
            inputMode="url"
            placeholder="https://yourstore.com"
            value={shopifyUrl}
            onChange={(e) => setShopifyUrl(e.target.value)}
            disabled={isLoading}
            className={cn(FIELD_BASE_CLASSES, errors.shopifyUrl && "border-critical")}
          />
          {errors.shopifyUrl && (
            <p className="mt-1.5 text-xs text-critical">{errors.shopifyUrl}</p>
          )}
        </motion.div>

        {/* Product details */}
        <motion.div variants={riseItem}>
          <label htmlFor="productDetails" className="machine-label mb-2 block">
            What do you sell?
          </label>
          <textarea
            id="productDetails"
            rows={4}
            placeholder="The product, the price, and the one thing competitors can't copy. The more specific, the sharper the angles."
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            disabled={isLoading}
            className={cn(FIELD_BASE_CLASSES, "resize-none", errors.productDetails && "border-critical")}
          />
          {errors.productDetails && (
            <p className="mt-1.5 text-xs text-critical">{errors.productDetails}</p>
          )}
        </motion.div>

        {/* Target audience */}
        <motion.div variants={riseItem}>
          <label htmlFor="targetAudience" className="machine-label mb-2 block">
            Who buys it?
          </label>
          <textarea
            id="targetAudience"
            rows={3}
            placeholder="Who they are, what they've already tried, and what they believe about products like yours."
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={isLoading}
            className={cn(FIELD_BASE_CLASSES, "resize-none", errors.targetAudience && "border-critical")}
          />
          {errors.targetAudience && (
            <p className="mt-1.5 text-xs text-critical">{errors.targetAudience}</p>
          )}
        </motion.div>

        <motion.div variants={riseItem} className="mt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Build my Creative Universe
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
