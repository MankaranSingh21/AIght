export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "96px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 24,
        }}
      >
        <span className="skel" style={{ width: 100, height: 10 }} />
        <span className="skel" style={{ width: "min(520px, 82%)", height: 56 }} />
        <span className="skel" style={{ width: "min(580px, 90%)", height: 18 }} />
        <span className="skel" style={{ width: "min(460px, 72%)", height: 18 }} />
        <span className="skel" style={{ width: 200, height: 44, marginTop: 24, borderRadius: "var(--radius-md)" }} />
      </div>
    </main>
  );
}
