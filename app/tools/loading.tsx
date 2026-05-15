export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section className="section-full" style={{ paddingBottom: 0 }}>
        <div className="section-inner" style={{ paddingBottom: 48 }}>
          <span className="skel" style={{ width: 220, height: 10, marginBottom: 18 }} />
          <span className="skel" style={{ width: "min(560px, 60%)", height: 56, marginBottom: 20 }} />
          <span className="skel" style={{ width: "min(640px, 70%)", height: 16, marginBottom: 10 }} />
          <span className="skel" style={{ width: "min(580px, 64%)", height: 16 }} />
        </div>
      </section>
      <section className="section-full" style={{ background: "rgba(16,14,11,0.5)" }}>
        <div className="section-inner" style={{ paddingTop: 48 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "var(--space-5)",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="skel" style={{ width: "100%", height: 220 }} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
