export default function StatPill({ stat, label }: { stat: string; label: string }) {
  return (
    <span style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      background: "var(--accent-primary-glow)",
      border: "1px solid var(--border-emphasis)",
      borderRadius: "var(--radius-md)",
      padding: "6px 14px",
      margin: "0 4px",
      verticalAlign: "middle",
      gap: 2,
    }}>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--accent-primary)",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {stat}
      </span>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        lineHeight: 1,
      }}>
        {label}
      </span>
    </span>
  );
}
