import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fields from "@/content/paths/fields.json";
import FieldBackground from "@/components/learn/FieldBackground";
import AugmentationDiagram from "@/components/learn/AugmentationDiagram";

type Difficulty = "Easy" | "Medium" | "Hard";

function conceptToSlug(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("retrieval") || t.includes("rag")) return "rag";
  if (t.includes("mcp") || t.includes("model context protocol")) return "mcp";
  if (t.includes("agent") || t.includes("autonomous") || t.includes("agentic") || t.includes("closed-loop")) return "agents";
  if (t.includes("embedding") || t.includes("vector")) return "embeddings";
  if (t.includes("transformer") || t.includes("attention") || t.includes("multimodal")) return "transformers";
  if (t.includes("fine-tun") || t.includes("fine tuning")) return "fine-tuning";
  if (t.includes("generative") || t.includes("generation")) return "fine-tuning";
  if (t.includes("neural") || t.includes("deep learning") || t.includes("graph neural")) return "transformers";
  if (t.includes("predict") || t.includes("classification")) return "embeddings";
  return "rag";
}

export function generateStaticParams() {
  return fields.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const field = fields.find((f) => f.slug === slug);
  if (!field) return {};
  return {
    title: `${field.field} — AI in your field`,
    description: field.tagline,
  };
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<Difficulty, React.CSSProperties> = {
    Easy:   { background: 'rgba(170,255,77,0.10)',  color: '#AAFF4D',            border: '1px solid rgba(170,255,77,0.25)' },
    Medium: { background: 'rgba(244,171,31,0.10)',  color: 'var(--accent-warm)', border: '1px solid rgba(244,171,31,0.25)' },
    Hard:   { background: 'rgba(224,112,112,0.10)', color: 'var(--error)',        border: '1px solid rgba(224,112,112,0.25)' },
  };
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.07em', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', ...styles[difficulty] }}>
      {difficulty}
    </span>
  );
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const field = fields.find((f) => f.slug === slug);
  if (!field) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${field.field} Field Guide`,
    "description": field.tagline,
    "image": `${SITE_URL}/learn/paths/${slug}/opengraph-image`,
    "author": {
      "@type": "Organization",
      "name": "AIght",
    },
    "publisher": {
      "@type": "Organization",
      "name": "AIght",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.ico`,
      },
    },
    "datePublished": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/learn/paths/${slug}`,
    },
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'rgba(255,250,240,0.02)', borderBottom: '1px solid rgba(245,239,224,0.07)', paddingTop: 80, paddingBottom: 80 }}>
        <FieldBackground />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '0 48px' }}>
          <Link
            href="/learn/paths"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', textDecoration: 'none', display: 'block', marginBottom: 40, transition: 'color 150ms ease', width: 'fit-content' }}
            className="hover:text-accent"
          >
            ← All fields
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 32, marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 14 }}>
                Field guide
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
                {field.field}
              </h1>
              <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 17, color: 'rgba(245,239,224,0.55)', lineHeight: 1.8, maxWidth: '56ch' }}>
                {field.tagline}
              </p>
            </div>
            <div style={{ paddingTop: 56 }}>
              <DifficultyBadge difficulty={field.difficulty as Difficulty} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <Link href={`/learn/paths/quiz?field=${field.slug}`} className="btn-primary">
              Start your path →
            </Link>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.35)' }}>
              See your personal disruption score in 2 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '64px 48px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 64, alignItems: 'start' }} className="field-content-grid">

          {/* Left */}
          <div>
            {/* What's changing */}
            <section style={{ marginBottom: 56 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 28, margin: '0 0 28px' }}>
                What&apos;s changing
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {field.transformations.map((text, i) => (
                  <div key={i} style={{ padding: 20, borderRadius: 12, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', backdropFilter: 'blur(12px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'start' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#AAFF4D', paddingTop: 3, letterSpacing: '0.05em' }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'rgba(245,239,224,0.60)', lineHeight: 1.75, margin: 0 }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Augmentation diagram */}
            <section style={{ marginBottom: 56, padding: 32, borderRadius: 16, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', backdropFilter: 'blur(12px)' }}>
              <AugmentationDiagram slug={slug} />
            </section>

            {/* Roles at risk / growing */}
            <section style={{ marginBottom: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ padding: 20, borderRadius: 12, border: '1px solid rgba(224,112,112,0.15)', background: 'rgba(224,112,112,0.04)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E07070', marginBottom: 14 }}>
                  Roles at risk
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {field.impact_data.roles_at_risk.map((role) => (
                    <p key={role} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.55)', lineHeight: 1.4, margin: 0, paddingLeft: 12, borderLeft: '2px solid rgba(224,112,112,0.30)' }}>
                      {role}
                    </p>
                  ))}
                </div>
              </div>
              <div style={{ padding: 20, borderRadius: 12, border: '1px solid rgba(170,255,77,0.15)', background: 'rgba(170,255,77,0.04)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 14 }}>
                  Roles growing
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {field.impact_data.roles_growing.map((role) => (
                    <p key={role} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.55)', lineHeight: 1.4, margin: 0, paddingLeft: 12, borderLeft: '2px solid rgba(170,255,77,0.30)' }}>
                      {role}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {/* What to actually do */}
            <section style={{ marginBottom: 56 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 28, margin: '0 0 28px' }}>
                What to actually do
              </h2>
              <blockquote style={{ borderLeft: '3px solid var(--accent-warm)', paddingLeft: 24, margin: 0 }}>
                <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'rgba(245,239,224,0.60)', lineHeight: 1.85, margin: 0 }}>
                  {field.action_paragraph}
                </p>
              </blockquote>
            </section>

            {/* Difficulty reasoning */}
            <section style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderRadius: 10, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)' }}>
              <DifficultyBadge difficulty={field.difficulty as Difficulty} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.50)', lineHeight: 1.65, margin: 0 }}>
                {field.difficulty_reason}
              </p>
            </section>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'sticky', top: 88 }}>

            {/* Quiz CTA card */}
            <div style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(170,255,77,0.22)', background: 'rgba(170,255,77,0.06)', backdropFilter: 'blur(20px)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 10 }}>
                Personalize this
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: '#F5EFE0', letterSpacing: '-0.01em', marginBottom: 6, margin: '0 0 6px' }}>
                How disrupted are you, really?
              </p>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, color: 'rgba(245,239,224,0.50)', lineHeight: 1.65, marginBottom: 16 }}>
                Three questions. An honest score tailored to your specific role.
              </p>
              <Link href={`/learn/paths/quiz?field=${field.slug}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                Take the quiz →
              </Link>
            </div>

            {/* Tools to know */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 14, margin: '0 0 14px' }}>
                Tools to know
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {field.tools.map((tool, i) => (
                  <Link key={i} href="/tools" className="group" style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.03)', display: 'block', textDecoration: 'none', transition: 'border-color 200ms ease, transform 200ms ease' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: '#F5EFE0', letterSpacing: '-0.01em', marginBottom: 4, transition: 'color 150ms ease' }} className="group-hover:text-accent">
                      {tool.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 12, color: 'rgba(245,239,224,0.45)', lineHeight: 1.55, margin: 0 }}>
                      {tool.what_it_does}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Concepts */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 14, margin: '0 0 14px' }}>
                Concepts to understand
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {field.concepts.map((concept, i) => (
                  <Link key={i} href={`/learn/${conceptToSlug(concept)}`} className="tag tag-accent" style={{ textDecoration: 'none' }}>
                    {concept}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <section style={{ borderTop: '1px solid rgba(245,239,224,0.07)', background: 'rgba(255,250,240,0.02)', padding: '48px 48px' }}>
        <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', marginBottom: 6, margin: '0 0 6px' }}>
              Get your personal disruption score
            </p>
            <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13, color: 'rgba(245,239,224,0.45)', margin: 0 }}>
              Based on your specific role within {field.field}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href={`/learn/paths/quiz?field=${field.slug}`} className="btn-primary">
              Run AI impact quiz →
            </Link>
            <Link href="/learn/paths" className="btn-ghost">Explore other fields</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
