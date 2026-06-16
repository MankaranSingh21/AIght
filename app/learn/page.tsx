import type { Metadata } from "next";
import Link from "next/link";
import ConceptCarouselClient from "@/components/learn/ConceptCarouselClient";
import { getAllConcepts, getConceptsGrouped } from "@/lib/learn";
import { hasLesson } from "@/lib/lessons";
import { getTracks } from "@/lib/curriculum";
import TrackCardProgress from "@/components/progress/TrackCardProgress";
import RecommendedNext from "@/components/learn/RecommendedNext";
import { buildCollectionLd } from "@/utils/jsonld";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Learn",
  description: "Honest explanations of the concepts behind the AI tools you use.",
};

function EdgeOrb({
  top, bottom, left, right, size = 560, color = "rgba(170,255,77,0.045)",
}: {
  top?: number | string; bottom?: number | string;
  left?: number | string; right?: number | string;
  size?: number; color?: string;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top, bottom, left, right,
        width: size, height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(80px)",
        pointerEvents: "none",
      }}
    />
  );
}

export default function LearnPage() {
  const allConcepts = getAllConcepts();
  const grouped = getConceptsGrouped();
  const tracks = getTracks();

  // Concept graph for the personalised "where to go next" module (Wave 4).
  const conceptGraph = allConcepts.map((c) => ({
    slug: c.slug,
    title: c.title,
    tagline: c.tagline,
    group: c.group,
    readTime: c.readTime,
    hasLesson: hasLesson(c.slug),
    prerequisites: c.prerequisites ?? [],
    successors: c.successors ?? [],
  }));

  const jsonLd = buildCollectionLd({
    path: "/learn",
    name: "Learn — Concepts behind the tools",
    description: "Honest explanations of the concepts behind the AI tools you use.",
    items: allConcepts.map((c) => ({ name: c.title, url: `/learn/${c.slug}` })),
    itemType: "Article",
  });

  return (
    <>
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* JSON-LD lives inside <main> to avoid the PostHog script-injection
          hydration collision (see Session 33 fix on /compare + /signal). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-bleed header ────────────────────────────────────────────── */}
      <section className="section-full" style={{ paddingBottom: 0 }}>
        <EdgeOrb top={-60} right={-140} size={550} />
        <EdgeOrb bottom={-40} left={-180} size={400} color="rgba(0,255,209,0.03)" />

        <div className="section-inner" style={{ paddingBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(245,239,224,0.35)", marginBottom: 14,
          }}>
            Learn
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            color: "#F5EFE0",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: "0 0 20px",
          }}>
            Understand the tools you use
          </h1>
          <p style={{
            fontFamily: "var(--font-editorial)",
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(245,239,224,0.55)",
            maxWidth: "52ch",
            fontStyle: "italic",
            margin: 0,
          }}>
            No jargon for its own sake. No sales copy dressed up as explanation.
            Just honest accounts of how these things actually work.
          </p>
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
      </section>

      {/* ── Recommended next — returning readers only (renders nothing for new visitors) ── */}
      <RecommendedNext concepts={conceptGraph} />

      {/* ── Carousel ────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", background: "rgba(20,17,14,0.45)", overflow: "hidden" }}>
        <EdgeOrb top={60} right={-160} size={500} color="rgba(170,255,77,0.03)" />
        <EdgeOrb bottom={-60} left={-180} size={480} color="rgba(0,255,209,0.025)" />
        <ConceptCarouselClient />
        <div style={{ textAlign: 'center', padding: '0 0 40px', position: 'relative', zIndex: 1 }}>
          <Link href="/learn/map" className="map-explore-link"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12,
                     textDecoration: 'none', letterSpacing: '0.06em' }}>
            Explore the map →
          </Link>
        </div>
      </section>

      {/* ── Bridge section ──────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .learn-bridge-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <section style={{
        borderTop: "1px solid rgba(245,239,224,0.07)",
        background: "rgba(255,250,240,0.02)",
        padding: "64px 0",
      }}>
        <div style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 32,
        }}
          className="learn-bridge-grid"
        >
          {/* The Universe — primary feature */}
          <Link
            href="/learn/map"
            style={{ textDecoration: "none", display: "block" }}
            className="group"
          >
            <div style={{
              padding: "36px 40px",
              borderRadius: 16,
              border: "1px solid rgba(170,255,77,0.20)",
              background: "linear-gradient(135deg, rgba(170,255,77,0.06) 0%, rgba(0,255,209,0.03) 60%, transparent 100%)",
              backdropFilter: "blur(12px)",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
              className="group-hover:border-accent group-hover:shadow-[0_0_40px_rgba(170,255,77,0.10)]"
            >
              {/* Constellation hint — tiny SVG corner detail */}
              <svg
                aria-hidden
                width="160"
                height="120"
                viewBox="0 0 160 120"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  opacity: 0.45,
                  pointerEvents: "none",
                }}
              >
                <line x1="20" y1="30" x2="68" y2="58" stroke="rgba(170,255,77,0.45)" strokeWidth="0.8" />
                <line x1="68" y1="58" x2="118" y2="34" stroke="rgba(0,255,209,0.40)" strokeWidth="0.8" />
                <line x1="68" y1="58" x2="92" y2="98" stroke="rgba(244,171,31,0.30)" strokeWidth="0.8" />
                <line x1="118" y1="34" x2="140" y2="80" stroke="rgba(0,255,209,0.30)" strokeWidth="0.8" />
                <circle cx="20"  cy="30" r="3.5" fill="rgba(170,255,77,0.70)" />
                <circle cx="68"  cy="58" r="3"   fill="rgba(0,255,209,0.65)" />
                <circle cx="118" cy="34" r="2.5" fill="rgba(0,255,209,0.55)" />
                <circle cx="92"  cy="98" r="2.5" fill="rgba(244,171,31,0.55)" />
                <circle cx="140" cy="80" r="2"   fill="rgba(244,171,31,0.40)" />
              </svg>

              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 14,
              }}>
                The universe · {allConcepts.length}+ concepts, 22 fields, 60+ tools
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
                color: "#F5EFE0", letterSpacing: "-0.02em", lineHeight: 1.15,
                margin: "0 0 12px", transition: "color 150ms ease",
                maxWidth: "20ch",
              }}
                className="group-hover:text-accent"
              >
                See every field, concept, and tool — and where you fit.
              </h3>
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                fontSize: 15, color: "rgba(245,239,224,0.55)", lineHeight: 1.7, margin: "0 0 18px",
                maxWidth: "44ch",
              }}>
                A spatial map of the whole archive. Take the quiz to overlay your own trajectory through it.
              </p>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-primary)",
                letterSpacing: "0.06em",
              }}>
                Explore the universe →
              </span>
            </div>
          </Link>

          {/* Field guides */}
          <Link
            href="/learn/paths"
            style={{ textDecoration: "none", display: "block" }}
            className="group"
          >
            <div style={{
              padding: "28px 32px",
              borderRadius: 12,
              border: "1px solid rgba(245,239,224,0.07)",
              background: "rgba(255,250,240,0.03)",
              backdropFilter: "blur(12px)",
              transition: "border-color 200ms ease",
              height: "100%",
            }}
              className="group-hover:border-accent"
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 14,
              }}>
                Field guides
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: "#F5EFE0", letterSpacing: "-0.02em", lineHeight: 1.2,
                margin: "0 0 10px", transition: "color 150ms ease",
              }}
                className="group-hover:text-accent"
              >
                AI in your field →
              </h3>
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                fontSize: 14, color: "rgba(245,239,224,0.45)", lineHeight: 1.7, margin: 0,
              }}>
                What these concepts actually mean for medicine, law, design, finance — and 16 other fields.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Learning tracks — ordered roadmaps from zero ───────────────── */}
      <section style={{
        borderTop: "1px solid rgba(245,239,224,0.07)",
        padding: "64px 0 16px",
      }}>
        <div style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 8,
          }}>
            Learning tracks — start from zero
          </p>
          <p style={{
            fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14,
            color: "var(--text-muted)", margin: "0 0 32px", maxWidth: "52ch",
          }}>
            Five ordered paths from &quot;what is AI&quot; to working with agents.
            No code required to start. Pick the one that matches where you are.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/learn/tracks/${track.slug}`}
                style={{ textDecoration: "none" }}
                className="group"
              >
                <div style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderLeft: "3px solid var(--accent-primary)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-6)",
                  height: "100%",
                  transition: "border-color 200ms ease, transform 200ms ease",
                }}
                  className="group-hover:-translate-y-0.5"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}>
                      {track.eyebrow}
                    </span>
                    <TrackCardProgress slugs={track.nodes.filter((n) => !n.soon).map((n) => n.slug)} />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 600,
                    color: "var(--text-primary)", margin: "0 0 8px",
                    letterSpacing: "-0.01em", transition: "color 150ms ease",
                  }}
                    className="group-hover:text-accent"
                  >
                    {track.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-editorial)", fontStyle: "italic",
                    fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                    margin: "0 0 14px",
                  }}>
                    {track.description}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    letterSpacing: "0.06em", color: "var(--text-muted)", margin: 0,
                  }}>
                    {track.nodes.length} stops
                    {track.lessonCount > 0 && <span style={{ color: "var(--accent-primary)" }}> · ◈ {track.lessonCount} interactive</span>}
                    {track.soonCount > 0 && ` · ${track.soonCount} coming`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All concepts — grouped ────────────────────────────────────── */}
      <section style={{
        borderTop: "1px solid rgba(245,239,224,0.07)",
        padding: "64px 0 80px",
      }}>
        <div style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 8,
          }}>
            All concepts — {allConcepts.length} articles · {grouped.length} groups
          </p>
          <p style={{
            fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14,
            color: "var(--text-muted)", margin: "0 0 40px", maxWidth: "52ch",
          }}>
            Grouped by where each idea lives in the stack — read in any order,
            but each group reads as a story if you take it top-to-bottom.
          </p>

          {grouped.map(({ group, description, concepts }) => (
            <div key={group} style={{ marginBottom: "var(--space-16)" }}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap",
                paddingBottom: 16, marginBottom: 8,
                borderBottom: "1px solid rgba(245,239,224,0.10)",
              }}>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                  color: "var(--accent-primary)", letterSpacing: "-0.02em", margin: 0,
                }}>
                  {group}
                </h2>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                }}>
                  {concepts.length} {concepts.length === 1 ? "concept" : "concepts"}
                </span>
                <p style={{
                  fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13,
                  color: "var(--text-secondary)", margin: 0, flex: "1 1 100%",
                  lineHeight: 1.6,
                }}>
                  {description}
                </p>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                columnGap: 32,
              }}>
                {concepts.map((concept) => (
                  <Link
                    key={concept.slug}
                    href={`/learn/${concept.slug}`}
                    style={{ textDecoration: "none" }}
                    className="group"
                  >
                    <div style={{
                      padding: "18px 0",
                      borderBottom: "1px solid rgba(245,239,224,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          margin: "0 0 4px",
                          letterSpacing: "-0.01em",
                          transition: "color 150ms ease",
                        }}
                          className="group-hover:text-accent"
                        >
                          {concept.title}
                        </h3>
                        <p style={{
                          fontFamily: "var(--font-editorial)",
                          fontStyle: "italic",
                          fontSize: 13,
                          color: "rgba(245,239,224,0.45)",
                          margin: 0,
                          lineHeight: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {concept.tagline}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        {hasLesson(concept.slug) && (
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 10,
                            color: "var(--accent-primary)",
                            letterSpacing: "0.06em",
                          }}>
                            ◈ interactive
                          </span>
                        )}
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 10,
                          color: "rgba(245,239,224,0.25)",
                          letterSpacing: "0.06em",
                        }}>
                          {concept.readTime}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 12,
                          color: "var(--accent-primary)",
                          opacity: 0,
                          transition: "opacity 150ms ease",
                        }}
                          className="group-hover:opacity-100"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
    <Footer />
    </>
  );
}
