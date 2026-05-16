import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The AIght Score — how we rate tools",
  description:
    "The AIght Score is hand-assigned across five axes: utility, privacy, speed, cost, transparency. Here's exactly what each one means and what the bands signal.",
  openGraph: {
    title: "The AIght Score — how we rate tools",
    description:
      "A published rubric for the only number that matters on this site. Five axes, hand-assigned, slowly.",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

type Axis = {
  key: string;
  name: string;
  oneLiner: string;
  askingFor: string;
  redFlags: string[];
};

const AXES: Axis[] = [
  {
    key: "utility",
    name: "Utility",
    oneLiner: "Does it actually do the thing it claims, well enough that you'd choose it over the alternative?",
    askingFor:
      "Real, repeatable usefulness on the job it's marketed for. Demos that survive contact with messy inputs.",
    redFlags: [
      "Polished landing page, broken in week-two use",
      "Works on the demo prompt, fails on yours",
      "Requires a specific prompt incantation to behave",
    ],
  },
  {
    key: "privacy",
    name: "Privacy",
    oneLiner: "What happens to your data once it's in the box?",
    askingFor:
      "Clear policy on training, retention, residency, deletion. EU options when relevant. Self-host as a bonus.",
    redFlags: [
      "Defaults to training on your prompts unless you opt out",
      "Buried retention terms or none at all",
      "Vague \"we may share with partners\" clauses",
    ],
  },
  {
    key: "speed",
    name: "Speed",
    oneLiner: "How long do you actually wait for a useful output, in a realistic session?",
    askingFor:
      "Time-to-first-useful-result. Latency at common context lengths. Streaming where it matters.",
    redFlags: [
      "Headline benchmarks measured on toy prompts",
      "Hidden queue times under load",
      "\"Fast\" tier locked behind enterprise pricing",
    ],
  },
  {
    key: "cost",
    name: "Cost",
    oneLiner: "What does it really cost in a normal month, including the things they don't put on the pricing page?",
    askingFor:
      "Honest monthly spend for a representative workload. Overages, throughput caps, paywall cliffs disclosed.",
    redFlags: [
      "Free tier that resets daily, not monthly",
      "Token pricing with no visible usage meter",
      "Surprise per-seat minimums on the upgrade path",
    ],
  },
  {
    key: "transparency",
    name: "Transparency",
    oneLiner: "How honest is the team about what the tool can and can't do?",
    askingFor:
      "Public changelogs. Acknowledged failure modes. Real model names, not marketing names. Open weights or open source where claimed.",
    redFlags: [
      "Model identity hidden behind a custom brand name",
      "Quiet feature removals",
      "Marketing speed numbers that don't match the docs",
    ],
  },
];

type Band = {
  range: string;
  label: string;
  meaning: string;
};

const BANDS: Band[] = [
  {
    range: "90–100",
    label: "Reach for it.",
    meaning: "I keep coming back to this without thinking about it. The reason to use it outweighs the cost of switching to anything else.",
  },
  {
    range: "75–89",
    label: "Worth trying.",
    meaning: "Strong on most axes, real weaknesses on one. Worth your time if the weaknesses don't hit your specific case.",
  },
  {
    range: "60–74",
    label: "Situational.",
    meaning: "A serious answer for a narrow problem. Wrong tool for most people; right tool for some.",
  },
  {
    range: "45–59",
    label: "Compromise.",
    meaning: "There's something fundamentally awkward about it. Use it because the alternative is worse, not because it's good.",
  },
  {
    range: "0–44",
    label: "Skip it.",
    meaning: "Listed in the archive only so I can explain why I don't recommend it.",
  },
];

export default function ScoreRubricPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "The AIght Score — how we rate tools",
    "description":
      "A published rubric for the AIght Score. Five axes, hand-assigned, slowly.",
    "url": `${SITE_URL}/about/score`,
    "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "AIght" },
    "about": {
      "@type": "Rating",
      "ratingExplanation":
        "AIght scores are editorial. Each axis is rated 0–100 by hand after sustained use of the tool.",
    },
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
          {/* Back link */}
          <Link
            href="/about"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.10em",
              color: "var(--text-muted)",
              textDecoration: "none",
              marginBottom: "var(--space-4)",
              display: "inline-block",
            }}
          >
            ← Back to About
          </Link>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
              marginBottom: "var(--space-3)",
              marginTop: "var(--space-6)",
            }}
          >
            The AIght Score
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
              marginBottom: "var(--space-6)",
            }}
          >
            The one number on this site that matters.
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
            Every tool in the archive carries a single 0–100 score. It&rsquo;s the
            average of five axes I rate by hand, after spending real time with the
            tool. No algorithm. No vendor input. No paid placements.
          </p>

          {/* How it works — short prose */}
          <div
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-base)",
              lineHeight: 1.85,
              color: "var(--text-primary)",
              maxWidth: "68ch",
              marginBottom: "var(--space-16)",
            }}
          >
            <p style={{ marginBottom: "var(--space-5)" }}>
              The score isn&rsquo;t generated. There&rsquo;s no API call behind it.
              I pick five axes that have stayed the same since the archive
              started — utility, privacy, speed, cost, transparency — and I write
              a number on each one after I&rsquo;ve used the tool enough to mean
              it.
            </p>
            <p style={{ marginBottom: "var(--space-5)" }}>
              Some tools sit in the archive for weeks before they get a score.
              That&rsquo;s on purpose. A number this small needs to carry weight,
              so I&rsquo;d rather show <em>scoring in review</em> than publish a
              guess.
            </p>
            <p>
              When a tool changes — new pricing, new privacy posture, a model
              swap — the score moves with it. The last-updated date on each tool
              page is the last day I sat with it.
            </p>
          </div>

          {/* Five axes */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            The five axes
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-10)",
            }}
          >
            Each 0–100. The published score is the mean.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)", marginBottom: "var(--space-16)" }}>
            {AXES.map((axis, i) => (
              <section
                key={axis.key}
                style={{
                  padding: "var(--space-6) 0",
                  borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "var(--accent-primary)",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-2xl)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {axis.name}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontStyle: "italic",
                    fontSize: "var(--text-lg)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 var(--space-5)",
                    maxWidth: "62ch",
                  }}
                >
                  {axis.oneLiner}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "var(--space-6)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      What it&rsquo;s asking
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-editorial)",
                        fontSize: "var(--text-base)",
                        color: "var(--text-primary)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {axis.askingFor}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      Red flags
                    </p>
                    <ul
                      style={{
                        fontFamily: "var(--font-editorial)",
                        fontSize: "var(--text-base)",
                        color: "var(--text-primary)",
                        lineHeight: 1.7,
                        margin: 0,
                        paddingLeft: "1.1em",
                      }}
                    >
                      {axis.redFlags.map((rf) => (
                        <li key={rf} style={{ marginBottom: 6 }}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Bands */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            What the bands mean
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--space-10)",
            }}
          >
            Plain English for the headline number.
          </p>

          <div style={{ display: "flex", flexDirection: "column", marginBottom: "var(--space-16)" }}>
            {BANDS.map((band, i) => (
              <div
                key={band.range}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(80px, 110px) minmax(120px, 180px) 1fr",
                  gap: "var(--space-5)",
                  alignItems: "baseline",
                  padding: "var(--space-5) 0",
                  borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
                className="score-band"
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--accent-primary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {band.range}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {band.label}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "var(--text-base)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {band.meaning}
                </p>
              </div>
            ))}
          </div>

          {/* Coda */}
          <div
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-base)",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
              maxWidth: "62ch",
              marginBottom: "var(--space-12)",
              fontStyle: "italic",
              borderLeft: "3px solid var(--accent-primary)",
              paddingLeft: "var(--space-5)",
            }}
          >
            <p style={{ margin: 0 }}>
              The score is an opinion, slowly formed. If you disagree, that&rsquo;s
              the point — disagree with a person, not a vendor&rsquo;s landing
              page.
            </p>
          </div>

          {/* CTA links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
            }}
          >
            <Link href="/tools" className="btn-primary" style={{ textDecoration: "none" }}>
              Browse scored tools →
            </Link>
            <Link href="/about" className="btn-ghost" style={{ textDecoration: "none" }}>
              About AIght
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
