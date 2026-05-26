import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllConcepts, getConceptSource, DEFAULT_AUTHOR } from "@/lib/learn";
import { createServiceClient } from "@/utils/supabase/service";
import RagSimulation from "@/components/learn/RagSimulation";
import McpSimulation from "@/components/learn/McpSimulation";
import EmbeddingsViz from "@/components/learn/EmbeddingsViz";
import AgentsSimulation from "@/components/learn/AgentsSimulation";
import AttentionViz from "@/components/learn/AttentionViz";
import FineTuningComparison from "@/components/learn/FineTuningComparison";
import Pullquote from "@/components/learn/Pullquote";
import PullquoteMargin from "@/components/learn/PullquoteMargin";
import CodeBlock from "@/components/learn/CodeBlock";
import ReadingProgressBar from "@/components/learn/ReadingProgressBar";
import ConceptHeader3DClient from "@/components/learn/ConceptHeader3DClient";
import ArticleReveal from "@/components/learn/ArticleReveal";
import MarginNote from "@/components/learn/MarginNote";
import SectionBreak from "@/components/learn/SectionBreak";
import Callout from "@/components/learn/Callout";
import StepDiagram, { Step } from "@/components/learn/StepDiagram";
import CompareTable, { CompareRow } from "@/components/learn/CompareTable";
import StatPill from "@/components/learn/StatPill";
import EditorialLayout from "@/components/learn/EditorialLayout";
import StickyTOC from "@/components/learn/StickyTOC";
import ArticleMeta from "@/components/learn/ArticleMeta";
import RelatedConcepts from "@/components/learn/RelatedConcepts";
import Footnote from "@/components/learn/Footnote";
import Footnotes from "@/components/learn/Footnotes";
import ConceptMiniMap from "@/components/learn/ConceptMiniMap";
import Misconception from "@/components/learn/Misconception";
import { ConceptDemo } from "@/components/learn/ConceptDemo";
import TokenizationDemo from "@/components/learn/TokenizationDemo";
import TemperatureDemo from "@/components/learn/TemperatureDemo";
import ChainOfThoughtDemo from "@/components/learn/ChainOfThoughtDemo";
import KvCacheDemo from "@/components/learn/KvCacheDemo";
import AttentionQkvDemo from "@/components/learn/AttentionQkvDemo";
import fields from "@/content/paths/fields.json";
import Cite from "@/components/learn/Cite";
import Glossary from "@/components/learn/Glossary";
import Byline from "@/components/Byline";
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
  PullquoteMargin,
  MarginNote,
  SectionBreak,
  Callout,
  StepDiagram,
  Step,
  CompareTable,
  CompareRow,
  StatPill,
  Footnote,
  Cite,
  Glossary,
  Misconception,
  ConceptDemo,
  TokenizationDemo,
  TemperatureDemo,
  ChainOfThoughtDemo,
  KvCacheDemo,
  AttentionQkvDemo,
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
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    />
  ),
};

type ConceptFrontmatter = {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
  related?: string[];
  lastUpdated?: string;
  sources?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
};

