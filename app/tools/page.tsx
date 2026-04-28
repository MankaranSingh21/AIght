import type { Metadata } from "next";
import { Suspense } from "react";
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

// Reusable edge orb — sits outside the content column for full-bleed depth
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

export default async function ToolsArchivePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category, url, tags, created_at, is_sponsored, accent")
    .order("is_sponsored", { ascending: false })
    .order("created_at", { ascending: false });

  const tools: ToolCardProps[] = (data ?? []).map((t: Partial<Tool>) => ({
    slug:         t.slug ?? "",
    name:         t.name ?? "",
    tagline:      t.vibe_description ?? "",
    category:     t.category ?? "AI Tool",
    url:          t.url ?? null,
    tags:         t.tags ?? [],
    created_at:   t.created_at ?? undefined,
    is_sponsored: t.is_sponsored ?? null,
    accent:       t.accent ?? null,
  }));

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* ── Full-bleed header ──────────────────────────────────────────── */}
        <section
          className="section-full"
          style={{ paddingBottom: 0 }}
        >
          <EdgeOrb top={-80} right={-160} size={600} />
          <EdgeOrb bottom={0} left={-200} size={480} color="rgba(0,255,209,0.03)" />

          <div className="section-inner" style={{ paddingBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#AAFF4D", marginBottom: 14,
            }}>
              every tool we&apos;ve found worth your time
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
              The Full Archive
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 17,
              lineHeight: 1.8,
              color: "rgba(245,239,224,0.55)",
              maxWidth: "52ch",
              margin: 0,
            }}>
              {tools.length} tools and counting. No sponsored rankings. No hustle energy.
              Browse the archive. Click any card for the full breakdown.
            </p>
          </div>

          {/* Full-width hairline */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
        </section>

        {/* ── Search + filter + grid ─────────────────────────────────────── */}
        <section
          className="section-full"
          style={{ background: "rgba(16,14,11,0.5)" }}
        >
          <EdgeOrb top={100} right={-180} size={500} color="rgba(170,255,77,0.03)" />
          <div className="section-inner" style={{ paddingTop: 48 }}>
            <Suspense fallback={null}>
              <ToolsClient tools={tools} />
            </Suspense>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
