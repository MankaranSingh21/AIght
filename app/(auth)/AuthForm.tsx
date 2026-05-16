"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Mode = "signin" | "signup";

interface AuthFormProps {
  mode: Mode;
}

// Shared form for /signin and /signup. Magic link is the default (one click,
// no password to remember). Email + password is offered as an alternative for
// people who prefer it.
export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const next = params.get("next") ?? "/account";

  const [method, setMethod] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (method === "magic") {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
            shouldCreateUser: isSignup,
          },
        });
        if (error) throw error;
        setSentTo(email);
        return;
      }

      // password mode
      if (isSignup) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        if (error) throw error;
        setSentTo(email);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <div style={{ textAlign: "center", padding: "32px 24px", maxWidth: 480, margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
        }}>
          Check your email
        </p>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em",
          lineHeight: 1.15, margin: "0 0 16px",
        }}>
          We sent a link to {sentTo}.
        </h2>
        <p style={{
          fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 16,
          color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "44ch", margin: "0 auto 24px",
        }}>
          {method === "magic"
            ? "Click the link to finish signing in. It expires in an hour."
            : "Click the link to confirm your email, then sign in."}
        </p>
        <button
          onClick={() => { setSentTo(null); setEmail(""); setPassword(""); }}
          className="btn-ghost"
          style={{ fontSize: 13 }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px" }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 14,
      }}>
        {isSignup ? "Create an account" : "Sign in"}
      </p>
      <h1 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 52px)",
        fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em",
        lineHeight: 1.1, margin: "0 0 16px",
      }}>
        {isSignup ? "Make AIght yours." : "Welcome back."}
      </h1>
      <p style={{
        fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 16,
        color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "44ch", marginBottom: 32,
      }}>
        {isSignup
          ? "Save your bookmarks, quiz result, and reading trajectory across devices. No spam."
          : "Pick up where you left off."}
      </p>

      {/* Method toggle */}
      <div style={{ display: "inline-flex", gap: 2, padding: 2, borderRadius: 999, background: "rgba(245,239,224,0.05)", border: "1px solid rgba(245,239,224,0.08)", marginBottom: 20 }}>
        {(["magic", "password"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
              padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer",
              background: method === m ? "var(--accent-primary)" : "transparent",
              color: method === m ? "var(--text-inverse, #0C0A08)" : "var(--text-secondary)",
              transition: "all 150ms ease",
            }}
          >
            {m === "magic" ? "Magic link" : "Password"}
          </button>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: 14 }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.10em",
          textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 6,
        }}>
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 8,
            background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
            color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15,
            outline: "none",
          }}
        />
      </label>

      {method === "password" && (
        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.10em",
            textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 6,
          }}>
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isSignup ? 8 : undefined}
            autoComplete={isSignup ? "new-password" : "current-password"}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 8,
              background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
              color: "var(--text-primary)", fontFamily: "var(--font-ui)", fontSize: 15,
              outline: "none",
            }}
          />
          {isSignup && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 6, display: "block" }}>
              Eight characters or more.
            </span>
          )}
        </label>
      )}

      {error && (
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--error)",
          padding: "10px 14px", borderRadius: 8, background: "rgba(224,112,112,0.08)",
          border: "1px solid rgba(224,112,112,0.25)", marginBottom: 16,
        }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ width: "100%", padding: "14px", fontSize: 15, opacity: submitting ? 0.6 : 1, cursor: submitting ? "wait" : "pointer" }}
      >
        {submitting
          ? "…"
          : method === "magic"
          ? "Email me a sign-in link"
          : isSignup ? "Create account" : "Sign in"}
      </button>

      <p style={{
        fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-secondary)",
        textAlign: "center", marginTop: 24,
      }}>
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/signin" : "/signup"}
          style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}
        >
          {isSignup ? "Sign in →" : "Create one →"}
        </Link>
      </p>
    </form>
  );
}
