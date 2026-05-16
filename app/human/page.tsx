import type { Metadata } from "next";
import Link from "next/link";
import { getAllHumanEssays } from "@/lib/human";
import { buildCollectionLd } from "@/utils/jsonld";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "What AI Cannot Do",
  description:
    "Short essays on the work AI can't replace: taste, care, originality, context. The human strengths the tools quietly need us to keep.",
  openGraph: {
    title: "What AI Cannot Do",
    description:
      "Short essays on the work AI can't replace. Taste, care, originality, context.",
  },
};

export default function HumanIndexPage() {
  const essays = getAllHumanEssays();

  const jsonLd = buildCollectionLd({
    path: "/human",
    name: "What AI Cannot Do",
    description: "Short essays on the work AI can't replace.",
    items: essays.map((e) => ({ name: e.title, url: `/human/${e.slug}` })),
    itemType: "Article",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
        }}
      >
        <article
          style={{
            maxWidth: "var(--max-width-editorial)",
            margin: "0 auto",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-warm)",
              marginBottom: "var(--space-3)",
            }}
          >
            What AI Cannot Do
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "var(--space-5)",
            }}
          >
            The work that doesn&rsquo;t compress.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              lineHeight: 1.65,
              marginBottom: "var(--space-10)",
            }}
          >
            Short essays on the human work AI tools quietly need us to keep
            doing. Taste, care, originality, context. The things that get
            harder to spot exactly when they become more valuable.
          </p>

          {/* Manifesto block */}
          <div
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-base)",
              lineHeight: 1.85,
              color: "var(--text-primary)",
              maxWidth: "68ch",
              marginBottom: "var(--space-16)",
              borderLeft: "3px solid var(--accent-warm)",
              paddingLeft: "var(--space-5)",
            }}
          >
            <p style={{ margin: 0 }}>
              Most of the rest of this site is about what AI can do, and how to
              choose the tools that do it well. This section is the other
              half &mdash; the part that doesn&rsquo;t fit in a directory and
              isn&rsquo;t for sale. If a tool is going to leverage you, it
              helps to know what you&rsquo;re bringing that the tool can&rsquo;t.
            </p>
          </div>

          {/* Essay list */}
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-6)",
            }}
          >
            The essays
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {essays.map((essay, i) => (
              <li key={essay.slug}>
                <Link
                  href={`/human/${essay.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-6) 0",
                    borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                    borderBottom: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    transition: "background 150ms ease",
                  }}
                  className="group hover:bg-primary/5"
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", marginBottom: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        color: "var(--accent-warm)",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-2xl)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                        margin: 0,
                      }}
                    >
                      {essay.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontStyle: "italic",
                      fontSize: "var(--text-base)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      margin: "0 0 6px",
                      maxWidth: "60ch",
                    }}
                  >
                    {essay.tagline}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.08em",
                      margin: 0,
                    }}
                  >
                    {essay.readTime}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div
            style={{
              marginTop: "var(--space-16)",
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
            }}
          >
            <Link href="/learn/paths/quiz" className="btn-primary" style={{ textDecoration: "none" }}>
              See what&rsquo;s yours →
            </Link>
            <Link href="/about" className="btn-ghost" style={{ textDecoration: "none" }}>
              About AIght
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
