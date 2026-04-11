"use client";

// global-error.tsx catches crashes inside the root layout itself.
// It MUST render its own <html> and <body> since the layout is unavailable.

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
      <body style={{ margin: 0, background: "#F5EFE0", fontFamily: "serif" }}>
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
            <p style={{ fontSize: 72, margin: "0 0 16px", opacity: 0.15 }}>✦</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2C1A0E", margin: "0 0 12px" }}>
              Critical error
            </h1>
            <p style={{ fontSize: 14, color: "#1C3A2E", opacity: 0.6, lineHeight: 1.6, margin: "0 0 24px" }}>
              The application encountered a fatal error. No data was lost.
              {error.digest && (
                <> &nbsp;Error ID: <code style={{ opacity: 0.5 }}>{error.digest}</code></>
              )}
            </p>
            <button
              onClick={reset}
              style={{
                background: "#3D8A2B",
                color: "#F5EFE0",
                border: "none",
                borderRadius: 12,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
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
