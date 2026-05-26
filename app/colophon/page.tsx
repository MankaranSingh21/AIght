import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Colophon",
  description:
    "A colophon records the choices made in the production of a book. This one records the choices made in the production of AIght — the fonts, the colours, the influences, the tools.",
};

export default function ColophonPage() {
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
            Colophon
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
            On the choices that made this site
          </h1>

          {/* Editorial body */}
          <div
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-base)",
              lineHeight: 1.85,
              color: "var(--text-primary)",
              maxWidth: "68ch",
            }}
          >

            {/* Typography */}
            <section style={{ marginBottom: "var(--space-12)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Typography
              </h2>
              <p style={{ marginBottom: "var(--space-4)" }}>
                <strong style={{ color: "var(--text-primary)" }}>Fraunces</strong>{" "}
                (display headings) — a variable optical-size serif with a literary
                warmth that earns the big moments: hero text, page headings, the
                places where a reader is still deciding whether to stay.
              </p>
              <p style={{ marginBottom: "var(--space-4)" }}>
                <strong style={{ color: "var(--text-primary)" }}>Plus Jakarta Sans</strong>{" "}
                (UI) — precise, workaday, never fussy; it handles every button,
                label, card title, and navigational string without calling
                attention to itself, which is exactly the right disposition for a
                UI font.
              </p>
              <p style={{ marginBottom: "var(--space-4)" }}>
                <strong style={{ color: "var(--text-primary)" }}>Lora</strong>{" "}
                (editorial body) — the reading font, chosen because it signals
                &ldquo;you are reading something now&rdquo; in the way a serif
                typeface should: with unhurried authority, never academic coldness.
              </p>
              <p style={{ marginBottom: "var(--space-4)" }}>
                <strong style={{ color: "var(--text-primary)" }}>JetBrains Mono</strong>{" "}
                (technical + the logo) — the font of the machine rendered at a
                human scale; it carries the{" "}
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                  AIght
                  <span style={{ color: "var(--accent-primary)" }}>_</span>
                </span>{" "}
                logotype, timestamps, version numbers, and code accents — the
                register where precision is the point.
              </p>
            </section>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border-subtle)",
                margin: "var(--space-10) 0",
              }}
            />

            {/* Colour */}
            <section style={{ marginBottom: "var(--space-12)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Colour
              </h2>
              <p style={{ marginBottom: "var(--space-4)" }}>
                The background is a warm near-black —{" "}
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                  #0C0A08
                </span>{" "}
                — not cold, not pure. It sits closer to the colour of an old book
                spine in a dark room than to a void. The goal was technological
                warmth: neon in darkness, not neon in daylight.
              </p>
              <p style={{ marginBottom: "var(--space-4)" }}>
                The accent is neon lime —{" "}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--accent-primary)",
                  }}
                >
                  #AAFF4D
                </span>{" "}
                — because the machine has to be visible, and visible should mean
                alive rather than alarming. Against the warm dark, it reads as
                signal: something happening, not something shouting.
              </p>
              <p style={{ marginBottom: "var(--space-4)" }}>
                Amber ({" "}
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-warm)" }}>
                  #F4AB1F
                </span>
                ) appears sparingly — pull quotes, warnings, the single callout per
                section worth pausing at. Its warmth earns a different kind of
                attention than the lime: slower, more considered.
              </p>
            </section>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border-subtle)",
                margin: "var(--space-10) 0",
              }}
            />

            {/* Influences */}
            <section style={{ marginBottom: "var(--space-12)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Influences
              </h2>
              <p style={{ marginBottom: "var(--space-4)" }}>
                These are the places where the editorial instincts for this site
                came from:
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-4)",
                }}
              >
                {[
                  {
                    name: "distill.pub",
                    href: "https://distill.pub",
                    note: "Proof that technical clarity and visual care are not in opposition.",
                  },
                  {
                    name: "Asterisk Magazine",
                    href: "https://asteriskmag.com",
                    note: "Long-form intellectual journalism that trusts its readers to stay.",
                  },
                  {
                    name: "Quanta Magazine",
                    href: "https://quantamagazine.org",
                    note: "Science writing that doesn't condescend and doesn't oversimplify.",
                  },
                  {
                    name: "The Pudding",
                    href: "https://pudding.cool",
                    note: "A reminder that the best journalism often looks nothing like journalism.",
                  },
                  {
                    name: "Moon's Medium archive",
                    href: "https://medium.com/@singhmankaran05",
                    note: "Where the voice started — the impatience with hype, the instinct toward the honest sentence.",
                  },
                ].map(({ name, href, note }) => (
                  <li key={name} style={{ display: "flex", gap: "var(--space-4)", alignItems: "baseline" }}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontWeight: 500,
                        fontSize: "var(--text-base)",
                        color: "var(--accent-secondary)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {name}
                    </a>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      — {note}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border-subtle)",
                margin: "var(--space-10) 0",
              }}
            />

            {/* Built with */}
            <section style={{ marginBottom: "var(--space-12)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Built with
              </h2>
              <p style={{ marginBottom: "var(--space-4)" }}>
                AIght runs on Next.js 14 App Router for the frontend, with MDX
                rendered via next-mdx-remote for all editorial content in the
                Learn section. Tool data is stored in Supabase; the site is
                deployed on Vercel at{" "}
                <a
                  href="https://aightai.in"
                  style={{
                    color: "var(--accent-secondary)",
                    textDecoration: "none",
                  }}
                >
                  aightai.in
                </a>
                . No CMS, no sponsored integrations, no external AI calls on the
                frontend — the stack was chosen for honesty and longevity, not
                novelty.
              </p>
            </section>

            {/* Dateline */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginTop: "var(--space-16)",
              }}
            >
              Last updated · 25 May 2026 · By{" "}
              <Link
                href="/author/moon"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Moon
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
