import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllConcepts, getConceptSource } from "@/lib/learn";
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
  h2: (props: JSX.IntrinsicElements["h2"]) => (
    <h2
      className="font-sans text-3xl font-semibold text-primary mt-14 mb-5 leading-tight"
      style={{ letterSpacing: "-0.02em" }}
      {...props}
    />
  ),
  h3: (props: JSX.IntrinsicElements["h3"]) => (
    <h3
      className="font-sans text-2xl font-semibold text-primary mt-10 mb-4 leading-tight"
      style={{ letterSpacing: "-0.02em" }}
      {...props}
    />
  ),
  p: (props: JSX.IntrinsicElements["p"]) => (
    <p
      className="font-serif text-base text-primary leading-[1.85] tracking-[0.01em] mb-6 max-w-[68ch]"
      {...props}
    />
  ),
  blockquote: (props: JSX.IntrinsicElements["blockquote"]) => (
    <blockquote
      className="font-serif italic text-2xl text-warm border-l-[3px] border-warm pl-6 my-10 max-w-[58ch] leading-relaxed"
      {...props}
    />
  ),
  hr: () => (
    <hr className="border-none border-t border-subtle my-16" />
  ),
  pre: (props: JSX.IntrinsicElements["pre"]) => (
    <pre
      className="font-mono text-sm bg-raised rounded-md p-6 overflow-x-auto my-8 leading-relaxed"
      {...props}
    />
  ),
  code: (props: JSX.IntrinsicElements["code"]) => (
    <code
      className="font-mono text-sm bg-raised px-1.5 py-0.5 rounded"
      {...props}
    />
  ),
  strong: (props: JSX.IntrinsicElements["strong"]) => (
    <strong className="font-medium text-primary not-italic" {...props} />
  ),
  a: (props: JSX.IntrinsicElements["a"]) => (
    <a
      className="text-accent hover:text-accent-dim underline underline-offset-2 transition-colors duration-150"
      {...props}
    />
  ),
  ul: (props: JSX.IntrinsicElements["ul"]) => (
    <ul
      className="font-serif text-base text-primary leading-[1.85] list-disc list-outside ml-5 space-y-2 mb-6 max-w-[68ch]"
      {...props}
    />
  ),
  ol: (props: JSX.IntrinsicElements["ol"]) => (
    <ol
      className="font-serif text-base text-primary leading-[1.85] list-decimal list-outside ml-5 space-y-2 mb-6 max-w-[68ch]"
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
    <main className="min-h-screen bg-page">
      <div className="max-w-editorial mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Back */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 font-sans text-sm text-secondary hover:text-primary transition-colors duration-150 mb-12"
        >
          ← All concepts
        </Link>

        {/* Article header */}
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
            Concept
          </p>
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            {frontmatter.title}
          </h1>
          <p className="font-serif italic text-lg text-secondary leading-relaxed mb-6 max-w-prose">
            {frontmatter.tagline}
          </p>
          <p className="font-mono text-sm text-muted">{frontmatter.readTime}</p>
        </header>

        <hr className="border-none border-t border-subtle mb-12" />

        {/* MDX body */}
        <article>{content}</article>

        {/* Footer nav */}
        <div className="mt-20 pt-8 border-t border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/learn"
            className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
          >
            ← Back to all concepts
          </Link>
          <Link
            href="/tools"
            className="font-sans text-sm text-accent hover:text-accent-dim transition-colors duration-150"
          >
            Browse tools →
          </Link>
        </div>

      </div>
    </main>
  );
}
