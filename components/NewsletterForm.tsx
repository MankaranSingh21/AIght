"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { usePostHog } from "posthog-js/react";

export default function NewsletterForm() {
  const [email, setEmail]           = useState("");
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");
  const [isPending, startTransition] = useTransition();
  const posthog                      = usePostHog();

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
        posthog?.capture("newsletter_subscribe");
      }
    });
  }

  if (done) {
    return (
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: '#AAFF4D', fontWeight: 600 }}>
        You&apos;re in. See you in the signal.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{
            flex: 1,
            minWidth: 0,
            height: 42,
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: '#F5EFE0',
            background: 'rgba(255,250,240,0.04)',
            border: '1px solid rgba(245,239,224,0.09)',
            borderRadius: 8,
            padding: '0 14px',
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(170,255,77,0.30)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(245,239,224,0.09)')}
        />
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{ flexShrink: 0, opacity: isPending ? 0.5 : 1 }}
        >
          {isPending ? "…" : "Subscribe →"}
        </button>
      </div>
      {error && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--error)' }}>{error}</p>
      )}
    </form>
  );
}
