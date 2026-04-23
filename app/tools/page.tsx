import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ToolsClient from "@/components/ToolsClient";
import Footer from "@/components/Footer";
import type { ToolCardProps } from "@/components/ToolCard";
import type { Tool } from "@/utils/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Full Archive",
  description:
    "52+ curated AI tools worth your attention. Instant search and tag filters. No sponsored rankings, no affiliate links.",
};

export default async function ToolsArchivePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, url, tags")
    .order("created_at", { ascending: true });

  const tools: ToolCardProps[] = (data ?? []).map((t: Partial<Tool>) => ({
    slug:     t.slug ?? "",
    name:     t.name ?? "",
    tagline:  t.vibe_description ?? "",
    category: t.category ?? "AI Tool",
    url:      t.url ?? null,
    tags:     t.tags ?? [],
  }));

  return (
    <>
      <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

        {/* Header */}
        <section style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '64px 48px 40px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 14 }}>
            every tool we&apos;ve found worth your time
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
            The Full Archive
          </h1>
          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 16, lineHeight: 1.8, color: 'rgba(245,239,224,0.55)', maxWidth: '52ch' }}>
            {tools.length} tools and counting. No sponsored rankings. No hustle energy.
            Tap any card to explore.
          </p>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ height: 1, background: 'rgba(245,239,224,0.07)' }} />
        </div>

        {/* Search + grid */}
        <section style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '40px 48px 80px' }}>
          <ToolsClient tools={tools} />
        </section>

      </main>
      <Footer />
    </>
  );
}
