export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div
        style={{
          maxWidth: "var(--max-width-editorial)",
          margin: "0 auto",
          padding: "64px 48px 96px",
        }}
      >
        <div style={{ marginBottom: 56, paddingBottom: 32, borderBottom: "1px solid rgba(245,239,224,0.07)" }}>
          <span className="skel" style={{ width: 80, height: 10, marginBottom: 12 }} />
          <span className="skel" style={{ width: "min(440px, 70%)", height: 44, marginBottom: 16 }} />
          <span className="skel" style={{ width: "min(560px, 80%)", height: 16 }} />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ padding: "28px 0", borderBottom: "1px solid rgba(245,239,224,0.07)" }}>
            <span className="skel" style={{ width: 88, height: 10, marginBottom: 10 }} />
            <span className="skel" style={{ width: `${68 + i * 5}%`, height: 22, marginBottom: 10 }} />
            <span className="skel" style={{ width: "94%", height: 14, marginBottom: 6 }} />
            <span className="skel" style={{ width: "80%", height: 14 }} />
          </div>
        ))}
      </div>
    </main>
  );
}
