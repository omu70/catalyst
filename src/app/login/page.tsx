import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Catalyst to save and revisit your creative strategies.",
};

export default function LoginPage(): React.JSX.Element {
  return (
    <main>
      <Navbar />
      <section className="relative z-10 mx-auto flex min-h-svh w-[min(1180px,calc(100%-2rem))] flex-col items-center justify-center">
        <LoginForm />
      </section>
    </main>
  );
}
