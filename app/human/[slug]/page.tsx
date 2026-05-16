import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllHumanEssays, getHumanEssaySource } from "@/lib/human";
import { DEFAULT_AUTHOR } from "@/lib/learn";
import Pullquote from "@/components/learn/Pullquote";
import CodeBlock from "@/components/learn/CodeBlock";
import Footer from "@/components/Footer";
import type { JSX } from "react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllHumanEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const source = getHumanEssaySource(slug);
  if (!source) return { title: "Not Found" };

  const { frontmatter } = await compileMDX<{ title: string; tagline: string }>({
    source,
    options: { parseFrontmatter: true },
  });

  return {
    title: frontmatter.title,
    description: frontmatter.tagline,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.tagline,
    },
  };
}

const mdxComponents = {
  Pullquote,
  pre: (props: JSX.IntrinsicElements["pre"]) => <CodeBlock {...props} />,
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: 26,
      fontWeight: 700,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em",
      lineHeight: 1.25,
      marginTop: 56,
      marginBottom: 18,
    }} {...props} />
  ),
  h3: (props: JSX.IntrinsicElements["h3"]) => (
    <h3 style={{
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 700,
      color: "var(--text-primary)",
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
      marginTop: 40,
      marginBottom: 12,
    }} {...props} />
  ),
  p: (props: JSX.IntrinsicElements["p"]) => (
    <p style={{
      fontFamily: "var(--font-editorial)",
      fontSize: 17,
      color: "rgba(245,239,224,0.82)",
      lineHeight: 1.85,
      letterSpacing: "0.01em",
      marginBottom: 24,
      maxWidth: "62ch",
    }} {...props} />
  ),
  em: (props: JSX.IntrinsicElements["em"]) => (
    <em style={{ fontStyle: "italic", color: "var(--accent-warm)" }} {...props} />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong style={{ fontWeight: 600, color: "var(--text-primary)" }} {...props} />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote style={{
      fontFamily: "var(--font-editorial)",
      fontStyle: "italic",
      fontSize: 22,
      color: "var(--accent-warm)",
      borderLeft: "3px solid var(--accent-warm)",
      paddingLeft: 28,
      margin: "40px 0",
      maxWidth: "54ch",
      lineHeight: 1.55,
    }} {...props} />
  ),
  hr: () => (
    <hr style={{
      border: "none",
      borderTop: "1px solid rgba(245,239,224,0.07)",
      margin: "56px 0",
    }} />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a style={{
      color: "var(--accent-warm)",
      textDecoration: "underline",
      textUnderlineOffset: 3,
    }} {...props} />
  ),
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export default async function HumanEssayPage({ params }: Props) {
  const { slug } = await params;
  const source = getHumanEssaySource(slug);
  if (!source) notFound();

  const { content, frontmatter } = await compileMDX<{
    title: string;
    tagline: string;
    readTime: string;
    slug: string;
    publishedDate?: string;
    lastUpdated?: string;
    related?: string[];
    author?: string;
  }>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  const allEssays = getAllHumanEssays();
  const essayMeta = allEssays.find((e) => e.slug === slug);

  const relatedEssays =
    (frontmatter.related ?? [])
      .map((s) => allEssays.find((e) => e.slug === s))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const authorName = frontmatter.author ?? DEFAULT_AUTHOR.name;
  const authorUrl = `${SITE_URL}${DEFAULT_AUTHOR.url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.tagline,
    image: `${SITE_URL}/human/${slug}/opengraph-image`,
    author: { "@type": "Person", name: authorName, url: authorUrl },
    publisher: {
      "@type": "Organization",
      name: "AIght",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    datePublished: essayMeta?.publishedDate ?? new Date().toISOString(),
    dateModified: essayMeta?.lastUpdated ?? essayMeta?.publishedDate ?? new Date().toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/human/${slug}` },
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "AIght" },
  };

  const updatedLabel = essayMeta?.lastUpdated
    ? new Date(essayMeta.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <article
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "var(--space-20) var(--space-8)",
          }}
        >
          {/* Back link */}
          <Link
            href="/human"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-muted)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 32,
            }}
            className="hover:text-primary"
          >
            ← What AI Cannot Do
          </Link>

          {/* Article header */}
          <header style={{ marginBottom: 40 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-warm)",
                marginBottom: 14,
              }}
            >
              Essay · What AI Cannot Do
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 900,
                color: "var(--text-primary)",
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
                fontSize: 19,
                color: "rgba(245,239,224,0.65)",
                lineHeight: 1.7,
                marginBottom: 20,
                maxWidth: "54ch",
              }}
            >
              {frontmatter.tagline}
            </p>
            {/* Byline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "rgba(245,239,224,0.45)",
              }}
            >
              <Link
                href="/about"
                style={{
                  color: "rgba(245,239,224,0.80)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(244,171,31,0.40)",
                  paddingBottom: 1,
                }}
              >
                {authorName}
              </Link>
              {updatedLabel && (
                <>
                  <span aria-hidden style={{ opacity: 0.35 }}>·</span>
                  <time dateTime={essayMeta?.lastUpdated}>Updated {updatedLabel}</time>
                </>
              )}
              <span aria-hidden style={{ opacity: 0.35 }}>·</span>
              <span>{frontmatter.readTime}</span>
            </div>
          </header>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(245,239,224,0.07)",
              marginBottom: 40,
            }}
          />

          {/* MDX body */}
          <div className="human-article">{content}</div>

          {/* Related essays */}
          {relatedEssays.length > 0 && (
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
                  marginBottom: 16,
                }}
              >
                Read next
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                {relatedEssays.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/human/${e.slug}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        padding: "16px 20px",
                        borderRadius: 12,
                        background: "rgba(244,171,31,0.04)",
                        border: "1px solid rgba(244,171,31,0.15)",
                        textDecoration: "none",
                      }}
                      className="hover:bg-warm/10 transition-colors"
                    >
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        {e.title}
                      </span>
                      <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        {e.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Footer nav */}
          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid rgba(245,239,224,0.07)",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "space-between",
            }}
          >
            <Link href="/human" style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }} className="hover:text-primary">
              ← All essays
            </Link>
            <Link href="/learn/paths/quiz" style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--accent-warm)", textDecoration: "none" }}>
              See what&rsquo;s yours →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
