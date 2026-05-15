export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div
        style={{
          maxWidth: "var(--max-width-editorial)",
          margin: "0 auto",
          padding: "80px 48px 96px",
        }}
      >
        <span className="skel" style={{ width: 100, height: 10, marginBottom: 18 }} />
        <span className="skel" style={{ width: "min(540px, 80%)", height: 52, marginBottom: 16 }} />
        <span className="skel" style={{ width: "min(620px, 90%)", height: 18, marginBottom: 8 }} />
        <span className="skel" style={{ width: "min(440px, 64%)", height: 14, marginBottom: 56 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="skel"
            style={{ width: i % 2 === 0 ? "100%" : "92%", height: 16, marginBottom: 14 }}
          />
        ))}
        <span className="skel" style={{ width: "100%", height: 320, marginTop: 40, borderRadius: "var(--radius-xl)" }} />
      </div>
    </main>
  );
}
