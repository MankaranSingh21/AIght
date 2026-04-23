import type { Metadata } from "next";
import ConceptMap from "./ConceptMap";

export const metadata: Metadata = {
  title: "The landscape — AIght",
  description: "Six concepts. Two tracks. Everything connects.",
};

export default function MapPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 'var(--max-width-content)', margin: '0 auto', padding: '64px 48px 96px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#F5EFE0', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
            The landscape
          </h1>
          <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 17, color: 'rgba(245,239,224,0.55)', lineHeight: 1.8 }}>
            Six concepts. Two tracks. Everything connects.
          </p>
        </div>

        {/* Interactive concept map */}
        <ConceptMap />

        {/* Footer note */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,239,224,0.25)', textAlign: 'center', marginTop: 64, letterSpacing: '0.04em' }}>
          More concepts coming — slowly, on purpose.
        </p>

      </div>
    </main>
  );
}
