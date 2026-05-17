import Link from "next/link";
import type { ConceptMeta } from "@/lib/learn";

interface FieldRoadmapProps {
  fieldSlug: string;
  fieldName: string;
  intuitions: ConceptMeta[];
  deeper: ConceptMeta[];
}

// Two-track learning roadmap for a field. Server-rendered. No-math intuitions
// on the left (lime); technical mechanics on the right (teal).
// Both tracks ordered as defined in content/paths/field-concept-paths.json.
export default function FieldRoadmap({ fieldSlug: _fieldSlug, fieldName, intuitions, deeper }: FieldRoadmapProps) {
  if (intuitions.length === 0 && deeper.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 48,
        marginBottom: 48,
        padding: "32px 0",
        borderTop: "1px solid rgba(245,239,224,0.07)",
        borderBottom: "1px solid rgba(245,239,224,0.07)",
      }}
      aria-label={`Learning roadmap for ${fieldName}`}
    >
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--accent-primary)", margin: "0 0 8px",
      }}>
        A path through the universe
      </p>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
        letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text-primary)",
        margin: "0 0 12px",
      }}>
        How to actually learn AI for {fieldName}.
      </h2>
      <p style={{
        fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 15,
        color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "56ch",
        margin: "0 0 28px",
      }}>
        Two tracks. Pick your depth. The left one gets you fluent for
        conversations and tool choices. The right one is what you read when
        you actually want to know how it works.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
        className="field-roadmap-grid"
      >
        <Track
          eyebrow="Intuitions"
          subtitle="No math required."
          tint="lime"
          concepts={intuitions}
        />
        <Track
          eyebrow="Goes deeper"
          subtitle="Under the hood."
          tint="teal"
          concepts={deeper}
        />
      </div>

      <style>{`
        @media (max-width: 720px) {
          .field-roadmap-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

interface TrackProps {
  eyebrow: string;
  subtitle: string;
  tint: "lime" | "teal";
  concepts: ConceptMeta[];
}

function Track({ eyebrow, subtitle, tint, concepts }: TrackProps) {
  const color = tint === "lime" ? "var(--accent-primary)" : "var(--accent-secondary, #00FFD1)";
  const bg = tint === "lime" ? "rgba(170,255,77,0.04)" : "rgba(0,255,209,0.04)";
  const border = tint === "lime" ? "rgba(170,255,77,0.18)" : "rgba(0,255,209,0.18)";

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color, margin: "0 0 4px",
      }}>
        {eyebrow}
      </p>
      <p style={{
        fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13,
        color: "var(--text-muted)", margin: "0 0 18px",
      }}>
        {subtitle}
      </p>

      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {concepts.map((c, i) => (
          <li key={c.slug} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, color,
              minWidth: 22, lineHeight: "20px", fontWeight: 600, opacity: 0.7,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/learn/${c.slug}`}
              style={{
                flex: 1, display: "flex", flexDirection: "column", gap: 4,
                padding: "8px 12px", borderRadius: 8,
                background: "transparent",
                textDecoration: "none",
                transition: "background 150ms ease",
              }}
              className="field-roadmap-card"
            >
              <span style={{
                fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600,
                color: "var(--text-primary)", letterSpacing: "-0.01em",
              }}>
                {c.title}
              </span>
              <span style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55,
              }}>
                {c.tagline}
              </span>
              {c.readTime && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.08em", marginTop: 2 }}>
                  {c.readTime}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>

      <style>{`
        .field-roadmap-card:hover {
          background: rgba(255,250,240,0.04);
        }
      `}</style>
    </div>
  );
}
