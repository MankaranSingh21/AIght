import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support AIght",
  description:
    "AIght is an independent project — no VC funding, no corporate backing. If it's been useful to you, here's how to help keep it running.",
};

export default function SupportPage() {
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
          Support
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            margin: "0 0 var(--space-6)",
          }}
        >
          Keep the archive independent
        </h1>

        <p
          style={{
            fontFamily: "var(--font-editorial)",
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            marginBottom: "var(--space-10)",
            maxWidth: "54ch",
          }}
        >
          AIght is a solo project. No team, no funding round, no ad network.
          Just honest curation of AI tools and concepts — written slowly, on purpose.
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border-subtle)",
            marginBottom: "var(--space-10)",
          }}
        />

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
            maxWidth: "62ch",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            The tools directory, concept articles, field guides, and quiz are all
            free and will stay that way. There are no sponsored rankings, no
            affiliate links, no data sold. The site costs money to run and time
            to maintain.
          </p>

          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            If AIght has helped you understand something about AI — a concept
            that clicked, a tool that turned out to be exactly right, a quiz
            result that reframed your thinking — consider throwing a few dollars
            toward keeping it going.
          </p>

          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            Every contribution directly funds new content, more tools in the
            archive, and the hosting that keeps the site fast.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "var(--space-10)",
            display: "flex",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a
            href="https://ko-fi.com/aightai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Support on Ko-fi →
          </a>
          <Link href="/about" className="btn-ghost">
            About the project
          </Link>
        </div>

        {/* Alternative ways */}
        <div
          style={{
            marginTop: "var(--space-16)",
            paddingTop: "var(--space-8)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-6)",
            }}
          >
            Other ways to help
          </p>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxWidth: "56ch",
            }}
          >
            {[
              {
                action: "Share a concept article",
                detail:
                  "If something in the Learn section helped you, send it to someone who'd find it useful.",
              },
              {
                action: "Suggest a tool",
                detail:
                  "Know an AI tool that belongs in the archive? Tools are curated, not scraped — recommendations from real users matter.",
              },
              {
                action: "Subscribe to the newsletter",
                detail:
                  "The signal list is how AIght reaches people without relying on an algorithm.",
              },
            ].map(({ action, detail }) => (
              <li key={action}>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    margin: "0 0 4px",
                  }}
                >
                  {action}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </main>
  );
}
