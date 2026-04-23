import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import ToolGrid3D from "@/components/ToolGrid3D";
import type { ToolCardProps } from "@/components/ToolCard";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import type { Tool } from "@/utils/supabase/types";
import { getAllConcepts } from "@/lib/learn";
import { getSignalPosts } from "@/lib/signal";
import fields from "@/content/paths/fields.json";

// ── Data helpers ───────────────────────────────────────────────────────────────

function mapTool(t: Partial<Tool>): ToolCardProps {
  return {
    slug:     t.slug ?? "",
    name:     t.name ?? "",
    tagline:  t.vibe_description ?? "",
    category: t.category ?? "AI Tool",
    url:      t.url ?? null,
    tags:     t.tags ?? [],
  };
}

// ── Decorative edge orb ────────────────────────────────────────────────────────
// Full-bleed: sits outside the centred content column so the section
// doesn't feel like a narrow text box on a black canvas.

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

// ── Skeleton states (no shimmer — just a breath pulse) ─────────────────────────

function SkeletonSignalSection() {
  return (
    <section
      className="section-full"
      style={{ borderTop: "1px solid rgba(245,239,224,0.06)", background: "rgba(22,18,16,0.55)" }}
    >
      <EdgeOrb top={-120} right={-160} size={500} />
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
    <section
      className="section-full"
      style={{ borderTop: "1px solid rgba(245,239,224,0.06)" }}
    >
      <EdgeOrb top={-80} left={-200} />
      <EdgeOrb bottom={-120} right={-100} color="rgba(0,255,209,0.03)" />
      <div className="section-inner">
        <div style={{ marginBottom: 40 }}>
          <span className="skel" style={{ width: 100, height: 9, marginBottom: 10 }} />
          <span className="skel" style={{ width: 240, height: 28 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))", gap: 32 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="skel" style={{ height: 176, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Signal post card ───────────────────────────────────────────────────────────

function SignalCard({ date, title, excerpt, href }: {
  date: string; title: string; excerpt: string; href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-6 border-b border-subtle last:border-b-0"
    >
      <p className="font-mono text-sm text-muted mb-2">{date}</p>
      <h3 className="font-sans text-xl font-medium text-primary group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 mb-2">
        {title}
      </h3>
      <p className="font-serif text-base text-secondary leading-relaxed line-clamp-2">
        {excerpt}
      </p>
    </a>
  );
}

// ── Concept card ───────────────────────────────────────────────────────────────

function ConceptCard({ title, tagline, readTime, slug }: {
  title: string; tagline: string; readTime: string; slug: string;
}) {
  return (
    <Link href={`/learn/${slug}`} className="group flex flex-col gap-3 p-6 concept-card rounded-lg">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">Concept</p>
      <h3
        className="font-sans text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-150 leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
      <p className="font-serif italic text-base text-secondary leading-relaxed flex-1">{tagline}</p>
      <p className="font-mono text-sm text-muted">{readTime}</p>
    </Link>
  );
}

// ── Field path card ────────────────────────────────────────────────────────────

const FEATURED_SLUGS = ["biology", "medicine-healthcare", "creative-writing-literature", "education-teaching"];

function PathCard({ field, slug, tagline, difficulty }: {
  field: string; slug: string; tagline: string; difficulty: string;
}) {
  const badgeStyle =
    difficulty === "Easy" ? undefined
    : difficulty === "Medium"
      ? { background: "rgba(201,169,110,0.1)", color: "var(--accent-warm)", borderColor: "rgba(201,169,110,0.3)" }
      : { background: "rgba(224,112,112,0.1)", color: "var(--error)", borderColor: "rgba(224,112,112,0.3)" };

  return (
    <Link
      href={`/learn/paths/${slug}`}
      className="group flex flex-col gap-3 p-6 bg-panel border border-subtle rounded-lg hover:border-emphasis hover:-translate-y-0.5 transition-all duration-200"
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

// ── Async server sections ──────────────────────────────────────────────────────

async function SignalSection() {
  const posts = await getSignalPosts(3);
  if (posts.length === 0) return null;

  return (
    <section
      className="section-full"
      style={{ borderTop: "1px solid rgba(245,239,224,0.06)", background: "rgba(22,18,16,0.55)" }}
    >
      <EdgeOrb top={-100} right={-180} size={500} />
      <EdgeOrb bottom={-80} left={-100} size={400} color="rgba(0,255,209,0.025)" />
      <div className="section-inner-editorial">
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
            latest
          </p>
          <h2 className="font-sans text-3xl font-semibold text-primary" style={{ letterSpacing: "-0.02em" }}>
            From the archive
          </h2>
        </div>

        <div className="reveal-list">
          {posts.map((post, i) => <SignalCard key={i} {...post} />)}
        </div>

        <div style={{ paddingTop: 32 }}>
          <Link href="/signal" className="btn-ghost">Read all signal →</Link>
        </div>
      </div>
    </section>
  );
}

async function ToolsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, url, tags")
    .order("created_at", { ascending: false })
    .limit(6);

  const tools = (data ?? []).map(mapTool);
  if (tools.length === 0) return null;

  return (
    <section
      className="section-full"
      style={{ borderTop: "1px solid rgba(245,239,224,0.06)" }}
    >
      <EdgeOrb top={-80} left={-220} />
      <EdgeOrb bottom={-100} right={-120} color="rgba(0,255,209,0.03)" />
      <div className="section-inner">
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
            recently added
          </p>
          <h2 className="font-sans text-3xl font-semibold text-primary" style={{ letterSpacing: "-0.02em" }}>
            Tools making waves
          </h2>
        </div>

        <ToolGrid3D tools={tools} itemsPerPage={6} />

        <div style={{ marginTop: 40 }}>
          <Link href="/tools" className="btn-ghost">See the full archive →</Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const concepts = getAllConcepts().slice(0, 3);

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* 1. Hero */}
        <Hero />

        {/* Ticker strip */}
        <Ticker />

        {/* 2. From the archive */}
        <ScrollReveal>
          <Suspense fallback={<SkeletonSignalSection />}>
            <SignalSection />
          </Suspense>
        </ScrollReveal>

        {/* 3. Understand the tools you use */}
        {concepts.length > 0 && (
          <ScrollReveal>
            <section
              className="section-full"
              style={{ borderTop: "1px solid rgba(245,239,224,0.06)", background: "rgba(26,22,18,0.45)" }}
            >
              <EdgeOrb top={-100} right={-100} size={480} />
              <div className="section-inner">
                <div style={{ marginBottom: 40 }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                    learn
                  </p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,3vw,36px)", fontWeight: 700, color: "#F5EFE0", letterSpacing: "-0.02em", margin: 0 }}>
                    Understand the tools you use
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-grid">
                  {concepts.map((concept) => <ConceptCard key={concept.slug} {...concept} />)}
                </div>

                <div style={{ marginTop: 40 }}>
                  <Link href="/learn" className="btn-ghost">Read all concepts →</Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* 4. AI in your field */}
        {(() => {
          const featured = FEATURED_SLUGS
            .map((s) => fields.find((f) => f.slug === s))
            .filter(Boolean) as typeof fields;
          if (featured.length === 0) return null;
          return (
            <ScrollReveal>
              <section
                className="section-full"
                style={{ borderTop: "1px solid rgba(245,239,224,0.06)" }}
              >
                <EdgeOrb bottom={-60} left={-180} size={520} />
                <div className="section-inner">
                  <div style={{ marginBottom: 40 }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: "0 0 8px" }}>
                      field guides
                    </p>
                    <h2 className="font-sans text-3xl font-semibold text-primary" style={{ letterSpacing: "-0.02em" }}>
                      AI in your field
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-grid">
                    {featured.map((f) => (
                      <PathCard key={f.slug} field={f.field} slug={f.slug} tagline={f.tagline} difficulty={f.difficulty} />
                    ))}
                  </div>

                  <div style={{ marginTop: 40 }}>
                    <Link href="/learn/paths" className="btn-ghost">See all fields →</Link>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          );
        })()}

        {/* 5. Tools making waves */}
        <ScrollReveal>
          <Suspense fallback={<SkeletonToolsSection />}>
            <ToolsSection />
          </Suspense>
        </ScrollReveal>

        {/* 6. Newsletter CTA */}
        <section
          className="section-full"
          style={{ borderTop: "1px solid rgba(245,239,224,0.06)" }}
        >
          {/* Wide centre orb — extends well past the content column */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 700, height: 700, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(170,255,77,0.06) 0%, transparent 65%)",
              filter: "blur(100px)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              padding: "96px 48px",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 900,
              color: "#F5EFE0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}>
              Stop doomscrolling.{" "}
              <em style={{ color: "#AAFF4D", fontStyle: "italic" }}>Start knowing.</em>
            </h2>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(245,239,224,0.50)",
              margin: "0 0 36px",
            }}>
              No spam. Unsubscribe whenever.
            </p>
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <NewsletterForm />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
