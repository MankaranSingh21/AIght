import Link from "next/link";
import type { HumanEssayMeta } from "@/lib/human";

interface WheelhouseBlockProps {
  essays: HumanEssayMeta[];           // 1–3 essays, pre-ranked by quiz logic
}

// Renders inside the quiz ReportScreen. The "what only you can do" block —
// the human counterpart to the tool/concept recommendations.
export default function WheelhouseBlock({ essays }: WheelhouseBlockProps) {
  if (!essays || essays.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 48,
        paddingTop: 48,
        paddingBottom: 8,
        borderTop: "1px solid rgba(245,239,224,0.08)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-warm)",
          marginBottom: 8,
        }}
      >
        What only you can do
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: "0 0 12px",
        }}
      >
        Your wheelhouse.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontStyle: "italic",
          fontSize: 16,
          color: "rgba(245,239,224,0.55)",
          lineHeight: 1.7,
          maxWidth: "52ch",
          marginBottom: 28,
        }}
      >
        Based on how you said you think and work, these are the human strengths
        AI won&rsquo;t compress for you. Lean into them on purpose.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {essays.map((essay) => (
          <Link
            key={essay.slug}
            href={`/human/${essay.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "20px 22px",
              borderRadius: 14,
              background: "rgba(244,171,31,0.05)",
              border: "1px solid rgba(244,171,31,0.20)",
              textDecoration: "none",
              transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="hover:bg-warm/10 hover:border-warm/40"
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-warm)",
              }}
            >
              Essay
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {essay.title}
            </span>
            <span
              style={{
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {essay.tagline}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--accent-warm)",
                marginTop: 6,
              }}
            >
              Read →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
