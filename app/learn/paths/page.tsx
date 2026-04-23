import type { Metadata } from "next";
import Link from "next/link";
import fields from "@/content/paths/fields.json";

export const metadata: Metadata = {
  title: "AI in your field — AIght",
  description:
    "How the tools you're hearing about are reshaping every discipline — and what to do about it.",
};

type Difficulty = "Easy" | "Medium" | "Hard";

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  if (difficulty === "Easy") {
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.07em', padding: '2px 8px', borderRadius: 4, background: 'rgba(170,255,77,0.10)', color: '#AAFF4D', border: '1px solid rgba(170,255,77,0.25)', display: 'inline-flex', alignItems: 'center' }}>
        {difficulty}
      </span>
    );
  }
  if (difficulty === "Medium") {
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.07em', padding: '2px 8px', borderRadius: 4, background: 'rgba(244,171,31,0.10)', color: 'var(--accent-warm)', border: '1px solid rgba(244,171,31,0.25)', display: 'inline-flex', alignItems: 'center' }}>
        {difficulty}
      </span>
    );
  }
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.07em', padding: '2px 8px', borderRadius: 4, background: 'rgba(224,112,112,0.10)', color: 'var(--error)', border: '1px solid rgba(224,112,112,0.25)', display: 'inline-flex', alignItems: 'center' }}>
      {difficulty}
    </span>
  );
}

export default function PathsPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,250,240,0.02)', borderBottom: '1px solid rgba(245,239,224,0.07)', padding: '64px 48px' }}>
        <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end' }} className="paths-header-grid">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 12 }}>
                Field Guides
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 14, margin: '0 0 14px' }}>
                AI in your field
              </h1>
              <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 17, color: 'rgba(245,239,224,0.55)', lineHeight: 1.8, maxWidth: '52ch' }}>
                How the tools you&apos;re hearing about are reshaping every
                discipline — and what to do about it.
              </p>
            </div>

            {/* Quiz CTA panel */}
            <div style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(170,255,77,0.22)', background: 'rgba(170,255,77,0.06)', backdropFilter: 'blur(20px)', minWidth: 220, maxWidth: 280 }} className="quiz-cta-panel">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 10 }}>
                Not sure where you stand?
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: '#F5EFE0', letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: 14 }}>
                Take the AI impact quiz
              </p>
              <Link href="/quiz" className="btn-primary">
                Start quiz →
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 40, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(245,239,224,0.07)', flexWrap: 'wrap' }}>
            {[
              { stat: "72–88%", label: "of organizations using AI in at least one function (McKinsey 2026)" },
              { stat: "~170M",  label: "new or transformed roles created by 2030 (WEF)" },
              { stat: "$13–16T", label: "added to global GDP by 2030 (McKinsey/PwC)" },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#AAFF4D', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>
                  {stat}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(245,239,224,0.35)', maxWidth: '22ch', lineHeight: 1.5 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field cards grid */}
      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {fields.map((field) => (
            <Link
              key={field.slug}
              href={`/learn/paths/${field.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
              className="group glass-card"
            >
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.3, transition: 'color 150ms ease', margin: 0 }}
                    className="group-hover:text-accent">
                    {field.field}
                  </h2>
                  <DifficultyBadge difficulty={field.difficulty as Difficulty} />
                </div>
                <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 13, color: 'rgba(245,239,224,0.50)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>
                  {field.tagline}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#AAFF4D', fontWeight: 500 }}>
                  Explore path →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
