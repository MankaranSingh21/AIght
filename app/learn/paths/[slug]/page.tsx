import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fields from "@/content/paths/fields.json";

type Difficulty = "Easy" | "Medium" | "Hard";

// ── Concept slug mapping ───────────────────────────────────────────────────────

function conceptToSlug(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("retrieval") || t.includes("rag")) return "rag";
  if (t.includes("mcp") || t.includes("model context protocol")) return "mcp";
  if (t.includes("agent") || t.includes("autonomous") || t.includes("agentic") || t.includes("closed-loop")) return "agents";
  if (t.includes("embedding") || t.includes("vector")) return "embeddings";
  if (t.includes("transformer") || t.includes("attention") || t.includes("multimodal")) return "transformers";
  if (t.includes("fine-tun") || t.includes("fine tuning")) return "fine-tuning";
  if (t.includes("generative") || t.includes("generation")) return "fine-tuning";
  if (t.includes("neural") || t.includes("deep learning") || t.includes("graph neural")) return "transformers";
  if (t.includes("predict") || t.includes("classification")) return "embeddings";
  return "rag";
}

// ── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return fields.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const field = fields.find((f) => f.slug === slug);
  if (!field) return {};
  return {
    title: `${field.field} — AI in your field — AIght`,
    description: field.tagline,
  };
}

// ── Difficulty badge ───────────────────────────────────────────────────────────

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

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const field = fields.find((f) => f.slug === slug);
  if (!field) notFound();

  return (
    <main className="min-h-screen bg-page">
      <article className="max-w-editorial mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Back link */}
        <Link
          href="/learn/paths"
          className="font-mono text-xs uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors duration-150 mb-12 block"
        >
          ← All fields
        </Link>

        {/* ── a. Hero ─────────────────────────────────────────────────────── */}
        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
            Field guide
          </p>
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            {field.field}
          </h1>
          <p className="font-serif italic text-lg text-secondary leading-relaxed">
            {field.tagline}
          </p>
        </header>

        <hr
          className="border-none mb-16"
          style={{ borderTop: "1px solid var(--border-subtle)", margin: "0 0 4rem" }}
        />

        {/* ── b. What's changing ──────────────────────────────────────────── */}
        <section className="mb-16">
          <h2
            className="font-sans text-2xl font-semibold text-primary mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            What&apos;s changing
          </h2>
          <div className="flex flex-col gap-4">
            {field.transformations.map((text, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-subtle bg-panel"
              >
                <p className="font-mono text-xs text-muted mb-3 uppercase tracking-[0.1em]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-sans text-base text-secondary leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr
          className="border-none mb-16"
          style={{ borderTop: "1px solid var(--border-subtle)", margin: "0 0 4rem" }}
        />

        {/* ── c. Tools to know ────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2
            className="font-sans text-2xl font-semibold text-primary mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            Tools to know
          </h2>
          <div className="flex flex-col gap-4">
            {field.tools.map((tool, i) => (
              <Link
                key={i}
                href="/tools"
                className="group flex flex-col gap-2 p-6 rounded-lg border border-subtle bg-panel hover:border-emphasis transition-all duration-200 hover:-translate-y-0.5"
              >
                <h3
                  className="font-sans text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-150"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {tool.name}
                </h3>
                <p className="font-sans text-base text-secondary leading-relaxed">
                  {tool.what_it_does}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <hr
          className="border-none mb-16"
          style={{ borderTop: "1px solid var(--border-subtle)", margin: "0 0 4rem" }}
        />

        {/* ── d. Concepts to understand ───────────────────────────────────── */}
        <section className="mb-16">
          <h2
            className="font-sans text-2xl font-semibold text-primary mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            Concepts to understand
          </h2>
          <div className="flex flex-wrap gap-3">
            {field.concepts.map((concept, i) => {
              const conceptSlug = conceptToSlug(concept);
              return (
                <Link
                  key={i}
                  href={`/learn/${conceptSlug}`}
                  className="tag tag-accent hover:opacity-80 transition-opacity duration-150"
                >
                  {concept}
                </Link>
              );
            })}
          </div>
        </section>

        <hr
          className="border-none mb-16"
          style={{ borderTop: "1px solid var(--border-subtle)", margin: "0 0 4rem" }}
        />

        {/* ── e. What to actually do ──────────────────────────────────────── */}
        <section className="mb-16">
          <h2
            className="font-sans text-2xl font-semibold text-primary mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            What to actually do
          </h2>
          <blockquote
            className="pl-6"
            style={{ borderLeft: "3px solid var(--accent-warm)" }}
          >
            <p className="font-serif text-base text-primary leading-[1.85] italic"
               style={{ color: "var(--accent-warm)" }}>
            </p>
            <p className="font-serif text-base text-secondary leading-[1.85]">
              {field.action_paragraph}
            </p>
          </blockquote>
        </section>

        <hr
          className="border-none mb-12"
          style={{ borderTop: "1px solid var(--border-subtle)", margin: "0 0 3rem" }}
        />

        {/* ── f. Difficulty ───────────────────────────────────────────────── */}
        <section className="flex items-start gap-4">
          <DifficultyBadge difficulty={field.difficulty as Difficulty} />
          <p className="font-sans text-sm text-secondary leading-relaxed">
            {field.difficulty_reason}
          </p>
        </section>

      </article>
    </main>
  );
}
