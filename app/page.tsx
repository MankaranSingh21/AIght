import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import ToolCard, { type ToolCardProps } from "@/components/ToolCard";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import type { Tool } from "@/utils/supabase/types";
import { getAllConcepts } from "@/lib/learn";
import { getSignalPosts } from "@/lib/signal";
import fields from "@/content/paths/fields.json";

// ── Data helpers ──────────────────────────────────────────────────────────────

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

// ── Signal post card ──────────────────────────────────────────────────────────

function SignalCard({
  date,
  title,
  excerpt,
  href,
}: {
  date: string;
  title: string;
  excerpt: string;
  href: string;
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

// ── Concept card ──────────────────────────────────────────────────────────────

function ConceptCard({
  title,
  tagline,
  readTime,
  slug,
}: {
  title: string;
  tagline: string;
  readTime: string;
  slug: string;
}) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="group flex flex-col gap-3 p-6 concept-card rounded-lg"
    >
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
        Concept
      </p>
      <h3
        className="font-sans text-2xl font-semibold text-primary group-hover:text-accent transition-colors duration-150 leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
      <p className="font-serif italic text-base text-secondary leading-relaxed flex-1">
        {tagline}
      </p>
      <p className="font-mono text-sm text-muted">{readTime}</p>
    </Link>
  );
}

// ── Path card (field guide) ───────────────────────────────────────────────────

const FEATURED_SLUGS = ["biology", "medicine-healthcare", "creative-writing-literature", "education-teaching"];

function PathCard({
  field,
  slug,
  tagline,
  difficulty,
}: {
  field: string;
  slug: string;
  tagline: string;
  difficulty: string;
}) {
  const badgeStyle =
    difficulty === "Easy"
      ? undefined
      : difficulty === "Medium"
      ? {
          background: "rgba(201, 169, 110, 0.1)",
          color: "var(--accent-warm)",
          borderColor: "rgba(201, 169, 110, 0.3)",
        }
      : {
          background: "rgba(224, 112, 112, 0.1)",
          color: "var(--error)",
          borderColor: "rgba(224, 112, 112, 0.3)",
        };

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
        <span
          className={difficulty === "Easy" ? "tag tag-accent" : "tag"}
          style={badgeStyle}
        >
          {difficulty}
        </span>
      </div>
      <p className="font-serif italic text-sm text-secondary leading-relaxed flex-1 line-clamp-3">
        {tagline}
      </p>
      <p className="font-sans text-sm text-accent mt-1">Explore path →</p>
    </Link>
  );
}

// ── Async server sections ─────────────────────────────────────────────────────

async function SignalSection() {
  const posts = await getSignalPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
      <div className="max-w-editorial mx-auto">
        <div className="mb-8">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8, margin: '0 0 8px' }}>
            latest
          </p>
          <h2
            className="font-sans text-3xl font-semibold text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            From the archive
          </h2>
        </div>

        <div className="reveal-list">
          {posts.map((post, i) => (
            <SignalCard key={i} {...post} />
          ))}
        </div>

        <div className="pt-8">
          <Link href="/signal" className="btn-ghost">
            Read all signal →
          </Link>
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
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
      <div className="max-w-content mx-auto">
        <div className="mb-10">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8, margin: '0 0 8px' }}>
            recently added
          </p>
          <h2
            className="font-sans text-3xl font-semibold text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            Tools making waves
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tool/${tool.slug}`} className="block">
              <ToolCard {...tool} />
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/tools" className="btn-ghost">
            See the full archive →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const concepts = getAllConcepts().slice(0, 3);

  return (
    <>
      <main className="min-h-screen bg-page">

        {/* 1. Hero */}
        <Hero />

        {/* Ticker */}
        <Ticker />

        {/* 2. From the archive — live Signal posts from Medium */}
        <ScrollReveal>
          <Suspense fallback={null}>
            <SignalSection />
          </Suspense>
        </ScrollReveal>

        {/* 3. Understand — Concept cards sourced from content/learn/ */}
        {concepts.length > 0 && (
          <ScrollReveal>
          <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
            <div className="max-w-content mx-auto">
              <div className="mb-10">
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8, margin: '0 0 8px' }}>
                  learn
                </p>
                <h2
                  style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', margin: 0 }}
                >
                  Understand the tools you use
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-grid">
                {concepts.map((concept) => (
                  <ConceptCard key={concept.slug} {...concept} />
                ))}
              </div>

              <div className="mt-10">
                <Link href="/learn" className="btn-ghost">
                  Read all concepts →
                </Link>
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
            <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
              <div className="max-w-content mx-auto">
                <div className="mb-10">
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 8, margin: '0 0 8px' }}>
                    field guides
                  </p>
                  <h2
                    className="font-sans text-3xl font-semibold text-primary"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    AI in your field
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-grid">
                  {featured.map((f) => (
                    <PathCard
                      key={f.slug}
                      field={f.field}
                      slug={f.slug}
                      tagline={f.tagline}
                      difficulty={f.difficulty}
                    />
                  ))}
                </div>

                <div className="mt-10">
                  <Link href="/learn/paths" className="btn-ghost">
                    See all fields →
                  </Link>
                </div>
              </div>
            </section>
            </ScrollReveal>
          );
        })()}

        {/* 5. Tools making waves */}
        <ScrollReveal>
          <Suspense fallback={null}>
            <ToolsSection />
          </Suspense>
        </ScrollReveal>

        {/* CTA — before newsletter */}
        <section style={{
          position: 'relative',
          padding: '96px 48px',
          borderTop: '1px solid rgba(245,239,224,0.06)',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          {/* Radial lime orb */}
          <div style={{
            position: 'absolute',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(170,255,77,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900,
              color: '#F5EFE0',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}>
              Stop doomscrolling.{' '}
              <em style={{ color: '#AAFF4D', fontStyle: 'italic' }}>Start knowing.</em>
            </h2>
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(245,239,224,0.50)',
              margin: '0 0 36px',
            }}>
              No spam. Unsubscribe whenever.
            </p>
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
              <NewsletterForm />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
