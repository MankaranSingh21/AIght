import type { Metadata } from "next";
import Link from "next/link";
import ConceptCarouselClient from "@/components/learn/ConceptCarouselClient";

export const metadata: Metadata = {
  title: "Learn",
  description: "Honest explanations of the concepts behind the AI tools you use.",
};

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

export default function LearnPage() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

      {/* ── Full-bleed header ────────────────────────────────────────────── */}
      <section className="section-full" style={{ paddingBottom: 0 }}>
        <EdgeOrb top={-60} right={-140} size={550} />
        <EdgeOrb bottom={-40} left={-180} size={400} color="rgba(0,255,209,0.03)" />

        <div className="section-inner" style={{ paddingBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(245,239,224,0.35)", marginBottom: 14,
          }}>
            Learn
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
            Understand the tools you use
          </h1>
          <p style={{
            fontFamily: "var(--font-editorial)",
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(245,239,224,0.55)",
            maxWidth: "52ch",
            fontStyle: "italic",
            margin: 0,
          }}>
            No jargon for its own sake. No sales copy dressed up as explanation.
            Just honest accounts of how these things actually work.
          </p>
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
      </section>

      {/* ── Carousel ────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", background: "rgba(20,17,14,0.45)", overflow: "hidden" }}>
        <EdgeOrb top={60} right={-160} size={500} color="rgba(170,255,77,0.03)" />
        <EdgeOrb bottom={-60} left={-180} size={480} color="rgba(0,255,209,0.025)" />
        <ConceptCarouselClient />
        <div style={{ textAlign: 'center', padding: '0 0 40px', position: 'relative', zIndex: 1 }}>
          <Link href="/learn/map" className="map-explore-link"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12,
                     textDecoration: 'none', letterSpacing: '0.06em' }}>
            Explore the map →
          </Link>
        </div>
      </section>

      {/* ── Bridge section ──────────────────────────────────────────────── */}
      <section style={{
        borderTop: "1px solid rgba(245,239,224,0.07)",
        background: "rgba(255,250,240,0.02)",
        padding: "64px 0",
      }}>
        <div style={{
          maxWidth: "var(--max-width-content)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
          className="learn-bridge-grid"
        >
          {/* Concept map */}
          <Link
            href="/learn/map"
            style={{ textDecoration: "none", display: "block" }}
            className="group"
          >
            <div style={{
              padding: "28px 32px",
              borderRadius: 12,
              border: "1px solid rgba(245,239,224,0.07)",
              background: "rgba(255,250,240,0.03)",
              backdropFilter: "blur(12px)",
              transition: "border-color 200ms ease",
              height: "100%",
            }}
              className="group-hover:border-accent"
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 14,
              }}>
                The landscape
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: "#F5EFE0", letterSpacing: "-0.02em", lineHeight: 1.2,
                margin: "0 0 10px", transition: "color 150ms ease",
              }}
                className="group-hover:text-accent"
              >
                How these concepts connect →
              </h3>
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                fontSize: 14, color: "rgba(245,239,224,0.45)", lineHeight: 1.7, margin: 0,
              }}>
                RAG feeds agents. Embeddings power retrieval. Transformers make it all possible.
                See the map.
              </p>
            </div>
          </Link>

          {/* Field guides */}
          <Link
            href="/learn/paths"
            style={{ textDecoration: "none", display: "block" }}
            className="group"
          >
            <div style={{
              padding: "28px 32px",
              borderRadius: 12,
              border: "1px solid rgba(245,239,224,0.07)",
              background: "rgba(255,250,240,0.03)",
              backdropFilter: "blur(12px)",
              transition: "border-color 200ms ease",
              height: "100%",
            }}
              className="group-hover:border-accent"
            >
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 14,
              }}>
                Field guides
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: "#F5EFE0", letterSpacing: "-0.02em", lineHeight: 1.2,
                margin: "0 0 10px", transition: "color 150ms ease",
              }}
                className="group-hover:text-accent"
              >
                AI in your field →
              </h3>
              <p style={{
                fontFamily: "var(--font-editorial)", fontStyle: "italic",
                fontSize: 14, color: "rgba(245,239,224,0.45)", lineHeight: 1.7, margin: 0,
              }}>
                What these concepts actually mean for medicine, law, design, finance — and 16 other fields.
              </p>
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}
