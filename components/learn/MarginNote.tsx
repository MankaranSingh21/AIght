"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  side?: "left" | "right";
};

export default function MarginNote({ children, side = "right" }: Props) {
  return (
    <aside
      className="margin-note"
      data-side={side}
      style={{
        fontFamily: "var(--font-editorial)",
        fontStyle: "italic",
        fontSize: 11,
        lineHeight: 1.6,
        color: "var(--text-muted)",
        borderLeft: side === "right" ? "1px solid var(--accent-primary)" : "none",
        borderRight: side === "left" ? "1px solid var(--accent-primary)" : "none",
        paddingLeft: side === "right" ? 10 : 0,
        paddingRight: side === "left" ? 10 : 0,
        opacity: 0.75,
      }}
    >
      {children}
    </aside>
  );
}
