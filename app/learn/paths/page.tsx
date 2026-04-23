import type { Metadata } from "next";
import Link from "next/link";
import fields from "@/content/paths/fields.json";

export const metadata: Metadata = {
  title: "AI in your field — AIght",
  description:
    "How the tools you're hearing about are reshaping every discipline — and what to do about it.",
};

type Difficulty = "Easy" | "Medium" | "Hard";

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  if (difficulty === "Easy") {
    return <span className="tag tag-accent">{difficulty}</span>;
  }
  if (difficulty === "Medium") {
    return (
      <span
        className="tag"
        style={{
          background: "rgba(201, 169, 110, 0.1)",
          color: "var(--accent-warm)",
          borderColor: "rgba(201, 169, 110, 0.3)",
        }}
      >
        {difficulty}
      </span>
    );
  }
  return (
    <span
      className="tag"
      style={{
        background: "rgba(224, 112, 112, 0.1)",
        color: "var(--error)",
        borderColor: "rgba(224, 112, 112, 0.3)",
      }}
    >
      {difficulty}
    </span>
  );
}

export default function PathsPage() {
  return (
    <main className="min-h-screen bg-page">

      {/* Header */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "4rem 2.5rem 4rem",
        }}
      >
        <div style={{ maxWidth: "var(--max-width-content)", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "end",
            }}
            className="paths-header-grid"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                Field Guides
              </p>
              <h1
                className="font-sans font-semibold text-primary"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.25rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                AI in your field
              </h1>
              <p className="font-serif italic text-secondary" style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, maxWidth: "52ch" }}>
                How the tools you&apos;re hearing about are reshaping every
                discipline — and what to do about it.
              </p>
            </div>

            {/* Quiz CTA panel */}
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-emphasis)",
                background: "var(--accent-primary-glow)",
                minWidth: 220,
                maxWidth: 280,
              }}
              className="quiz-cta-panel"
            >
              <p
                className="font-mono text-xs uppercase tracking-[0.12em]"
                style={{ color: "var(--accent-primary)", marginBottom: "0.625rem" }}
              >
                Not sure where you stand?
              </p>
              <p className="font-sans text-base text-primary font-medium mb-3" style={{ letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                Take the AI impact quiz
              </p>
              <Link href="/quiz" className="btn-primary" style={{ display: "inline-block" }}>
                Start quiz →
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-subtle)",
              flexWrap: "wrap",
            }}
          >
            {[
              { stat: "72–88%", label: "of organizations using AI in at least one function (McKinsey 2026)" },
              { stat: "~170M", label: "new or transformed roles created by 2030 (WEF)" },
              { stat: "$13–16T", label: "added to global GDP by 2030 (McKinsey/PwC)" },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <p
                  className="font-sans font-semibold"
                  style={{ fontSize: "var(--text-2xl)", color: "var(--accent-primary)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  {stat}
                </p>
                <p className="font-sans text-xs text-muted" style={{ maxWidth: "22ch", lineHeight: 1.5, marginTop: "0.25rem" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field cards grid */}
      <div
        style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "3rem 2.5rem 5rem",
        }}
      >
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {fields.map((field) => (
            <Link
              key={field.slug}
              href={`/learn/paths/${field.slug}`}
              className="group flex flex-col gap-3 p-6 bg-panel border border-subtle rounded-lg hover:border-emphasis hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <h2
                  className="font-sans text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-150 leading-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {field.field}
                </h2>
                <DifficultyBadge difficulty={field.difficulty as Difficulty} />
              </div>

              <p className="font-serif italic text-sm text-secondary leading-relaxed flex-1 line-clamp-3">
                {field.tagline}
              </p>

              <p className="font-sans text-sm text-accent mt-1">
                Explore path →
              </p>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
