import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ToolCard, { type ToolCardProps } from "@/components/ToolCard";
import NewsletterForm from "@/components/NewsletterForm";
import type { Tool } from "@/utils/supabase/types";
import { getAllConcepts } from "@/lib/learn";
import { getSignalPosts } from "@/lib/signal";

// ── Data helpers ──────────────────────────────────────────────────────────────

function mapTool(t: Partial<Tool>): ToolCardProps {
  return {
    slug:        t.slug ?? "",
    name:        t.name ?? "",
    tagline:     t.vibe_description ?? "",
    category:    t.category ?? "AI Tool",
    emoji:       t.emoji ?? "🤖",
    url:         t.url ?? null,
    tags:        t.tags ?? [],
    accentColor: (t.accent as "moss" | "amber" | "lavender") ?? "moss",
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
      <h3 className="font-sans text-xl font-medium text-primary group-hover:text-accent transition-colors duration-150 mb-2">
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
      className="group flex flex-col gap-3 p-6 bg-panel border-l-[3px] border-accent rounded-lg hover:bg-raised transition-colors duration-200"
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

// ── Async server sections ─────────────────────────────────────────────────────

async function SignalSection() {
  const posts = await getSignalPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
      <div className="max-w-editorial mx-auto">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
            latest
          </p>
          <h2
            className="font-sans text-3xl font-semibold text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            From the archive
          </h2>
        </div>

        <div>
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
    .select("slug, name, vibe_description, category, emoji, url, tags, accent")
    .order("created_at", { ascending: false })
    .limit(6);

  const tools = (data ?? []).map(mapTool);
  if (tools.length === 0) return null;

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
      <div className="max-w-content mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
            recently added
          </p>
          <h2
            className="font-sans text-3xl font-semibold text-primary"
            style={{ letterSpacing: "-0.02em" }}
          >
            Tools making waves
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

        {/* 2. From the archive — live Signal posts from Medium */}
        <Suspense fallback={null}>
          <SignalSection />
        </Suspense>

        {/* 3. Understand — Concept cards sourced from content/learn/ */}
        {concepts.length > 0 && (
          <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
            <div className="max-w-content mx-auto">
              <div className="mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
                  learn
                </p>
                <h2
                  className="font-sans text-3xl font-semibold text-primary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Understand the tools you use
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        )}

        {/* 4. Tools making waves */}
        <Suspense fallback={null}>
          <ToolsSection />
        </Suspense>

        {/* 5. Newsletter */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-subtle">
          <div className="max-w-narrow mx-auto">
            <h2
              className="font-sans text-2xl font-semibold text-primary mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Stay in the signal.
            </h2>
            <p className="font-sans text-sm text-secondary mb-6">
              No spam. Unsubscribe whenever.
            </p>
            <NewsletterForm />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
