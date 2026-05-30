import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

type SP = Promise<{ status?: string }>;

const COPY: Record<
  "ok" | "invalid" | "error",
  { title: string; body: string; tone: "ok" | "error" }
> = {
  ok: {
    title: "You're out of the signal.",
    body: "Email removed. No more digests will land in your inbox. If this was a mistake, you can sign up again any time from the homepage.",
    tone: "ok",
  },
  invalid: {
    title: "That link looks off.",
    body: "The unsubscribe link was missing or no longer valid. If you'd like to be removed, email hello@aightai.in and I'll do it by hand.",
    tone: "error",
  },
  error: {
    title: "Something went sideways.",
    body: "I couldn't remove that email — likely a brief database hiccup. Try the link again, or email hello@aightai.in and I'll sort it.",
    tone: "error",
  },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: SP }) {
  const { status } = await searchParams;
  const key: "ok" | "invalid" | "error" =
    status === "invalid" || status === "error" ? status : "ok";
  const c = COPY[key];
  const accent = c.tone === "ok" ? "var(--accent-primary)" : "var(--accent-warm)";

  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
        }}
      >
        <article style={{ maxWidth: "var(--max-width-editorial)", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: "var(--space-4)",
            }}
          >
            Unsubscribe
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-4xl)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 var(--space-6)",
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "var(--space-10)",
              maxWidth: "54ch",
            }}
          >
            {c.body}
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
              ← Back to AIght
            </Link>
            <Link href="/about" className="btn-ghost" style={{ textDecoration: "none" }}>
              About the project
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
