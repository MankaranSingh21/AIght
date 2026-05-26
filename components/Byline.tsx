import Link from "next/link";

type BylineProps = {
  variant?: "inline" | "block";
  lastUpdated?: string;
};

export default function Byline({ variant = "inline", lastUpdated }: BylineProps) {
  if (variant === "block") {
    return (
      <div
        style={{
          paddingTop: "var(--space-8)",
          borderTop: "1px solid var(--border-subtle)",
          marginTop: "var(--space-8)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-editorial)",
            fontStyle: "italic",
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          by{" "}
          <Link
            href="/author/moon"
            style={{
              color: "var(--accent-secondary)",
              textDecoration: "none",
              fontStyle: "italic",
            }}
          >
            Moon
          </Link>
          {" "}· poet · engineer · third-year CS, Chandigarh University
          {lastUpdated && (
            <>
              {" "}
              <span style={{ opacity: 0.35 }}>·</span>
              {" "}
              <time
                dateTime={lastUpdated}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontStyle: "normal",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                }}
              >
                Updated{" "}
                {new Date(lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </p>
      </div>
    );
  }

  // inline variant (default)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        color: "rgba(245,239,224,0.45)",
      }}
    >
      <Link
        href="/author/moon"
        style={{
          color: "rgba(245,239,224,0.80)",
          textDecoration: "none",
          borderBottom: "1px solid rgba(170,255,77,0.30)",
          paddingBottom: 1,
        }}
      >
        Moon
      </Link>
      {lastUpdated && (
        <>
          <span aria-hidden style={{ opacity: 0.35 }}>·</span>
          <time dateTime={lastUpdated}>
            Updated{" "}
            {new Date(lastUpdated).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </>
      )}
    </div>
  );
}
