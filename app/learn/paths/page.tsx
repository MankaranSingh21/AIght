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
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Paths
          </p>
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            AI in your field
          </h1>
          <p className="font-serif italic text-lg text-secondary max-w-xl leading-relaxed">
            How the tools you&apos;re hearing about are reshaping every discipline —
            and what to do about it.
          </p>
        </div>

        {/* Field cards grid */}
        <div
          className="grid gap-6"
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
