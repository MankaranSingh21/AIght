import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import ToolCard from "@/components/ToolCard";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollParallax from "@/components/ScrollParallax";
import InteractiveCard from "@/components/InteractiveCard";
import HorizontalScroll from "@/components/HorizontalScroll";
import SectionDivider from "@/components/SectionDivider";
import Marginalia from "@/components/Marginalia";
import MagneticLink from "@/components/MagneticLink";
import AuroraBackground from "@/components/AuroraBackground";
import { getAllConcepts } from "@/lib/learn";
import { getSignalPosts } from "@/lib/signal";
import { getHomeData } from "@/lib/home-data";
import fields from "@/content/paths/fields.json";

import HomepageParticles from "@/components/HomepageParticles";

// ── Skeleton states (no shimmer — just a breath pulse) ─────────────────────────

function SkeletonSignalSection() {
  return (
    <section className="section-full">
      <div className="section-inner-editorial">
        <div style={{ marginBottom: 32 }}>
          <span className="skel" style={{ width: 48, height: 9, marginBottom: 10 }} />
          <span className="skel" style={{ width: 220, height: 26 }} />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(245,239,224,0.06)", padding: "24px 0" }}>
            <span className="skel" style={{ width: 72, height: 9, marginBottom: 10 }} />
            <span className="skel" style={{ width: `${68 + i * 8}%`, height: 18, marginBottom: 8 }} />
            <span className="skel" style={{ width: `${80 + i * 5}%`, height: 13 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonToolsSection() {
  return (
    <section className="section-full">
      <div className="section-inner-wide">
        <div style={{ marginBottom: 40 }}>
          <span className="skel" style={{ width: 100, height: 9, marginBottom: 10 }} />
          <span className="skel" style={{ width: 240, height: 28 }} />
        </div>
        <div className="bento-tools">
          <span className="skel bento-cell-hero" />
          <span className="skel bento-cell" />
          <span className="skel bento-cell" />
          <span className="skel bento-cell" />
          <span className="skel bento-cell" />
          <span className="skel bento-cell" />
        </div>
      </div>
    </section>
  );
}

// ── Sub-card primitives (server-renderable bodies wrapped in InteractiveCard) ──

function ConceptBody({
  title, tagline, readTime, slug, large,
}: { title: string; tagline: string; readTime: string; slug: string; large?: boolean }) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="group flex flex-col gap-3 p-6 concept-card rounded-xl h-full"
      style={{ width: "100%" }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">Concept</p>
      <h3
        className="font-sans font-semibold text-primary group-hover:text-accent transition-colors duration-150 leading-tight"
        style={{
          fontSize: large ? "clamp(28px, 3vw, 40px)" : "clamp(20px, 1.6vw, 26px)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>
      <p className="font-serif italic text-secondary leading-relaxed flex-1" style={{ fontSize: large ? 17 : 15 }}>
        {tagline}
      </p>
      <p className="font-mono text-sm text-muted">{readTime}</p>
    </Link>
  );
}

function PathBody({
  field, slug, tagline, difficulty,
}: { field: string; slug: string; tagline: string; difficulty: string }) {
  const badgeStyle =
    difficulty === "Easy" ? undefined
    : difficulty === "Medium"
      ? { background: "rgba(201,169,110,0.1)", color: "var(--accent-warm)", borderColor: "rgba(201,169,110,0.3)" }
      : { background: "rgba(224,112,112,0.1)", color: "var(--error)", borderColor: "rgba(224,112,112,0.3)" };

  return (
    <Link
      href={`/learn/paths/${slug}`}
      className="group flex flex-col gap-3 p-6 rounded-xl h-full"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", width: "100%" }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3
          className="font-sans text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-150 leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          {field}
        </h3>
        <span className={difficulty === "Easy" ? "tag tag-accent" : "tag"} style={badgeStyle}>
          {difficulty}
        </span>
      </div>
      <p className="font-serif italic text-sm text-secondary leading-relaxed flex-1 line-clamp-3">{tagline}</p>
      <p className="font-sans text-sm text-accent mt-1">Explore path →</p>
    </Link>
  );
}

function SignalBody({
  date, title, excerpt, href,
}: { date: string; title: string; excerpt: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 rounded-xl h-full"
      style={{ background: "rgba(22,18,16,0.65)", border: "1px solid var(--border-subtle)", width: "100%" }}
    >
      <p className="font-mono text-sm text-muted mb-2">{date}</p>
      <h3 className="font-sans text-xl font-medium text-primary group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 mb-2">
        {title}
      </h3>
      <p className="font-serif text-base text-secondary leading-relaxed line-clamp-3">
        {excerpt}
      </p>
    </a>
  );
}

// ── Async server sections ──────────────────────────────────────────────────────

async function SignalSection() {
  const posts = await getSignalPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="section-full">
      <div className="section-inner-wide">
        <div
          className="grid items-start"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "var(--space-10)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 0.5fr) minmax(0, 1.5fr)",
              gap: "var(--space-12)",
              alignItems: "start",
            }}
            className="signal-grid"
          >
            <ScrollParallax range={[20, -20]}>
              <div style={{ position: "sticky", top: 100 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 12px" }}>
                  latest
                </p>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  From the archive
                </h2>
                <p className="font-serif italic text-secondary mt-4" style={{ fontSize: 15, lineHeight: 1.65, maxWidth: "28ch" }}>
                  Recently from the desk — notes, observations, the occasional
                  rabbit hole.
                </p>
                <div style={{ marginTop: 24 }}>
                  <Link href="/signal" className="btn-ghost">Read all signal →</Link>
                </div>
              </div>
            </ScrollParallax>

            <div
              className="reveal-list"
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-5)" }}
            >
              {posts.map((post, i) => (
                <InteractiveCard
                  key={i}
                  gradientColor="#00FFD1"
                  gradientSize={300}
                  gradientOpacity={0.10}
                  maxTilt={4}
                >
                  <SignalBody {...post} />
                </InteractiveCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .signal-grid { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
          .signal-grid > div:first-child > div { position: static !important; }
        }
      `}</style>
    </section>
  );
}

async function ToolsSection() {
  const { recentCards: tools, error } = await getHomeData();

  if (tools.length === 0) {
    return (
      <section className="section-full">
        <div className="section-inner-wide">
          <div className="marginalia-wrap" style={{ marginBottom: 40 }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                {error ? "the archive is briefly offline" : "warming up the archive"}
              </p>
              <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Tools making waves
              </h2>
            </div>
          </div>
          <p className="font-serif italic text-secondary" style={{ fontSize: 17, lineHeight: 1.7, maxWidth: "52ch", marginBottom: 24 }}>
            {error
              ? "Our archive is taking a breath. The full directory is still alive and well."
              : "No tools to feature here just yet. The full directory is open for browsing."}
          </p>
          <Link href="/tools" className="btn-ghost">Browse the directory →</Link>
        </div>
      </section>
    );
  }

  // Pick "hero" tool — highest utility score, fallback to first
  const sorted = [...tools].sort(
    (a, b) => (b.utility_score ?? 0) - (a.utility_score ?? 0),
  );
  const hero = sorted[0];
  const rest = tools.filter((t) => t.slug !== hero.slug).slice(0, 5);

  return (
    <section className="section-full">
      <div className="section-inner-wide">
        <div className="marginalia-wrap" style={{ marginBottom: 40 }}>
          <ScrollParallax range={[10, -10]}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                recently added
              </p>
              <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                Tools making waves
              </h2>
            </div>
          </ScrollParallax>
          <Marginalia side="right" eyebrow="In the archive">
            60+ tools, 0 affiliate links.
            Curated weekly, judged ruthlessly.
          </Marginalia>
        </div>

        <div className="bento-tools">
          <div className="bento-cell-hero">
            <ToolCard {...hero} />
          </div>
          {rest.map((tool) => (
            <div key={tool.slug} className="bento-cell">
              <ToolCard {...tool} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/tools" className="btn-ghost">See the full archive →</Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const FEATURED_SLUGS = ["biology", "medicine-healthcare", "creative-writing-literature", "education-teaching"];

export default async function Home() {
  const allConcepts = getAllConcepts();
  const featuredConcepts = allConcepts.slice(0, 3);

  const featuredFields = (FEATURED_SLUGS
    .map((s) => fields.find((f) => f.slug === s))
    .filter(Boolean)) as typeof fields;

  // Use up to 8 field guides for the horizontal scroll strip
  const stripFields = fields.slice(0, 8);

  // Real data for the hero widgets — same fetch is shared with ToolsSection via React cache.
  const homeData = await getHomeData();
  const fieldNamesForCycler = fields.slice(0, 8).map((f) => f.field);

  return (
    <>
      <AuroraBackground />
      <HomepageParticles />
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* Hero */}
        <Hero
          tools={homeData.heroTools}
          riskStats={homeData.riskStats}
          topScored={homeData.topScored}
          fieldNames={fieldNamesForCycler}
          totalTools={homeData.totalTools}
        />

        {/* Ticker strip */}
        <Ticker />

        {/* §01 — From the archive */}
        <SectionDivider number="01" label="From the archive" />
        <ScrollReveal scale>
          <Suspense fallback={<SkeletonSignalSection />}>
            <SignalSection />
          </Suspense>
        </ScrollReveal>

        {/* §02 — Concepts (bento) */}
        {featuredConcepts.length > 0 && (
          <>
            <SectionDivider number="02" label="Understand the tools" />
            <ScrollReveal scale>
              <section className="section-full">
                <div className="section-inner-wide">
                  <div className="marginalia-wrap" style={{ marginBottom: 40 }}>
                    <ScrollParallax range={[10, -10]}>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                          concepts
                        </p>
                        <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                          Understand the tools you use
                        </h2>
                      </div>
                    </ScrollParallax>
                    <Marginalia side="left" eyebrow="Reading time">
                      Short essays. Pause-worthy diagrams.
                      The mental models behind the buttons.
                    </Marginalia>
                  </div>

                  <div className="bento-concepts reveal-grid">
                    {featuredConcepts[0] && (
                      <div className="bento-cell-feature">
                        <InteractiveCard
                          gradientColor="#AAFF4D"
                          gradientSize={420}
                          gradientOpacity={0.14}
                          maxTilt={6}
                        >
                          <ConceptBody {...featuredConcepts[0]} large />
                        </InteractiveCard>
                      </div>
                    )}
                    {featuredConcepts[1] && (
                      <div className="bento-cell-tall">
                        <InteractiveCard
                          gradientColor="#00FFD1"
                          gradientSize={280}
                          gradientOpacity={0.12}
                          maxTilt={5}
                        >
                          <ConceptBody {...featuredConcepts[1]} />
                        </InteractiveCard>
                      </div>
                    )}
                    {featuredConcepts[2] && (
                      <div className="bento-cell-wide">
                        <InteractiveCard
                          gradientColor="#F4AB1F"
                          gradientSize={400}
                          gradientOpacity={0.10}
                          maxTilt={4}
                        >
                          <ConceptBody {...featuredConcepts[2]} />
                        </InteractiveCard>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 40 }}>
                    <Link href="/learn" className="btn-ghost">See all concepts →</Link>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* §03 — Field guides (horizontal scroll) */}
        {featuredFields.length > 0 && (
          <>
            <SectionDivider number="03" label="AI in your field" />
            <ScrollReveal scale>
              <section className="section-full">
                <div className="section-inner-wide">
                  <div className="marginalia-wrap" style={{ marginBottom: 40 }}>
                    <ScrollParallax range={[10, -10]}>
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                          field guides
                        </p>
                        <h2 className="font-sans text-3xl md:text-4xl font-semibold text-primary" style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                          AI in your field
                        </h2>
                      </div>
                    </ScrollParallax>
                    <Marginalia side="right" eyebrow="22 disciplines">
                      From physicists to poets — the same models,
                      different questions. Drag to browse.
                    </Marginalia>
                  </div>
                </div>

                <HorizontalScroll>
                  {stripFields.map((f) => (
                    <InteractiveCard
                      key={f.slug}
                      gradientColor="#AAFF4D"
                      gradientSize={260}
                      gradientOpacity={0.10}
                      maxTilt={4}
                    >
                      <PathBody field={f.field} slug={f.slug} tagline={f.tagline} difficulty={f.difficulty} />
                    </InteractiveCard>
                  ))}
                </HorizontalScroll>

                <div className="section-inner-wide" style={{ paddingTop: 16, paddingBottom: 16 }}>
                  <Link href="/learn/paths" className="btn-ghost">See all fields →</Link>
                </div>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* §04 — Tools (bento) */}
        <SectionDivider number="04" label="Tools making waves" />
        <ScrollReveal scale>
          <Suspense fallback={<SkeletonToolsSection />}>
            <ToolsSection />
          </Suspense>
        </ScrollReveal>

        {/* §05 — Newsletter (full-bleed band) */}
        <SectionDivider number="05" label="Stay in the signal" />
        <section
          className="section-full"
          style={{
            background: "rgba(22,18,16,0.55)",
            borderTop: "1px solid rgba(245,239,224,0.06)",
            borderBottom: "1px solid rgba(245,239,224,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Giant AIght_ watermark */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(120px, 22vw, 360px)",
              fontWeight: 500,
              color: "rgba(245,239,224,0.025)",
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            AIght_
          </div>

          {/* Breathing radial glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(170,255,77,0.07) 0%, transparent 65%)",
              filter: "blur(100px)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              animation: "glow-breath 8s ease-in-out infinite",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              padding: "clamp(56px, 9vw, 120px) clamp(20px, 5vw, 48px)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900,
              color: "#F5EFE0",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 24px",
            }}>
              Stop doomscrolling.{" "}
              <em style={{ color: "#AAFF4D", fontStyle: "italic" }}>Start knowing.</em>
            </h2>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 17,
              lineHeight: 1.75,
              color: "rgba(245,239,224,0.55)",
              margin: "0 0 36px",
            }}>
              Join 5,000+ builders getting weekly signal. No hype, no affiliate links.
            </p>
            <div style={{ maxWidth: 420, margin: "0 auto" }}>
              <NewsletterForm />
            </div>
            <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              <MagneticLink href="/tools" className="font-sans text-sm text-secondary hover:text-accent transition-colors no-underline">
                Browse Tools →
              </MagneticLink>
              <MagneticLink href="/signal" className="font-sans text-sm text-secondary hover:text-accent transition-colors no-underline">
                Read Signal →
              </MagneticLink>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
