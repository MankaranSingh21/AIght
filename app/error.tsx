"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "25%",
          width: 384,
          height: 384,
          background: "var(--accent-primary-glow)",
          borderRadius: "50%",
          filter: "blur(80px)",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 360 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-4xl)",
            color: "var(--accent-primary)",
            opacity: 0.15,
            marginBottom: 24,
            userSelect: "none",
          }}
        >
          ✦
        </p>

        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Something broke.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            An unexpected error occurred. We caught it before it could do any
            real damage.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: 8,
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link
            href="/"
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            ← Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
