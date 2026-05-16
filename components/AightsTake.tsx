interface AightsTakeProps {
  take: string | null | undefined;
  variant?: "detail" | "card";
}

// One-line author opinion per tool. Rendered in Caveat (handwritten) so it
// reads as editorial verdict rather than algorithmic output. Renders nothing
// when there's no take for this tool.
export default function AightsTake({ take, variant = "detail" }: AightsTakeProps) {
  if (!take) return null;

  if (variant === "card") {
    return (
      <p
        style={{
          fontFamily: "var(--font-handwritten), 'Bradley Hand', cursive",
          fontSize: 17,
          lineHeight: 1.25,
          color: "var(--text-secondary)",
          margin: 0,
          fontStyle: "italic",
          letterSpacing: "0.01em",
        }}
      >
        “{take}”
      </p>
    );
  }

  // detail variant — the primary surface
  return (
    <aside
      aria-label="AIght's take"
      style={{
        position: "relative",
        marginTop: 18,
        padding: "20px 24px 22px",
        borderRadius: 14,
        background: "rgba(170,255,77,0.04)",
        border: "1px solid rgba(170,255,77,0.18)",
        maxWidth: "60ch",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -10,
          left: 18,
          padding: "2px 10px",
          background: "var(--bg-base)",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--accent-primary)",
        }}
      >
        AIght&rsquo;s take
      </span>
      <p
        style={{
          fontFamily: "var(--font-handwritten), 'Bradley Hand', cursive",
          fontSize: 26,
          lineHeight: 1.3,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "0.005em",
        }}
      >
        “{take}”
      </p>
      <span
        aria-hidden
        style={{
          display: "block",
          marginTop: 10,
          width: 28,
          height: 2,
          background: "linear-gradient(90deg, var(--accent-primary), transparent)",
          borderRadius: 1,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          marginTop: 8,
          display: "block",
        }}
      >
        — Mankaran, after using it long enough to mean it
      </span>
    </aside>
  );
}
