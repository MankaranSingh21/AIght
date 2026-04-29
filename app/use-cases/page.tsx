import type { Metadata } from "next";
import { getAllUseCases } from "@/lib/use-cases";
import Footer from "@/components/Footer";
import UseCaseList from "@/components/UseCaseList";

export const metadata: Metadata = {
  title: "Use Cases — AIght",
  description: "Browse AI tools by what you're actually trying to do. Twelve real jobs, curated tool recommendations for each.",
};

function EdgeOrb({ top, bottom, left, right, size = 500, color = "rgba(170,255,77,0.04)" }: {
  top?: number | string; bottom?: number | string;
  left?: number | string; right?: number | string;
  size?: number; color?: string;
}) {
  return (
    <div aria-hidden style={{
      position: "absolute", top, bottom, left, right,
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(80px)", pointerEvents: "none",
    }} />
  );
}

export default function UseCasesPage() {
  const useCases = getAllUseCases();

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <section className="section-full" style={{ paddingBottom: 0, position: "relative", overflow: "hidden" }}>
          <EdgeOrb top={-60} right={-120} size={560} />
          <EdgeOrb bottom={0} left={-160} size={400} color="rgba(0,255,209,0.03)" />

          <div className="section-inner" style={{ paddingBottom: 64 }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 16,
            }}>
              find the right tool for the job
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 6vw, 68px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 20px",
              maxWidth: "14ch",
            }}>
              What are you trying to do?
            </h1>
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 17,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: "50ch",
              fontStyle: "italic",
              margin: 0,
            }}>
              Twelve real jobs. Tools chosen for each — not by category, but by whether they actually help.
            </p>
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,239,224,0.08) 20%, rgba(245,239,224,0.08) 80%, transparent)" }} />
        </section>

        {/* Use case list */}
        <section className="section-full">
          <div className="section-inner" style={{ paddingTop: 0 }}>
            <UseCaseList useCases={useCases} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
