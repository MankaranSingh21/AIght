export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "80px 48px 96px",
        }}
      >
        <span className="skel" style={{ width: 120, height: 10, marginBottom: 18 }} />
        <span className="skel" style={{ width: "min(620px, 80%)", height: 56, marginBottom: 16 }} />
        <span className="skel" style={{ width: "min(560px, 76%)", height: 18, marginBottom: 56 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-5)",
            marginBottom: 56,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="skel" style={{ width: "100%", height: 140 }} />
          ))}
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="skel"
            style={{ width: i % 2 === 0 ? "98%" : "88%", height: 16, marginBottom: 14 }}
          />
        ))}
      </div>
    </main>
  );
}
