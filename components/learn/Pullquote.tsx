import type { ReactNode } from "react";

export default function Pullquote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      style={{
        fontFamily: "var(--font-editorial)",
        fontStyle: "italic",
        fontSize: "var(--text-2xl)",
        color: "var(--accent-warm)",
        borderLeft: "3px solid var(--accent-warm)",
        paddingLeft: "var(--space-6)",
        margin: "var(--space-12) -48px",
        lineHeight: 1.5,
        maxWidth: "none",
        width: "calc(100% + 96px)",
      }}
    >
      {children}
    </blockquote>
  );
}
