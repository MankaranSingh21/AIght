import Link from "next/link";

export interface ToolHumanNoteData {
  headline: string;
  body: string;
  essay: string; // slug of a /human/[slug] essay
}

interface ToolHumanNoteProps {
  toolName: string;
  note: ToolHumanNoteData | null;
}

// Small "what this can't do" card mounted on /tool/[slug]. Renders only if a
// note exists for this tool. Otherwise renders nothing.
export default function ToolHumanNote({ toolName, note }: ToolHumanNoteProps) {
  if (!note) return null;

  return (
    <section
      style={{
        marginTop: 80,
        paddingTop: 40,
        borderTop: "1px solid rgba(244,171,31,0.18)",
      }}
    >
      <div
        style={{
          padding: "28px 32px",
          borderRadius: 16,
          background: "rgba(244,171,31,0.05)",
          border: "1px solid rgba(244,171,31,0.20)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent-warm)",
            marginBottom: 10,
          }}
        >
          What {toolName} can&rsquo;t do
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            margin: "0 0 14px",
            maxWidth: "44ch",
          }}
        >
          {note.headline}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-editorial)",
            fontSize: 16,
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            margin: "0 0 18px",
            maxWidth: "60ch",
          }}
        >
          {note.body}
        </p>
        <Link
          href={`/human/${note.essay}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--accent-warm)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(244,171,31,0.40)",
            paddingBottom: 1,
          }}
        >
          Read the essay →
        </Link>
      </div>
    </section>
  );
}
