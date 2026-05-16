import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Changelog — what changed, slowly",
  description:
    "A public log of what gets added, revised, or quietly removed on AIght. Slow updates, on purpose.",
  openGraph: {
    title: "Changelog — what changed, slowly",
    description:
      "What got added, revised, or quietly removed. The proof that the archive grows on purpose.",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

type ChangeKind = "added" | "changed" | "fixed" | "removed";

type Entry = {
  kind: ChangeKind;
  title: string;
  body: string;
};

type Month = {
  label: string;
  date: string;
  entries: Entry[];
};

const MONTHS: Month[] = [
  {
    label: "May 2026",
    date: "2026-05",
    entries: [
      {
        kind: "added",
        title: "The score, published.",
        body: "Every tool now links to a public rubric explaining how the AIght Score is built — five axes, hand-assigned, slowly. The number was always editorial; now the method is too.",
      },
      {
        kind: "added",
        title: "Signal has an RSS feed.",
        body: "For people who'd rather subscribe than scroll. Auto-discovery wired in, internal posts use absolute URLs, the Medium feed rides along.",
      },
      {
        kind: "added",
        title: "Editorial gutter on Learn.",
        body: "A table-of-contents rail, marginalia, glossary callouts, and citation footnotes — the small print of long reading.",
      },
      {
        kind: "added",
        title: "Per-route OG images for index pages.",
        body: "Sharing /tools, /learn, /signal, /use-cases, /workflows, or /learn/paths now produces a distinct preview, not a generic site card.",
      },
      {
        kind: "added",
        title: "Per-page ItemList schema.",
        body: "Six index pages now expose ItemList + CollectionPage JSON-LD so AI search engines and traditional crawlers can read the archive as a list, not a soup.",
      },
      {
        kind: "fixed",
        title: "Hero widgets show real data.",
        body: "The trending list, risk distribution, top-scored tool, and field cycler in the hero used to be hardcoded demo data. They now pull from the live archive. Honesty starts above the fold.",
      },
      {
        kind: "fixed",
        title: "Tools-making-waves no longer fails silently.",
        body: "If the archive query stumbles, the section now greets you with a warm fallback instead of a blank section header.",
      },
      {
        kind: "fixed",
        title: "OG image generator, repaired.",
        body: "An upstream change in how Google Fonts serves binaries had quietly broken every dynamic Open Graph image on the site. Fixed by switching the loader to the legacy endpoint that still serves TTF.",
      },
      {
        kind: "changed",
        title: "Motion overhaul.",
        body: "Reactive constellations on Learn concept headers, bento layouts on the homepage, magnetic CTAs. Movement is allowed when it earns its keep.",
      },
      {
        kind: "added",
        title: "60-tool mark.",
        body: "The archive crossed sixty tools this month. Each one with a real opinion behind it.",
      },
    ],
  },
  {
    label: "April 2026",
    date: "2026-04",
    entries: [
      {
        kind: "added",
        title: "Bookmarks.",
        body: "A local-only “your stack” page. No account, no database — your saved tools live on your device. One button copies the whole thing as a markdown list.",
      },
      {
        kind: "added",
        title: "Workflows.",
        body: "Step-by-step pipelines showing how AI tools actually combine. The first six are written from sessions where I sat with the tools long enough to mean it.",
      },
      {
        kind: "added",
        title: "Use cases by job-to-be-done.",
        body: "Browse the archive by what you're trying to do — write faster, research a market, edit an image — instead of by category.",
      },
      {
        kind: "added",
        title: "Personalized quiz recommendations.",
        body: "The AI Impact Quiz now surfaces a small set of tools tied to your field and answers, not just a single field guide.",
      },
      {
        kind: "added",
        title: "Three new concept articles.",
        body: "Embeddings, fine-tuning, and MCP joined the Learn section — each with an interactive widget you can poke.",
      },
      {
        kind: "changed",
        title: "Honest pricing on tool pages.",
        body: "Each tool now carries an editorial line on what it actually costs in a normal month, including the things vendors leave off the pricing page.",
      },
      {
        kind: "fixed",
        title: "Quiet bugs at scale.",
        body: "Mobile overflow, a Canvas that swallowed every pointer event, a hooks-rules violation that crashed the quiz on second load. The kind of thing nobody emails about and everyone notices.",
      },
    ],
  },
];

const KIND_COLOR: Record<ChangeKind, string> = {
  added: "var(--accent-primary)",
  changed: "var(--accent-secondary)",
  fixed: "var(--accent-warm)",
  removed: "var(--error)",
};

const KIND_LABEL: Record<ChangeKind, string> = {
  added: "ADDED",
  changed: "CHANGED",
  fixed: "FIXED",
  removed: "REMOVED",
};

export default function ChangelogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AIght — Changelog",
    "description":
      "Public log of additions, revisions, and removals on AIght. Slow updates, on purpose.",
    "url": `${SITE_URL}/changelog`,
    "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "AIght" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              marginBottom: "var(--space-3)",
            }}
          >
            Changelog
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
              marginBottom: "var(--space-5)",
            }}
          >
            Slowly, on purpose.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              lineHeight: 1.65,
              marginBottom: "var(--space-12)",
            }}
          >
            What got added, revised, or quietly removed. No marketing roadmaps,
            no &ldquo;we&rsquo;re excited to announce&rdquo; energy — just a
            log.
          </p>

          {/* Months */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
            {MONTHS.map((month) => (
              <section key={month.date}>
                <header
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-4)",
                    paddingBottom: "var(--space-4)",
                    borderBottom: "1px solid var(--border-subtle)",
                    marginBottom: "var(--space-8)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-3xl)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {month.label}
                  </h2>
                  <time
                    dateTime={month.date}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    {month.date}
                  </time>
                </header>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-7)",
                  }}
                >
                  {month.entries.map((entry, i) => (
                    <li key={i} style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "var(--space-3)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            fontWeight: 600,
                            color: KIND_COLOR[entry.kind],
                            display: "inline-block",
                            minWidth: 70,
                          }}
                        >
                          {KIND_LABEL[entry.kind]}
                        </span>
                        <h3
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "var(--text-lg)",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.01em",
                            margin: 0,
                          }}
                        >
                          {entry.title}
                        </h3>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-editorial)",
                          fontSize: "var(--text-base)",
                          color: "var(--text-secondary)",
                          lineHeight: 1.75,
                          margin: "0 0 0 calc(70px + var(--space-3))",
                          maxWidth: "62ch",
                        }}
                        className="changelog-body"
                      >
                        {entry.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Coda */}
          <div
            style={{
              marginTop: "var(--space-16)",
              paddingTop: "var(--space-8)",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
            }}
          >
            <Link href="/about" className="btn-ghost" style={{ textDecoration: "none" }}>
              About AIght
            </Link>
            <Link href="/signal" className="btn-ghost" style={{ textDecoration: "none" }}>
              Read Signal →
            </Link>
          </div>
        </article>

        <style>{`
          @media (max-width: 640px) {
            .changelog-body { margin-left: 0 !important; margin-top: 4px !important; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
