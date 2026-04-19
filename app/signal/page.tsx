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
    <main className="min-h-screen bg-page">
      <div className="max-w-editorial mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Header */}
        <div className="mb-16 pb-8 border-b border-subtle">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Signal
          </p>
          <h1
            className="font-sans text-4xl md:text-5xl font-semibold text-primary leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            From the archive
          </h1>
          <p className="font-sans text-base text-secondary max-w-prose leading-relaxed">
            Honest writing about AI tools and what they mean. No hype, no
            sponsored takes. Just signal.
          </p>
        </div>

        {/* Post list */}
        {posts.length === 0 ? (
          <p className="font-sans text-sm text-muted py-12">
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
                className="group block py-8 border-b border-subtle last:border-b-0"
              >
                <p className="font-mono text-sm text-muted mb-2">{post.date}</p>
                <h2 className="font-sans text-xl font-medium text-primary group-hover:text-accent transition-colors duration-150 mb-3">
                  {post.title}
                </h2>
                <p className="font-serif text-base text-secondary leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </a>
            ))}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="font-sans text-sm text-secondary hover:text-primary transition-colors duration-150"
          >
            ← Back to AIght
          </Link>
          <Link
            href="/learn"
            className="font-sans text-sm text-accent hover:text-accent-dim transition-colors duration-150"
          >
            Explore concepts →
          </Link>
        </div>

      </div>
    </main>
  );
}
