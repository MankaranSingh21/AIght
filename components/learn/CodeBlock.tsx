"use client";
import { useRef, useState } from "react";
import type { HTMLAttributes } from "react";

export default function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div style={{ position: "relative", margin: "28px 0" }}>
      <pre
        ref={preRef}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          background: "var(--bg-elevated)",
          borderRadius: 8,
          padding: 24,
          overflowX: "auto",
          lineHeight: 1.7,
          border: "1px solid rgba(245,239,224,0.07)",
          margin: 0,
        }}
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: copied ? "var(--accent-primary)" : "var(--text-muted)",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 4,
          padding: "3px 8px",
          cursor: "pointer",
          transition: "color 150ms ease",
          lineHeight: 1.6,
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
