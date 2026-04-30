import type { ReactNode } from "react";

type CalloutType = "tip" | "warning" | "insight";

const STYLES: Record<CalloutType, { border: string; bg: string; label: string; labelColor: string }> = {
  tip: {
    border: "var(--accent-primary)",
    bg: "rgba(170,255,77,0.05)",
    label: "TIP",
    labelColor: "var(--accent-primary)",
  },
  warning: {
    border: "var(--accent-warm)",
    bg: "rgba(244,171,31,0.06)",
    label: "NOTE",
    labelColor: "var(--accent-warm)",
  },
  insight: {
    border: "var(--accent-secondary)",
    bg: "rgba(0,255,209,0.05)",
    label: "INSIGHT",
    labelColor: "var(--accent-secondary)",
  },
};

export default function Callout({
  children,
  type = "tip",
}: {
  children: ReactNode;
  type?: CalloutType;
}) {
  const s = STYLES[type];
  return (
    <div style={{
      borderLeft: `3px solid ${s.border}`,
      background: s.bg,
      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
      padding: "16px 20px",
      margin: "28px 0",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: s.labelColor,
        margin: "0 0 8px",
      }}>
        {s.label}
      </p>
      <div style={{
        fontFamily: "var(--font-editorial)",
        fontSize: 15,
        lineHeight: 1.75,
        color: "rgba(245,239,224,0.75)",
      }}>
        {children}
      </div>
    </div>
  );
}
