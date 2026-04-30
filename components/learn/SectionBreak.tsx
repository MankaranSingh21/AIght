export default function SectionBreak() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      margin: "64px 0",
    }}>
      <div style={{ flex: 1, height: 1, background: "rgba(245,239,224,0.07)" }} />
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 14,
        color: "var(--accent-primary)",
        opacity: 0.35,
        lineHeight: 1,
        userSelect: "none",
      }}>§</span>
      <div style={{ flex: 1, height: 1, background: "rgba(245,239,224,0.07)" }} />
    </div>
  );
}
