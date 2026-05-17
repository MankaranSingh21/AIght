"use client";

import { useState, useTransition, useId } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { usePostHog } from "posthog-js/react";

interface NewsletterFormProps {
  // 'block' is the homepage hero variant (default).
  // 'inline' is a compact pitch with optional headline + reassurance line,
  // used on the quiz report and the bookmarks page.
  variant?: "block" | "inline";
  pitch?: string;     // Heading line shown above the form in inline variant.
  source?: string;    // PostHog attribution — e.g. 'quiz_report', 'bookmarks'.
}

export default function NewsletterForm({ variant = "block", pitch, source }: NewsletterFormProps) {
  const [email, setEmail]           = useState("");
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");
  const [isPending, startTransition] = useTransition();
  const posthog                      = usePostHog();
  const inputId                      = useId();

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
        posthog?.capture("newsletter_subscribe", source ? { source } : undefined);
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

  if (variant === "inline") {
    return (
      <aside
        style={{
          margin: "32px 0",
          padding: "20px 22px",
          borderRadius: 12,
          background: "rgba(170,255,77,0.04)",
          border: "1px solid rgba(170,255,77,0.18)",
          maxWidth: "60ch",
        }}
      >
        {pitch && (
          <p style={{
            fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.01em", lineHeight: 1.2,
            margin: "0 0 6px",
          }}>
            {pitch}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--text-muted)", margin: "0 0 12px" }}>
          No spam · Easy unsubscribe
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label htmlFor={inputId} style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              flex: 1, minWidth: 200, height: 38,
              fontFamily: 'var(--font-ui)', fontSize: 13,
              color: '#F5EFE0', background: 'rgba(255,250,240,0.04)',
              border: '1px solid rgba(245,239,224,0.10)', borderRadius: 8,
              padding: '0 12px', outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
            style={{ flexShrink: 0, opacity: isPending ? 0.5 : 1, fontSize: 13, height: 38, padding: '0 18px' }}
          >
            {isPending ? "…" : "Send it"}
          </button>
        </form>
        {error && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--error)', marginTop: 8 }}>{error}</p>
        )}
      </aside>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <label htmlFor={inputId} style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="newsletter-input"
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
          }}
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
