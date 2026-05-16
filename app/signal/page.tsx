import type { Metadata } from "next";
import Link from "next/link";
import { getSignalPosts, EDITOR_POSTS } from "@/lib/signal";
import { buildCollectionLd } from "@/utils/jsonld";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Signal",
  description: "Editorial on AI tools, models, and what they actually mean.",
};

export default async function SignalPage() {
  const posts = await getSignalPosts();

  const jsonLd = buildCollectionLd({
    path: "/signal",
    name: "Signal — Editorial on AI tools",
    description: "Honest writing about AI tools and what they mean. No hype, no sponsored takes.",
    items: [
      ...EDITOR_POSTS.map((p) => ({ name: p.title, url: p.href })),
      ...posts.map((p) => ({ name: p.title, url: p.href })),
    ],
    itemType: "BlogPosting",
  });

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 'var(--max-width-editorial)', margin: '0 auto', padding: '64px 48px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56, paddingBottom: 32, borderBottom: '1px solid rgba(245,239,224,0.07)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 12 }}>
            Signal
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 16px' }}>
            From the archive
          </h1>
          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, lineHeight: 1.8, color: 'rgba(245,239,224,0.55)', maxWidth: '52ch' }}>
            Honest writing about AI tools and what they mean. No hype, no
            sponsored takes. Just signal.
          </p>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="/#stay-in-signal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(170,255,77,0.32)',
                background: 'rgba(170,255,77,0.06)',
                textDecoration: 'none',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM2 5l6 3.5L14 5v7H2V5z" />
              </svg>
              Subscribe by email
            </a>
            <span style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 13, color: 'rgba(245,239,224,0.40)' }}>
              For people who&apos;d rather subscribe than scroll.
            </span>
          </div>
        </div>

        {/* From the editor — always-visible editorial posts */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 0 }}>
            From the editor
          </p>
          {EDITOR_POSTS.map((post, i) => (
            <Link
              key={i}
              href={post.href}
              style={{ display: 'block', padding: '28px 0', borderBottom: '1px solid rgba(245,239,224,0.07)', textDecoration: 'none' }}
              className="group"
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)', marginBottom: 8 }}>{post.date}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10, transition: 'color 150ms ease' }}
                className="group-hover:text-accent">
                {post.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'rgba(245,239,224,0.50)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        {/* RSS feed posts */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 0 }}>
            From Medium
          </p>
          {posts.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(245,239,224,0.35)', padding: '48px 0' }}>
              Nothing published yet. Check back soon.
            </p>
          ) : (
            <div>
              {posts.map((post, i) => (
                <a
                  key={i}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', padding: '28px 0', borderBottom: '1px solid rgba(245,239,224,0.07)', textDecoration: 'none' }}
                  className="group"
                >
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)', marginBottom: 8 }}>{post.date}</p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10, transition: 'color 150ms ease' }}
                    className="group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'rgba(245,239,224,0.50)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(245,239,224,0.07)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link
            href="/"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', transition: 'color 150ms ease' }}
            className="hover:text-primary"
          >
            ← Back to AIght
          </Link>
          <Link
            href="/learn"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#AAFF4D', textDecoration: 'none', transition: 'color 150ms ease' }}
          >
            Explore concepts →
          </Link>
        </div>

      </div>
    </main>
    </>
  );
}
