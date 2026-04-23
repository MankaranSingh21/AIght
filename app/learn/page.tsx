import type { Metadata } from "next";
import Link from "next/link";
import { getAllConcepts } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Learn — AIght",
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
  const concepts = getAllConcepts();

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

      {/* ── Concept cards grid ───────────────────────────────────────────── */}
      <section
        className="section-full"
        style={{ background: "rgba(20,17,14,0.45)" }}
      >
        <EdgeOrb top={60} right={-160} size={500} color="rgba(170,255,77,0.03)" />
        <EdgeOrb bottom={-60} left={-180} size={480} color="rgba(0,255,209,0.025)" />

        <div className="section-inner">
          {concepts.length === 0 ? (
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "rgba(245,239,224,0.35)" }}>
              No concepts yet.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {concepts.map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/learn/${concept.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                  className="concept-card group"
                >
                  <div style={{ padding: 28 }}>
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
                      textTransform: "uppercase", color: "rgba(245,239,224,0.30)", marginBottom: 14,
                    }}>
                      Concept
                    </p>
                    <h2
                      className="group-hover:text-accent"
                      style={{
                        fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                        color: "#F5EFE0", letterSpacing: "-0.02em", lineHeight: 1.2,
                        margin: "0 0 12px", transition: "color 150ms ease",
                      }}
                    >
                      {concept.title}
                    </h2>
                    <p style={{
                      fontFamily: "var(--font-editorial)", fontStyle: "italic",
                      fontSize: 14, color: "rgba(245,239,224,0.50)", lineHeight: 1.7, marginBottom: 18,
                    }}>
                      {concept.tagline}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(245,239,224,0.28)" }}>
                      {concept.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/learn/paths" className="btn-ghost">
              AI in your field →
            </Link>
            <Link
              href="/learn/map"
              style={{
                fontFamily: "var(--font-ui)", fontSize: 13, color: "rgba(245,239,224,0.45)",
                textDecoration: "none", transition: "color 150ms ease",
              }}
              className="hover:text-accent"
            >
              The landscape →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
