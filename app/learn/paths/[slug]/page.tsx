import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fields from "@/content/paths/fields.json";
import FieldBackground from "@/components/learn/FieldBackground";
import AugmentationDiagram from "@/components/learn/AugmentationDiagram";

type Difficulty = "Easy" | "Medium" | "Hard";

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

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const field = fields.find((f) => f.slug === slug);
  if (!field) notFound();

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>

      {/* ── Full-bleed hero with ambient background ───────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <FieldBackground />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            padding: "0 2.5rem",
          }}
        >
          <Link
            href="/learn/paths"
            className="font-mono text-xs uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors duration-150 mb-10 block"
            style={{ width: "fit-content" }}
          >
            ← All fields
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "start",
              gap: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Field guide
              </p>
              <h1
                className="font-sans font-semibold text-primary"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: "1.25rem",
                }}
              >
                {field.field}
              </h1>
              <p
                className="font-serif italic text-secondary"
                style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, maxWidth: "56ch" }}
              >
                {field.tagline}
              </p>
            </div>
            <div style={{ paddingTop: "3.5rem" }}>
              <DifficultyBadge difficulty={field.difficulty as Difficulty} />
            </div>
          </div>

          {/* Quiz CTA */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "2.5rem",
            }}
          >
            <Link href="/quiz" className="btn-primary">
              Run AI impact quiz →
            </Link>
            <span
              className="font-sans text-sm text-muted"
            >
              See your personal disruption score in 2 minutes
            </span>
          </div>
        </div>
      </section>

      {/* ── Content grid ──────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "4rem 2.5rem 6rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: "4rem",
            alignItems: "start",
          }}
          className="field-content-grid"
        >
          {/* ── Left: main content ─────────────────────────────────────── */}
          <div>

            {/* What's changing */}
            <section style={{ marginBottom: "3.5rem" }}>
              <h2
                className="font-sans font-semibold text-primary"
                style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em", marginBottom: "1.75rem" }}
              >
                What&apos;s changing
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {field.transformations.map((text, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1.5rem",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--accent-primary)",
                        paddingTop: "0.2rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-sans text-base text-secondary" style={{ lineHeight: 1.7 }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI augmentation diagram */}
            <section
              style={{
                marginBottom: "3.5rem",
                padding: "2rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
              }}
            >
              <AugmentationDiagram slug={slug} />
            </section>

            {/* What to actually do */}
            <section style={{ marginBottom: "3.5rem" }}>
              <h2
                className="font-sans font-semibold text-primary"
                style={{ fontSize: "var(--text-2xl)", letterSpacing: "-0.02em", marginBottom: "1.75rem" }}
              >
                What to actually do
              </h2>
              <blockquote
                style={{
                  borderLeft: "3px solid var(--accent-warm)",
                  paddingLeft: "var(--space-6)",
                  margin: 0,
                }}
              >
                <p
                  className="font-serif text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}
                >
                  {field.action_paragraph}
                </p>
              </blockquote>
            </section>

            {/* Difficulty reasoning */}
            <section
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
              }}
            >
              <DifficultyBadge difficulty={field.difficulty as Difficulty} />
              <p className="font-sans text-sm text-secondary" style={{ lineHeight: 1.6 }}>
                {field.difficulty_reason}
              </p>
            </section>
          </div>

          {/* ── Right: sidebar ─────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "sticky", top: "5.5rem" }}>

            {/* Quiz CTA card */}
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-emphasis)",
                background: "var(--accent-primary-glow)",
              }}
            >
              <p
                className="font-mono text-xs uppercase tracking-[0.12em]"
                style={{ color: "var(--accent-primary)", marginBottom: "0.75rem" }}
              >
                Personalize this
              </p>
              <p className="font-sans text-base text-primary font-medium mb-1" style={{ letterSpacing: "-0.01em" }}>
                How disrupted are you, really?
              </p>
              <p className="font-sans text-sm text-secondary mb-4" style={{ lineHeight: 1.6 }}>
                Five questions. An honest score tailored to your specific role and work style.
              </p>
              <Link href="/quiz" className="btn-primary" style={{ display: "inline-block" }}>
                Take the quiz →
              </Link>
            </div>

            {/* Tools to know */}
            <div>
              <h3
                className="font-sans font-semibold text-primary"
                style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.02em", marginBottom: "1rem" }}
              >
                Tools to know
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {field.tools.map((tool, i) => (
                  <Link
                    key={i}
                    href="/tools"
                    className="group"
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface)",
                      display: "block",
                      textDecoration: "none",
                      transition: "border-color 200ms ease, transform 200ms ease",
                    }}
                  >
                    <p
                      className="font-sans text-base font-medium text-primary group-hover:text-accent transition-colors duration-150"
                      style={{ letterSpacing: "-0.01em", marginBottom: "0.25rem" }}
                    >
                      {tool.name}
                    </p>
                    <p className="font-sans text-sm text-secondary" style={{ lineHeight: 1.5 }}>
                      {tool.what_it_does}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Concepts to understand */}
            <div>
              <h3
                className="font-sans font-semibold text-primary"
                style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.02em", marginBottom: "1rem" }}
              >
                Concepts to understand
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {field.concepts.map((concept, i) => (
                  <Link
                    key={i}
                    href={`/learn/${conceptToSlug(concept)}`}
                    className="tag tag-accent hover:opacity-80 transition-opacity duration-150"
                  >
                    {concept}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ──────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "3rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width-content)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              className="font-sans font-semibold text-primary"
              style={{ fontSize: "var(--text-xl)", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}
            >
              Get your personal disruption score
            </p>
            <p className="font-sans text-sm text-secondary">
              Based on your specific role within {field.field}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/quiz" className="btn-primary">
              Run AI impact quiz →
            </Link>
            <Link href="/learn/paths" className="btn-ghost">
              Explore other fields
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
