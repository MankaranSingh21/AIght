import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-20) var(--space-8)",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-primary)",
            marginBottom: "var(--space-8)",
          }}
        >
          404 · Lost in the archive
        </p>

        {/* Literary couplet — Lora italic, accent-warm */}
        {/* EDIT ME — Moon's couplet */}
        <blockquote
          style={{
            fontFamily: "var(--font-editorial)",
            fontStyle: "italic",
            fontSize: "var(--text-2xl)",
            lineHeight: 1.5,
            color: "var(--accent-warm)",
            maxWidth: "36ch",
            margin: "0 0 var(--space-8)",
            padding: 0,
            border: "none",
          }}
        >
          The page you wanted<br />
          must have gone looking for something too.
        </blockquote>

        {/* Navigation nudge */}
        <p
          style={{
            fontFamily: "var(--font-editorial)",
            fontStyle: "italic",
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-10)",
            maxWidth: "48ch",
          }}
        >
          This page isn&rsquo;t where you left it. Try one of these:
        </p>

        {/* Ghost link buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            justifyContent: "center",
          }}
        >
          <Link href="/learn" className="btn-ghost" style={{ textDecoration: "none" }}>
            Learn
          </Link>
          <Link href="/tools" className="btn-ghost" style={{ textDecoration: "none" }}>
            Tools
          </Link>
          <Link href="/signal" className="btn-ghost" style={{ textDecoration: "none" }}>
            Signal
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
