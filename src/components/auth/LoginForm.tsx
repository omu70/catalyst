"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { KeyRound, MailCheck } from "lucide-react";

import { getSupabaseBrowser } from "@/lib/db/supabase-browser";
import { SPRING_SMOOTH } from "@/lib/motion/springs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/* ============================================================================
   <LoginForm /> — passwordless magic-link sign-in.

   No passwords: nothing to forget, nothing to breach, one field between a
   visitor and a saved strategy history. States: idle → sending → sent |
   error. Degrades with a clear message when auth env isn't configured.
   ========================================================================== */

type LoginStatus = "idle" | "sending" | "sent" | "error";

const FIELD_CLASSES =
  "w-full rounded-[--radius-control] border border-line bg-vault px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgb(37_99_235/0.12)] focus:outline-none";

export function LoginForm(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setStatus("error");
      setMessage("Sign-in isn't configured on this deployment yet.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SMOOTH}
        className="glass-panel w-full max-w-md rounded-[--radius-panel] p-10 text-center"
      >
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent-ghost">
          <MailCheck className="size-5 text-accent-deep" strokeWidth={2.25} />
        </span>
        <h1 className="text-title font-semibold text-ink">Check your inbox</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-secondary">
          We sent a sign-in link to <span className="text-ink">{email}</span>.
          Click it and you&apos;ll land back here, signed in.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_SMOOTH}
      onSubmit={handleSubmit}
      noValidate
      className="glass-panel w-full max-w-md rounded-[--radius-panel] p-10"
    >
      <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent-ghost">
        <KeyRound className="size-5 text-accent-deep" strokeWidth={2.25} />
      </span>
      <h1 className="text-title font-semibold text-ink">Sign in to Catalyst</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
        No password. We&apos;ll email you a magic link — your strategies get
        saved to your account from then on.
      </p>

      <label htmlFor="email" className="machine-label mt-7 mb-2 block">
        Work email
      </label>
      <input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@brand.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "sending"}
        className={cn(FIELD_CLASSES, status === "error" && "border-critical")}
      />
      {status === "error" && (
        <p className="mt-2 text-xs text-critical">{message}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "sending"}
        className="mt-6 w-full"
      >
        {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
      </Button>
    </motion.form>
  );
}
