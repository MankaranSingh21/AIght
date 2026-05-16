import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/Footer";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your AIght account — bookmarks, quiz result, and reading trajectory.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/account");

  const [{ data: quizResult }, { data: bookmarks }, { data: profile }] = await Promise.all([
    supabase.from("user_quiz_results").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_bookmarks").select("tool_slug, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "var(--bg-base)",
          padding: "var(--space-20) var(--space-8)",
        }}
      >
        <article
          style={{
            maxWidth: "var(--max-width-editorial)",
            margin: "0 auto",
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--accent-primary)", marginBottom: "var(--space-3)",
          }}>
            Your account
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)",
            fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1,
            color: "var(--text-primary)", marginBottom: "var(--space-3)",
          }}>
            {profile?.display_name ?? user.email}
          </h1>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
            color: "var(--text-muted)", marginBottom: "var(--space-12)",
          }}>
            {user.email} · Member since {memberSince}
          </p>

          {/* Quiz result */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--text-muted)", marginBottom: "var(--space-4)",
            }}>
              Quiz result
            </h2>
            {quizResult ? (
              <div style={{
                padding: "20px 24px", borderRadius: 12,
                background: "rgba(170,255,77,0.04)",
                border: "1px solid rgba(170,255,77,0.18)",
              }}>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
                  color: "var(--text-primary)", margin: "0 0 8px",
                }}>
                  {quizResult.field_name}
                  {quizResult.role_title ? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {quizResult.role_title}</span> : null}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                  Score {quizResult.score} · {quizResult.category} risk · taken {new Date(quizResult.taken_at).toLocaleDateString()}
                </p>
                <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
                  <Link href="/learn/map" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-primary)", textDecoration: "none", letterSpacing: "0.08em" }}>
                    See your trajectory →
                  </Link>
                  <Link href="/learn/paths/quiz" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.08em" }}>
                    Retake
                  </Link>
                </div>
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--text-secondary)" }}>
                You haven&rsquo;t taken the quiz yet. <Link href="/learn/paths/quiz" style={{ color: "var(--accent-primary)" }}>Take it →</Link>
              </p>
            )}
          </section>

          {/* Bookmarks */}
          <section style={{ marginBottom: "var(--space-12)" }}>
            <h2 style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--text-muted)", marginBottom: "var(--space-4)",
            }}>
              Saved tools · {bookmarks?.length ?? 0}
            </h2>
            {bookmarks && bookmarks.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {bookmarks.slice(0, 12).map((b) => (
                  <li key={b.tool_slug}>
                    <Link
                      href={`/tool/${b.tool_slug}`}
                      style={{
                        display: "block", padding: "10px 14px",
                        background: "var(--bg-elevated)", borderRadius: 8,
                        fontFamily: "var(--font-ui)", fontSize: 14,
                        color: "var(--text-primary)", textDecoration: "none",
                        borderLeft: "2px solid var(--accent-primary)",
                      }}
                    >
                      {b.tool_slug}
                    </Link>
                  </li>
                ))}
                {bookmarks.length > 12 && (
                  <Link href="/bookmarks" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-primary)", textDecoration: "none", marginTop: 4 }}>
                    See all {bookmarks.length} →
                  </Link>
                )}
              </ul>
            ) : (
              <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--text-secondary)" }}>
                Nothing saved yet. <Link href="/tools" style={{ color: "var(--accent-primary)" }}>Browse the archive →</Link>
              </p>
            )}
          </section>

          {/* Sign out */}
          <section style={{ marginTop: "var(--space-16)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--border-subtle)" }}>
            <SignOutButton />
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
