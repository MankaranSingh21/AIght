import Link from "next/link";
import { createServiceClient } from "@/utils/supabase/service";

/**
 * "Tools like this" — semantic neighbours of a given tool.
 *
 * Calls the `match_tools_for_slug` Postgres function (defined in
 * migration 011) which uses pgvector cosine distance against
 * pre-computed embeddings. NO external AI calls at request time —
 * embeddings are generated offline by `scripts/embed-tools.ts`.
 *
 * Renders nothing in three cases (silent, by design):
 *   1. Migration 011 hasn't run yet (function doesn't exist).
 *   2. This tool doesn't have an embedding yet.
 *   3. No neighbours pass the SQL filter (extremely rare).
 *
 * That means this component is safe to ship before embeddings exist —
 * it'll light up automatically once Moon runs `embed-tools.ts --apply`.
 */

interface MatchRow {
  slug: string;
  name: string;
  category: string | null;
  vibe_description: string | null;
  similarity: number;
}

export default async function RelatedTools({
  slug,
  toolName,
  count = 4,
}: {
  slug: string;
  toolName: string;
  count?: number;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("match_tools_for_slug", {
    query_slug: slug,
    match_count: count,
  });

  // Silent fail — migration 011 not applied, or embeddings not computed yet.
  if (error || !data || !Array.isArray(data) || data.length === 0) return null;
  const rows = data as MatchRow[];

  return (
    <section
      style={{
        marginTop: 56,
        paddingTop: 32,
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 6,
        }}
      >
        Tools like {toolName}
      </p>
      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontStyle: "italic",
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: "0 0 20px",
        }}
      >
        Closest neighbours in the archive — semantic similarity, not category match.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {rows.map((r) => (
          <Link
            key={r.slug}
            href={`/tool/${r.slug}`}
            style={{
              textDecoration: "none",
              padding: "var(--space-5)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transition: "border-color 200ms ease, transform 200ms ease",
            }}
            className="group hover:border-accent"
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                  transition: "color 150ms ease",
                }}
                className="group-hover:text-accent"
              >
                {r.name}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--accent-primary)",
                  letterSpacing: "0.06em",
                }}
                aria-label={`Similarity ${Math.round(r.similarity * 100)} percent`}
              >
                {(r.similarity * 100).toFixed(0)}%
              </span>
            </div>
            {r.category && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {r.category}
              </p>
            )}
            {r.vibe_description && (
              <p
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {r.vibe_description}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Discovery CTA: take the highest-similarity neighbour to /compare */}
      <div style={{ marginTop: 16 }}>
        <Link
          href={`/compare?a=${slug}&b=${rows[0].slug}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            color: "var(--accent-secondary)",
            textDecoration: "none",
          }}
        >
          Compare {toolName} vs {rows[0].name} side-by-side →
        </Link>
      </div>
    </section>
  );
}
