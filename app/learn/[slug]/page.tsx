import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllConcepts, getConceptSource } from "@/lib/learn";
import RagSimulation from "@/components/learn/RagSimulation";
import McpSimulation from "@/components/learn/McpSimulation";
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
  if (!source) return { title: "Not Found — AIght" };

  const { frontmatter } = await compileMDX<{
    title: string;
    tagline: string;
  }>({ source, options: { parseFrontmatter: true } });

  return {
    title: `${frontmatter.title} — AIght`,
    description: frontmatter.tagline,
  };
}

const mdxComponents = {
  RagSimulation,
  McpSimulation,
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        fontWeight: 700,
        color: '#F5EFE0',
        letterSpacing: '-0.02em',
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
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 700,
        color: '#F5EFE0',
        letterSpacing: '-0.02em',
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
        fontFamily: 'var(--font-editorial)',
        fontSize: 16,
        color: 'rgba(245,239,224,0.75)',
        lineHeight: 1.85,
        letterSpacing: '0.01em',
        marginBottom: 22,
        maxWidth: '68ch',
      }}
      {...props}
    />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote
      style={{
        fontFamily: 'var(--font-editorial)',
        fontStyle: 'italic',
        fontSize: 22,
        color: 'var(--accent-warm)',
        borderLeft: '3px solid var(--accent-warm)',
        paddingLeft: 24,
        margin: '40px 0',
        maxWidth: '58ch',
        lineHeight: 1.6,
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(245,239,224,0.07)', margin: '64px 0' }} />
  ),
  pre: (props: JSX.IntrinsicElements["pre"]) => (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        background: 'var(--bg-elevated)',
        borderRadius: 8,
        padding: 24,
        overflowX: 'auto',
        margin: '28px 0',
        lineHeight: 1.7,
        border: '1px solid rgba(245,239,224,0.07)',
      }}
      {...props}
    />
  ),
  code: (props: JSX.IntrinsicElements["code"]) => (
    <code
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        background: 'var(--bg-elevated)',
        padding: '2px 6px',
        borderRadius: 4,
        color: '#AAFF4D',
      }}
      {...props}
    />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong style={{ fontWeight: 600, color: '#F5EFE0', fontStyle: 'normal' }} {...props} />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a
      style={{ color: '#AAFF4D', textDecoration: 'underline', textUnderlineOffset: 2, transition: 'color 150ms ease' }}
      {...props}
    />
  ),
  ul: (props: JSX.IntrinsicElements["ul"]) => (
    <ul
      style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 16,
        color: 'rgba(245,239,224,0.75)',
        lineHeight: 1.85,
        listStyleType: 'disc',
        listStylePosition: 'outside',
        marginLeft: 20,
        marginBottom: 22,
        maxWidth: '68ch',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      {...props}
    />
  ),
  ol: (props: JSX.IntrinsicElements["ol"]) => (
    <ol
      style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 16,
        color: 'rgba(245,239,224,0.75)',
        lineHeight: 1.85,
        listStyleType: 'decimal',
        listStylePosition: 'outside',
        marginLeft: 20,
        marginBottom: 22,
        maxWidth: '68ch',
        display: 'flex',
        flexDirection: 'column',
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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 'var(--max-width-editorial)', margin: '0 auto', padding: '64px 48px 96px' }}>

        {/* Back */}
        <Link
          href="/learn"
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 48 }}
          className="hover:text-primary"
        >
          ← All concepts
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 14 }}>
            Concept
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 18px' }}>
            {frontmatter.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 17, color: 'rgba(245,239,224,0.55)', lineHeight: 1.8, marginBottom: 20, maxWidth: '54ch' }}>
            {frontmatter.tagline}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)' }}>{frontmatter.readTime}</p>
        </header>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(245,239,224,0.07)', marginBottom: 48 }} />

        {/* MDX body */}
        <article>{content}</article>

        {/* Footer nav */}
        <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(245,239,224,0.07)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link
            href="/learn"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', transition: 'color 150ms ease' }}
            className="hover:text-primary"
          >
            ← Back to all concepts
          </Link>
          <Link
            href="/tools"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#AAFF4D', textDecoration: 'none' }}
          >
            Browse tools →
          </Link>
        </div>

      </div>
    </main>
  );
}
