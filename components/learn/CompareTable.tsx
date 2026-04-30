import type { ReactNode } from "react";

export function CompareRow({}: { label: string; left: string; right: string }) {
  return null; // Rendered by CompareTable
}

type RowChild = {
  props: { label: string; left: string; right: string };
};

export default function CompareTable({
  left,
  right,
  children,
}: {
  left: string;
  right: string;
  children: ReactNode;
}) {
  const rows = Array.isArray(children)
    ? (children as RowChild[])
    : [children as RowChild];
  const validRows = rows.filter(Boolean);

  return (
    <div style={{
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      margin: "32px 0",
      fontFamily: "var(--font-ui)",
    }}>
      {/* Header row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        borderBottom: "1px solid var(--border-default)",
        background: "var(--bg-elevated)",
      }}>
        <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }} />
        <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-primary)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
          {left}
        </div>
        <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {right}
        </div>
      </div>

      {/* Data rows */}
      {validRows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: i < validRows.length - 1 ? "1px solid var(--border-subtle)" : "none",
            background: i % 2 === 0 ? "transparent" : "rgba(245,239,224,0.015)",
          }}
        >
          <div style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            {row.props.label}
          </div>
          <div style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5, fontWeight: 500 }}>
            {row.props.left}
          </div>
          <div style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {row.props.right}
          </div>
        </div>
      ))}
    </div>
  );
}
