import type { Metadata } from "next";
import Link from "next/link";
import { getAllConcepts } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Learn — AIght",
  description: "Honest explanations of the concepts behind the AI tools you use.",
};

export default function LearnPage() {
  const concepts = getAllConcepts();

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '64px 48px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 12 }}>
            Learn
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16, margin: '0 0 16px' }}>
            Understand the tools you use
          </h1>
          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 17, lineHeight: 1.8, color: 'rgba(245,239,224,0.55)', maxWidth: '52ch', marginTop: 16 }}>
            No jargon for its own sake. No sales copy dressed up as explanation.
            Just honest accounts of how these things actually work.
          </p>
        </div>

        {/* Concept cards grid */}
        {concepts.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'rgba(245,239,224,0.35)' }}>No concepts yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {concepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/learn/${concept.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
                className="concept-card group"
              >
                <div style={{ padding: 24 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,224,0.30)', marginBottom: 14 }}>
                    Concept
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#F5EFE0', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10, margin: '0 0 10px', transition: 'color 150ms ease' }}
                    className="group-hover:text-accent">
                    {concept.title}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 14, color: 'rgba(245,239,224,0.50)', lineHeight: 1.7, marginBottom: 16 }}>
                    {concept.tagline}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.30)' }}>
                    {concept.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Map link */}
        <div style={{ marginTop: 48 }}>
          <Link
            href="/learn/map"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,224,0.45)', textDecoration: 'none', transition: 'color 150ms ease' }}
            className="hover:text-accent"
          >
            The landscape →
          </Link>
        </div>

      </div>
    </main>
  );
}
