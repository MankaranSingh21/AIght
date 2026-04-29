import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllConcepts, getConceptSource } from "@/lib/learn";
import { createServiceClient } from "@/utils/supabase/service";
import RagSimulation from "@/components/learn/RagSimulation";
import McpSimulation from "@/components/learn/McpSimulation";
import EmbeddingsViz from "@/components/learn/EmbeddingsViz";
import AgentsSimulation from "@/components/learn/AgentsSimulation";
import AttentionViz from "@/components/learn/AttentionViz";
import FineTuningComparison from "@/components/learn/FineTuningComparison";
import Pullquote from "@/components/learn/Pullquote";
import CodeBlock from "@/components/learn/CodeBlock";
import ReadingProgressBar from "@/components/learn/ReadingProgressBar";
import ConceptHeader3DClient from "@/components/learn/ConceptHeader3DClient";
import type { JSX } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const concepts = getAllConcepts();
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getConceptSource(slug);
  if (!source) return { title: "Not Found" };

  const { frontmatter } = await compileMDX<{
    title: string;
    tagline: string;
  }>({ source, options: { parseFrontmatter: true } });

  return {
    title: frontmatter.title,
    description: frontmatter.tagline,
  };
}

const mdxComponents = {
  RagSimulation,
  McpSimulation,
  EmbeddingsViz,
  AgentsSimulation,
  AttentionViz,
  FineTuningComparison,
  Pullquote,
  pre: (props: JSX.IntrinsicElements["pre"]) => <CodeBlock {...props} />,
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 28,
        fontWeight: 700,
        color: "#F5EFE0",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginTop: 56,
        marginBottom: 20,
      }}
      {...props}
    />
  ),
  h3: (props: JSX.IntrinsicElements["h3"]) => (
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 22,
        fontWeight: 700,
        color: "#F5EFE0",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
        marginTop: 40,
        marginBottom: 14,
      }}
      {...props}
    />
  ),
  p: (props: JSX.IntrinsicElements["p"]) => (
    <p
      style={{
        fontFamily: "var(--font-editorial)",
        fontSize: 16,
        color: "rgba(245,239,224,0.75)",
        lineHeight: 1.85,
        letterSpacing: "0.01em",
        marginBottom: 22,
        maxWidth: "68ch",
      }}
      {...props}
    />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote
      style={{
        fontFamily: "var(--font-editorial)",
        fontStyle: "italic",
        fontSize: 22,
        color: "var(--accent-warm)",
        borderLeft: "3px solid var(--accent-warm)",
        paddingLeft: 24,
        margin: "40px 0",
        maxWidth: "58ch",
        lineHeight: 1.6,
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid rgba(245,239,224,0.07)",
        margin: "64px 0",
      }}
    />
  ),
  code: (props: JSX.IntrinsicElements["code"]) => (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        background: "var(--bg-elevated)",
        padding: "2px 6px",
        borderRadius: 4,
        color: "var(--accent-primary)",
      }}
      {...props}
    />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong
      style={{ fontWeight: 600, color: "#F5EFE0", fontStyle: "normal" }}
      {...props}
    />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a
      style={{
        color: "var(--accent-primary)",
        textDecoration: "underline",
        textUnderlineOffset: 2,
        transition: "color 150ms ease",
      }}
      {...props}
    />
  ),
  ul: (props: JSX.IntrinsicElements["ul"]) => (
    <ul
      style={{
        fontFamily: "var(--font-editorial)",
        fontSize: 16,
        color: "rgba(245,239,224,0.75)",
        lineHeight: 1.85,
        listStyleType: "disc",
        listStylePosition: "outside",
        marginLeft: 20,
        marginBottom: 22,
        maxWidth: "68ch",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    />
  ),
  ol: (props: JSX.IntrinsicElements["ol"]) => (
    <ol
      style={{
        fontFamily: "var(--font-editorial)",
        fontSize: 16,
        color: "rgba(245,239,224,0.75)",
        lineHeight: 1.85,
        listStyleType: "decimal",
        listStylePosition: "outside",
        marginLeft: 20,
        marginBottom: 22,
        maxWidth: "68ch",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    />
  ),
};

export default async function LearnConceptPage({ params }: Props) {
  const { slug } = await params;
  const source = getConceptSource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileMDX<{
    title: string;
    tagline: string;
    readTime: string;
    slug: string;
  }>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  // Fetch tools that list this concept in their related_concepts array
  const supabase = createServiceClient();
  const { data: relatedToolsData } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category")
    .contains("related_concepts", [slug])
    .order("created_at", { ascending: false })
    .limit(4);
  const relatedTools = relatedToolsData ?? [];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <ReadingProgressBar />

      {/* Full-width 3D constellation header */}
      <ConceptHeader3DClient slug={slug} />

      <div
        style={{
          maxWidth: "var(--max-width-editorial)",
          margin: "0 auto",
          padding: "24px 48px 96px",
        }}
      >
        {/* Back */}
        <Link
          href="/learn"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "rgba(245,239,224,0.45)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 48,
          }}
          className="hover:text-primary"
        >
          ← All concepts
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(245,239,224,0.30)",
              marginBottom: 14,
            }}
          >
            Concept
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "#F5EFE0",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 18px",
            }}
          >
            {frontmatter.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 17,
              color: "rgba(245,239,224,0.55)",
              lineHeight: 1.8,
              marginBottom: 20,
              maxWidth: "54ch",
            }}
          >
            {frontmatter.tagline}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(245,239,224,0.30)",
            }}
          >
            {frontmatter.readTime}
          </p>
        </header>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(245,239,224,0.07)",
            marginBottom: 48,
          }}
        />

        {/* MDX body */}
        <article className="learn-article">{content}</article>

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section
            style={{
              marginTop: 64,
              paddingTop: 40,
              borderTop: "1px solid rgba(245,239,224,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245,239,224,0.30)",
                marginBottom: 20,
              }}
            >
              Tools that use this
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tool/${tool.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(245,239,224,0.06)",
                    textDecoration: "none",
                    gap: 16,
                  }}
                  className="group"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        display: "block",
                        marginBottom: 2,
                        transition: "color 150ms ease",
                      }}
                      className="group-hover:text-accent"
                    >
                      {tool.name}
                    </span>
                    {tool.vibe_description && (
                      <span
                        style={{
                          fontFamily: "var(--font-editorial)",
                          fontStyle: "italic",
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tool.vibe_description}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span className="tag">{tool.category ?? "AI Tool"}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--accent-primary)",
                        opacity: 0,
                        transition: "opacity 150ms ease",
                      }}
                      className="group-hover:opacity-100"
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <Link
                href={`/tools?q=${encodeURIComponent(slug)}`}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  color: "var(--accent-primary)",
                  textDecoration: "none",
                }}
              >
                See all tools using {frontmatter.title} →
              </Link>
            </div>
          </section>
        )}

        {/* Footer nav */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: "1px solid rgba(245,239,224,0.07)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/learn"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "rgba(245,239,224,0.45)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            className="hover:text-primary"
          >
            ← Back to all concepts
          </Link>
          <Link
            href="/tools"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--accent-primary)",
              textDecoration: "none",
            }}
          >
            Browse tools →
          </Link>
        </div>
      </div>
    </main>
  );
}