export default async function LearnConceptPage({ params }: Props) {
  const { slug } = await params;
  const source = getConceptSource(slug);
  if (!source) notFound();

  const allConcepts = getAllConcepts();
  const conceptMeta = allConcepts.find((c) => c.slug === slug);

  const { content, frontmatter } = await compileMDX<ConceptFrontmatter>({
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

  // Resolve exemplar tool slugs (from frontmatter) → { slug, name } pairs
  // for the mini-map. Uses the service client we already have.
  const exemplarToolSlugs = (conceptMeta?.exemplar_tools ?? []).slice(0, 4);
  const exemplarTools: { slug: string; name: string }[] =
    exemplarToolSlugs.length > 0
      ? await (async () => {
          const { data } = await supabase
            .from("tools")
            .select("slug, name")
            .in("slug", exemplarToolSlugs);
          const byKey = new Map((data ?? []).map((t: { slug: string; name: string }) => [t.slug, t.name]));
          return exemplarToolSlugs
            .filter((s) => byKey.has(s))
            .map((s) => ({ slug: s, name: byKey.get(s)! }));
        })()
      : [];

  // Resolve key fields from frontmatter slugs to { slug, field } pairs.
  const keyFields =
    (conceptMeta?.key_fields ?? [])
      .map((s) => fields.find((f) => f.slug === s))
      .filter((f): f is (typeof fields)[number] => Boolean(f))
      .slice(0, 4)
      .map((f) => ({ slug: f.slug, field: f.field }));

  // Build the related-concepts list from front-matter slugs
  const relatedConcepts =
    (frontmatter.related ?? [])
      .map((s) => allConcepts.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => ({ slug: c.slug, title: c.title }));

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
  const authorName = (frontmatter as { author?: string }).author ?? DEFAULT_AUTHOR.name;
  const authorUrl = `${SITE_URL}${DEFAULT_AUTHOR.url}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.tagline,
    image: `${SITE_URL}/learn/${slug}/opengraph-image`,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AIght",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    datePublished: conceptMeta?.publishedDate ?? new Date().toISOString(),
    dateModified: conceptMeta?.lastUpdated ?? conceptMeta?.publishedDate ?? new Date().toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/learn/${slug}` },
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgressBar />

      {/* Full-width 3D constellation header */}
      <ConceptHeader3DClient slug={slug} />

      <EditorialLayout
        left={<StickyTOC />}
        right={
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ArticleMeta
              readTime={frontmatter.readTime}
              lastUpdated={frontmatter.lastUpdated}
              sources={frontmatter.sources}
              difficulty={frontmatter.difficulty}
            />
            {relatedConcepts.length > 0 && <RelatedConcepts items={relatedConcepts} />}
          </div>
        }
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
            marginBottom: 32,
          }}
          className="hover:text-primary"
        >
          ← All concepts
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: 40 }}>
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
              fontSize: 18,
              color: "rgba(245,239,224,0.65)",
              lineHeight: 1.7,
              marginBottom: 20,
              maxWidth: "54ch",
            }}
          >
            {frontmatter.tagline}
          </p>
          {/* Byline */}
          <Byline variant="inline" lastUpdated={conceptMeta?.lastUpdated} />
        </header>

        {/* Per-concept mini-map — Phase J. Renders only when concept frontmatter
            declares at least one of: prerequisites, exemplar_tools, key_fields,
            misconceptions. Falls back to nothing on bare concepts. */}
        {conceptMeta && (
          (conceptMeta.prerequisites?.length ?? 0) > 0 ||
          (conceptMeta.exemplar_tools?.length ?? 0) > 0 ||
          (conceptMeta.key_fields?.length ?? 0) > 0 ||
          (conceptMeta.misconceptions?.length ?? 0) > 0
        ) ? (
          <ConceptMiniMap
            concept={conceptMeta}
            allConcepts={allConcepts}
            exemplarTools={exemplarTools}
            keyFields={keyFields}
          />
        ) : null}

        {/* Misconception pills — Phase J. Quick scan of what people get wrong. */}
        {conceptMeta?.misconceptions && conceptMeta.misconceptions.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(224,112,112,0.65)",
              alignSelf: "center", marginRight: 4,
            }}>
              You might think:
            </span>
            {conceptMeta.misconceptions.map((m, i) => (
              <span key={i} style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13,
                lineHeight: 1.4, padding: "5px 12px", borderRadius: 999,
                background: "rgba(224,112,112,0.06)",
                border: "1px solid rgba(224,112,112,0.25)",
                color: "rgba(245,239,224,0.78)",
              }}>
                {m}
              </span>
            ))}
          </div>
        )}

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(245,239,224,0.07)",
            marginBottom: 48,
          }}
        />

        {/* MDX body — scroll-reveal wrapper gives lyrics-style focus */}
        <article className="learn-article">
          <ArticleReveal>{content}</ArticleReveal>
        </article>

        {/* Footnotes + References */}
        <Footnotes />

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
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
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

        {/* Block byline — author credit before footer nav */}
        <Byline variant="block" lastUpdated={conceptMeta?.lastUpdated} />

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
      </EditorialLayout>
    </main>
  );
}
