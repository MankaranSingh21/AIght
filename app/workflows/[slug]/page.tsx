import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllWorkflows, getWorkflowSource } from "@/lib/workflows";
import ToolMention from "@/components/learn/ToolMention";
import ReadingProgressBar from "@/components/learn/ReadingProgressBar";
import Pullquote from "@/components/learn/Pullquote";
import CodeBlock from "@/components/learn/CodeBlock";
import Footer from "@/components/Footer";
import type { JSX } from "react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllWorkflows().map((wf) => ({ slug: wf.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getWorkflowSource(slug);
  if (!source) return { title: "Not Found" };

  const { frontmatter } = await compileMDX<{ title: string; tagline: string }>({
    source,
    options: { parseFrontmatter: true },
  });

  return {
    title: `${frontmatter.title} — AIght`,
    description: frontmatter.tagline,
  };
}

const mdxComponents = {
  ToolMention,
  Pullquote,
  pre: (props: JSX.IntrinsicElements["pre"]) => <CodeBlock {...props} />,
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 700,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
      marginTop: 52,
      marginBottom: 18,
    }} {...props} />
  ),
  h3: (props: JSX.IntrinsicElements["h3"]) => (
    <h3 style={{
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 700,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
      marginTop: 36,
      marginBottom: 12,
    }} {...props} />
  ),
  p: (props: JSX.IntrinsicElements["p"]) => (
    <p style={{
      fontFamily: "var(--font-editorial)",
      fontSize: 16,
      color: "rgba(245,239,224,0.75)",
      lineHeight: 1.85,
      letterSpacing: "0.01em",
      marginBottom: 22,
      maxWidth: "68ch",
    }} {...props} />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote style={{
      fontFamily: "var(--font-editorial)",
      fontStyle: "italic",
      fontSize: 20,
      color: "var(--accent-warm)",
      borderLeft: "3px solid var(--accent-warm)",
      paddingLeft: 24,
      margin: "36px 0",
      maxWidth: "56ch",
      lineHeight: 1.6,
    }} {...props} />
  ),
  hr: () => (
    <hr style={{
      border: "none",
      borderTop: "1px solid rgba(245,239,224,0.07)",
      margin: "56px 0",
    }} />
  ),
  code: (props: JSX.IntrinsicElements["code"]) => (
    <code style={{
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      background: "var(--bg-elevated)",
      padding: "2px 6px",
      borderRadius: 4,
      color: "var(--accent-primary)",
    }} {...props} />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong style={{ fontWeight: 600, color: "var(--text-primary)" }} {...props} />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a style={{
      color: "var(--accent-primary)",
      textDecoration: "underline",
      textUnderlineOffset: 2,
    }} {...props} />
  ),
  ul: (props: JSX.IntrinsicElements["ul"]) => (
    <ul style={{
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
    }} {...props} />
  ),
  ol: (props: JSX.IntrinsicElements["ol"]) => (
    <ol style={{
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
    }} {...props} />
  ),
};

export default async function WorkflowPage({ params }: Props) {
  const { slug } = await params;
  const source = getWorkflowSource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileMDX<{
    title: string;
    tagline: string;
    readTime: string;
    outcome: string;
    tool_slugs: string[];
  }>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": frontmatter.title,
    "description": frontmatter.tagline,
    "author": {
      "@type": "Organization",
      "name": "AIght",
    },
    "publisher": {
      "@type": "Organization",
      "name": "AIght",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.ico`,
      },
    },
    "datePublished": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/workflows/${slug}`,
    },
  };

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReadingProgressBar />

        {/* Narrow editorial header band */}
        <div style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "48px 48px 40px",
        }}>
          <div style={{ maxWidth: "var(--max-width-editorial)", margin: "0 auto" }}>
            <Link
              href="/workflows"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: "rgba(245,239,224,0.40)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
                marginBottom: 32,
              }}
            >
              ← All workflows
            </Link>

            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 14,
            }}>
              {frontmatter.outcome}
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4.5vw, 48px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 16px",
            }}>
              {frontmatter.title}
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 16,
              color: "rgba(245,239,224,0.55)",
              lineHeight: 1.8,
              maxWidth: "54ch",
              margin: "0 0 20px",
            }}>
              {frontmatter.tagline}
            </p>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(245,239,224,0.30)",
            }}>
              {frontmatter.readTime}
            </p>
          </div>
        </div>

        {/* Article body */}
        <div style={{
          maxWidth: "var(--max-width-editorial)",
          margin: "0 auto",
          padding: "48px 48px 96px",
        }}>
          <article className="learn-article">{content}</article>

          {/* Footer nav */}
          <div style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: "1px solid rgba(245,239,224,0.07)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <Link
              href="/workflows"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: "rgba(245,239,224,0.45)", textDecoration: "none",
              }}
            >
              ← All workflows
            </Link>
            <Link
              href="/tools"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: "var(--accent-primary)", textDecoration: "none",
              }}
            >
              Browse all tools →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
