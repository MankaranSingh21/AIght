export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 48px 96px",
        }}
      >
        <span className="skel" style={{ width: 140, height: 10, marginBottom: 18 }} />
        <span className="skel" style={{ width: "min(420px, 70%)", height: 60, marginBottom: 16 }} />
        <span className="skel" style={{ width: "min(560px, 84%)", height: 18, marginBottom: 56 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="skel"
            style={{ width: i % 2 === 0 ? "100%" : "90%", height: 16, marginBottom: 14 }}
          />
        ))}
      </div>
    </main>
  );
}
