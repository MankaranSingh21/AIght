import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "AIght is an independent AI tool directory and learning resource. No sponsored rankings, no affiliate links — just honest curation.",
};

export default function AboutPage() {
  return (
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
          About
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
          The signal beneath the noise
        </h1>

        {/* Body */}
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
            AIght started with a simple frustration: most AI tool directories
            feel like sponsored lists dressed up as curation. The rankings
            change when someone pays. The descriptions sound like ad copy.
            There&rsquo;s no way to tell what actually works from what just has
            a good marketing budget.
          </p>

          <p style={{ marginBottom: "var(--space-6)" }}>
            This site is an attempt at the honest version. Every tool in the
            archive is here because it&rsquo;s genuinely useful — not because
            anyone paid for placement. Every concept in the Learn section is
            written to actually explain something, not to fill a page with
            keywords.
          </p>

          <p style={{ marginBottom: "var(--space-6)" }}>
            The field guides exist because the question I keep hearing
            isn&rsquo;t &ldquo;what is AI?&rdquo; — it&rsquo;s &ldquo;what
            does this mean for me, specifically, in my work?&rdquo; That
            question deserves a real answer, not a LinkedIn post.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border-subtle)",
              margin: "var(--space-10) 0",
            }}
          />

          <p style={{ marginBottom: "var(--space-6)" }}>
            I&rsquo;m{" "}
            <a
              href="mailto:singhmankaran05@gmail.com"
              style={{
                color: "var(--accent-secondary)",
                textDecoration: "none",
              }}
            >
              Mankaran Singh
            </a>
            . I built AIght because I wanted somewhere to send people when they
            asked me what AI tools they should actually use — without having to
            preface everything with &ldquo;ignore the sponsored results.&rdquo;
          </p>

          <p style={{ marginBottom: "var(--space-6)" }}>
            The archive grows slowly, on purpose. I add tools when I&rsquo;ve
            spent enough time with them to have an opinion. The Learn section
            grows when I have something worth saying about a concept. The Signal
            feed is where I write when something in the AI landscape seems
            worth pausing over.
          </p>

          <p
            style={{
              marginBottom: "var(--space-6)",
              color: "var(--text-secondary)",
              fontStyle: "italic",
            }}
          >
            No ads. No sponsored placements. No affiliate links. If that ever
            changes, you&rsquo;ll see it disclosed clearly — not hidden in a
            footnote.
          </p>
        </div>

        {/* CTA links */}
        <div
          style={{
            marginTop: "var(--space-12)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>
            Start with Learn →
          </Link>
          <Link href="/tools" className="btn-ghost" style={{ textDecoration: "none" }}>
            Browse the archive
          </Link>
        </div>
      </article>
    </main>
  );
}
