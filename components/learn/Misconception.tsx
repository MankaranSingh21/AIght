import type { ReactNode } from "react";

interface MisconceptionProps {
  // The wrong intuition (short — < 18 words).
  think: string;
  // The correction. Pass MDX children so authors can use Cite, Glossary, etc.
  children: ReactNode;
}

// Used inline in concept MDX to call out a specific wrong intuition.
// Visual: two-row card. Top: handwritten "You probably think: …" in Caveat.
// Bottom: the editorial correction.
export default function Misconception({ think, children }: MisconceptionProps) {
  return (
    <aside
      style={{
        margin: "32px 0",
        padding: "20px 24px",
        borderRadius: 12,
        background: "rgba(224,112,112,0.04)",
        border: "1px solid rgba(224,112,112,0.20)",
        borderLeft: "3px solid rgba(224,112,112,0.55)",
        maxWidth: "62ch",
      }}
    >
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(224,112,112,0.70)",
        margin: "0 0 8px",
      }}>
        Common misconception
      </p>
      <p style={{
        fontFamily: "var(--font-handwritten), 'Bradley Hand', cursive",
        fontSize: 22,
        lineHeight: 1.3,
        color: "var(--text-primary)",
        margin: "0 0 14px",
        letterSpacing: "0.005em",
      }}>
        “{think}”
      </p>
      <div style={{
        fontFamily: "var(--font-editorial)",
        fontSize: 15,
        color: "var(--text-secondary)",
        lineHeight: 1.75,
      }}>
        {children}
      </div>
    </aside>
  );
}
