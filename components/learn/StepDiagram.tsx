import type { ReactNode } from "react";

export function Step({ label, children }: { label: string; children?: ReactNode }) {
  return null; // Rendered by StepDiagram
}

type StepChild = {
  props: { label: string; children?: ReactNode };
};

export default function StepDiagram({ children }: { children: ReactNode }) {
  const steps = Array.isArray(children) ? children as StepChild[] : [children as StepChild];

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 0,
      margin: "36px 0",
      overflowX: "auto",
    }}>
      {steps.filter(Boolean).map((child, i) => {
        const label = (child as StepChild)?.props?.label ?? `Step ${i + 1}`;
        const desc = (child as StepChild)?.props?.children;

        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1, minWidth: 120 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "var(--accent-primary-glow)",
                border: "1px solid var(--border-emphasis)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                color: "var(--accent-primary)", flexShrink: 0, marginBottom: 10,
              }}>
                {i + 1}
              </div>
              <p style={{
                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13,
                color: "var(--text-primary)", textAlign: "center",
                margin: "0 0 6px", letterSpacing: "-0.01em",
              }}>
                {label}
              </p>
              {desc && (
                <p style={{
                  fontFamily: "var(--font-editorial)", fontSize: 12,
                  color: "var(--text-secondary)", textAlign: "center",
                  lineHeight: 1.6, margin: 0, padding: "0 8px",
                }}>
                  {desc}
                </p>
              )}
            </div>

            {i < steps.filter(Boolean).length - 1 && (
              <div style={{ display: "flex", alignItems: "center", paddingTop: 6, flexShrink: 0 }}>
                <div style={{ width: 24, height: 1, background: "var(--border-emphasis)", position: "relative" }}>
                  <span style={{
                    position: "absolute", right: -4, top: -5,
                    fontSize: 10, color: "var(--accent-primary)", opacity: 0.6,
                  }}>›</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
