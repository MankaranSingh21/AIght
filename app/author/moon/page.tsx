import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getSignalPosts } from "@/lib/signal";

export const metadata: Metadata = {
  title: "By Moon",
  description:
    "Moon is a poet, Kathak dancer, and CS student building AIght — an honest archive of AI tools for people who want to understand what they're actually using.",
};

const RECENT_CONCEPTS = [
  { slug: "tokenization", title: "Tokenization" },
  { slug: "temperature-and-sampling", title: "Temperature & Sampling" },
  { slug: "chain-of-thought", title: "Chain of Thought" },
];

export default async function MoonAuthorPage() {
  const essays = await getSignalPosts(3);

  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
        }}
      >
        <article
          style={{
            maxWidth: "var(--max-width-editorial)",
            margin: "0 auto",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              marginBottom: "var(--space-4)",
            }}
          >
            Author
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "var(--space-10)",
            }}
          >
            Written from the archive, by Moon
          </h1>

          <div
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-base)",
              lineHeight: 1.85,
              color: "var(--text-primary)",
              maxWidth: "68ch",
            }}
          >
            <p style={{ marginBottom: "var(--space-6)" }}>
              AIght started from the same place most honest things start: an
              argument I was tired of losing. Everyone asking about AI kept
              getting the same recycled answers — sponsored rankings, thin
              reviews written to fill a page, tools that sounded useful until
              you actually opened them. So I built the thing I kept wishing
              existed: slow, careful curation by someone who actually uses the
              tools and is willing to have an opinion about them in writing.
            </p>

            <p style={{ marginBottom: "var(--space-6)" }}>
              The longer ambition is harder to name cleanly. I want AIght to
              earn trust the same way a magazine earns it — by being right more
              often than it&rsquo;s wrong, by admitting when it&rsquo;s
              uncertain, by being honest about what it doesn&rsquo;t cover. The
              Learn section is part of that: if you leave a concept page having
              actually understood something, I&rsquo;ve done the job. The Signal
              feed is where I write when something in this space seems worth
              pausing over. Oxford, eventually, is where I want to take all of
              this thinking further.
            </p>

            <p style={{ marginBottom: "var(--space-6)" }}>
              Outside the archive: I&rsquo;ve published two poetry collections.
              I dance Kathak — classical North Indian dance, the kind that
              takes about fifteen years before you stop counting beats
              consciously. I debated MUN for years, which is where I learned
              that precision of language is not the same as clarity, and that
              most arguments fail in the framing, not the logic. Now I&rsquo;m
              a third-year CS student at Chandigarh University, which mostly
              means I spend a lot of time thinking about what engineering
              misses when it moves too fast.
            </p>

            <blockquote
              style={{
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                fontSize: "var(--text-2xl)",
                color: "var(--accent-warm)",
                borderLeft: "3px solid var(--accent-warm)",
                paddingLeft: "var(--space-6)",
                margin: "var(--space-10) 0",
                maxWidth: "58ch",
                lineHeight: 1.6,
              }}
            >
              <em>
                To watch a language model think is to remember that thinking
                was always a kind of attention paid to almost nothing.
              </em>
            </blockquote>
          </div>

          {/* Links row */}
          <div
            style={{
              marginTop: "var(--space-10)",
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-3)",
            }}
          >
            <a
              href="https://medium.com/@singhmankaran05"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              Medium
            </a>
            <a
              href="https://x.com/aightai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              X / Twitter
            </a>
            <a
              href="https://github.com/MankaranSingh21"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              GitHub
            </a>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border-subtle)",
              margin: "var(--space-12) 0",
            }}
          />

          {/* Recent essays section */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,239,224,0.30)",
                marginBottom: "var(--space-6)",
              }}
            >
              Recent essays
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {essays.map((post) => (
                <a
                  key={post.href}
                  href={post.href}
                  target={post.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    post.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    display: "block",
                    padding: "var(--space-5) 0",
                    borderBottom: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {post.date}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: "var(--text-xl)",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      display: "block",
                      marginBottom: "var(--space-2)",
                      transition: "color 150ms ease",
                    }}
                  >
                    {post.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontSize: "var(--text-base)",
                      color: "var(--text-secondary)",
                      display: "block",
                      lineHeight: 1.7,
                    }}
                  >
                    {post.excerpt}
                  </span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: "var(--space-6)" }}>
              <a
                href="https://medium.com/@singhmankaran05"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                  color: "var(--accent-secondary)",
                  textDecoration: "none",
                }}
              >
                All essays on Medium →
              </a>
            </div>
          </section>

          {/* Recent concept additions */}
          <section>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(245,239,224,0.30)",
                marginBottom: "var(--space-6)",
              }}
            >
              From the Learn archive
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {RECENT_CONCEPTS.map(({ slug, title }) => (
                <Link
                  key={slug}
                  href={`/learn/${slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-4) 0",
                    borderBottom: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    transition: "color 150ms ease",
                  }}
                >
                  {title}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: "var(--space-6)" }}>
              <Link
                href="/learn"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                  color: "var(--accent-secondary)",
                  textDecoration: "none",
                }}
              >
                All concepts →
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
