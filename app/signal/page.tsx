import type { Metadata } from "next";
import Link from "next/link";
import { getSignalPosts } from "@/lib/signal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Signal — AIght",
  description: "Editorial on AI tools, models, and what they actually mean.",
};

export default async function SignalPage() {
  const posts = await getSignalPosts();

  return (
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
        </div>

        {/* Post list */}
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
                style={{ display: 'block', padding: '32px 0', borderBottom: '1px solid rgba(245,239,224,0.07)', textDecoration: 'none' }}
                className="group"
              >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)', marginBottom: 8 }}>{post.date}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10, transition: 'color 150ms ease' }}
                  className="group-hover:text-accent group-hover:translate-x-0.5">
                  {post.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'rgba(245,239,224,0.50)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>
              </a>
            ))}
          </div>
        )}

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
  );
}
