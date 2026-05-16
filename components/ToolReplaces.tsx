interface ToolReplacesProps {
  toolName: string;
  replaces: string[] | null | undefined;
}

// "You can probably stop using:" block — small concrete savings list.
// Renders nothing when this tool has no `replaces` seed entry.
export default function ToolReplaces({ toolName, replaces }: ToolReplacesProps) {
  if (!replaces || replaces.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 64,
        paddingTop: 40,
        borderTop: "1px solid rgba(170,255,77,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
            }}
          >
            What {toolName} replaces
          </span>
          <span
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            You can probably stop using:
          </span>
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {replaces.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                fontFamily: "var(--font-editorial)",
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--accent-primary)",
                  opacity: 0.7,
                  minWidth: 16,
                  flexShrink: 0,
                  textDecoration: "line-through",
                }}
              >
                ✕
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
