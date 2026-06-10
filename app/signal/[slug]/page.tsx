import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getNativeSignalPosts, getNativeSignalSource } from "@/lib/signal";
import Footer from "@/components/Footer";
import Byline from "@/components/Byline";
import type { JSX } from "react";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getNativeSignalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getNativeSignalSource(slug);
  if (!source) return { title: "Not found" };
  const { frontmatter } = await compileMDX<{ title: string; excerpt: string }>({
    source,
    options: { parseFrontmatter: true },
  });
  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    openGraph: { title: `${frontmatter.title} — Signal · AIght`, description: frontmatter.excerpt, type: "article" },
    twitter: { card: "summary_large_image", title: frontmatter.title, description: frontmatter.excerpt },
  };
}

// MDX styling matches `/learn/[slug]` — reading typography lives in Lora,
// headings in Fraunces, pull-quotes in amber. Components allowlist is
// intentionally small here; Signal posts are essays, not interactives.
const mdxComponents = {
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2 style={{
      fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
      color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2,
      marginTop: 48, marginBottom: 18,
    }} {...props} />
  ),
  h3: (props: JSX.IntrinsicElements["h3"]) => (
    <h3 style={{
      fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
      color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2,
      marginTop: 36, marginBottom: 14,
    }} {...props} />
  ),
  p: (props: JSX.IntrinsicElements["p"]) => (
    <p style={{
      fontFamily: "var(--font-editorial)", fontSize: 16,
      color: "rgba(245,239,224,0.78)", lineHeight: 1.85, letterSpacing: "0.01em",
      marginBottom: 20,
    }} {...props} />
  ),
  ul: (props: JSX.IntrinsicElements["ul"]) => (
    <ul style={{
      fontFamily: "var(--font-editorial)", fontSize: 16,
      color: "rgba(245,239,224,0.78)", lineHeight: 1.85,
      listStyleType: "disc", listStylePosition: "outside",
      marginLeft: 20, marginBottom: 22, display: "flex", flexDirection: "column", gap: 8,
    }} {...props} />
  ),
  ol: (props: JSX.IntrinsicElements["ol"]) => (
    <ol style={{
      fontFamily: "var(--font-editorial)", fontSize: 16,
      color: "rgba(245,239,224,0.78)", lineHeight: 1.85,
      listStyleType: "decimal", listStylePosition: "outside",
      marginLeft: 20, marginBottom: 22, display: "flex", flexDirection: "column", gap: 8,
    }} {...props} />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a style={{
      color: "var(--accent-primary)", textDecoration: "underline",
      textUnderlineOffset: 2, transition: "color 150ms ease",
    }} {...props} />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote style={{
      fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 22,
      color: "var(--accent-warm)", borderLeft: "3px solid var(--accent-warm)",
      paddingLeft: 24, margin: "40px 0", maxWidth: "58ch", lineHeight: 1.6,
    }} {...props} />
  ),
  hr: () => (
    <hr style={{
      border: "none", borderTop: "1px solid var(--border-subtle)",
      margin: "48px 0",
    }} />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong style={{ fontWeight: 600, color: "var(--text-primary)", fontStyle: "normal" }} {...props} />
  ),
  em: (props: JSX.IntrinsicElements["em"]) => (
    <em style={{ fontStyle: "italic", color: "var(--text-primary)" }} {...props} />
  ),
};

type Frontmatter = {
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export default async function SignalPostPage({ params }: Props) {
  const { slug } = await params;
  const source = getNativeSignalSource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  const dateLabel = (() => {
    try {
      return new Date(frontmatter.date).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });
    } catch {
      return frontmatter.date;
    }
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    author: { "@type": "Person", name: frontmatter.author ?? "Moon", url: `${SITE_URL}/author/moon` },
    publisher: {
      "@type": "Organization",
      name: "AIght",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/signal/${slug}` },
  };

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        {/* Inside <main> so externally injected scripts (PostHog) can't occupy
            this hydration slot — first-child <script> tags collide with them. */}
        <script
          key="signal-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div style={{
          maxWidth: "var(--max-width-editorial)",
          margin: "0 auto",
          padding: "var(--space-16) clamp(20px, 5vw, 48px) var(--space-24)",
        }}>
          <Link
            href="/signal"
            style={{
              fontFamily: "var(--font-ui)", fontSize: 13,
              color: "var(--text-muted)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
              marginBottom: 32,
            }}
            className="hover:text-primary"
          >
            ← All Signal
          </Link>

          <header style={{ marginBottom: 40 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-secondary)",
              margin: "0 0 14px",
            }}>
              Signal · {dateLabel}
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 18px",
            }}>
              {frontmatter.title}
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 18,
              color: "rgba(245,239,224,0.65)", lineHeight: 1.7,
              marginBottom: 20, maxWidth: "54ch",
            }}>
              {frontmatter.excerpt}
            </p>
            <Byline variant="inline" lastUpdated={frontmatter.date} />
          </header>

          <hr style={{
            border: "none", borderTop: "1px solid var(--border-subtle)",
            marginBottom: 40,
          }} />

          <article>{content}</article>

          <Byline variant="block" lastUpdated={frontmatter.date} />

          <div style={{
            marginTop: 64, paddingTop: 32,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <Link
              href="/signal"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: "var(--text-muted)", textDecoration: "none",
                transition: "color 150ms ease",
              }}
              className="hover:text-primary"
            >
              ← Back to Signal
            </Link>
            <Link
              href="/tools"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: "var(--accent-primary)", textDecoration: "none",
              }}
            >
              Browse tools →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
