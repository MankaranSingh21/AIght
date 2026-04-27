"use client";

// global-error.tsx catches crashes inside the root layout itself.
// It MUST render its own <html> and <body> since the layout is unavailable.
// CSS vars and Tailwind cannot be used here — raw hex values only.

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body style={{ margin: 0, background: "#0C0A08", fontFamily: "'JetBrains Mono', monospace" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 360 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#F5EFE0", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
              Critical error
            </h1>
            <p style={{ fontSize: 13, color: "rgba(245,239,224,0.50)", lineHeight: 1.7, margin: "0 0 28px" }}>
              The application encountered a fatal error. No data was lost.
              {error.digest && (
                <> &nbsp;Error ID: <code style={{ opacity: 0.5 }}>{error.digest}</code></>
              )}
            </p>
            <button
              onClick={reset}
              style={{
                background: "#AAFF4D",
                color: "#0C0A08",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
