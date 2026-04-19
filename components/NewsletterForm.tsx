"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
        setEmail("");
      }
    });
  }

  if (done) {
    return (
      <p className="font-sans text-sm text-accent font-medium">
        You&apos;re in. See you in the signal.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="
            flex-1 min-w-0 h-11 font-sans text-sm text-primary placeholder:text-muted
            bg-raised border border-[var(--border-default)] rounded-md px-4
            focus:outline-none focus:border-emphasis
            transition-colors duration-150
          "
        />
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary flex-shrink-0 disabled:opacity-50"
        >
          {isPending ? "…" : "Subscribe →"}
        </button>
      </div>
      {error && (
        <p className="font-sans text-xs text-danger">{error}</p>
      )}
    </form>
  );
}
