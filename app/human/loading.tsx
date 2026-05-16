export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "var(--space-20) var(--space-8)" }}>
      <div style={{ maxWidth: "var(--max-width-editorial)", margin: "0 auto" }}>
        <span className="skel" style={{ width: 200, height: 10, marginBottom: 18 }} />
        <span className="skel" style={{ width: "min(540px, 80%)", height: 52, marginBottom: 16 }} />
        <span className="skel" style={{ width: "min(580px, 84%)", height: 18, marginBottom: 56 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none", borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="skel" style={{ width: 80, height: 10, marginBottom: 10 }} />
            <span className="skel" style={{ width: "min(360px, 60%)", height: 26, marginBottom: 10 }} />
            <span className="skel" style={{ width: "min(540px, 80%)", height: 14 }} />
          </div>
        ))}
      </div>
    </main>
  );
}
