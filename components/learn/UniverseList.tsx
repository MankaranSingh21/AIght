import Link from "next/link";
import type { PositionedGraph } from "@/lib/universe-layout";

/**
 * The universe as a plain, navigable tree.
 *
 * This is not a consolation prize for the canvas — it is the primary way to
 * actually get somewhere, and on mobile it renders first. A 141-node graph is
 * a thing to explore, not a navigation control you want to pinch-zoom on a
 * phone. It also means the page works with JavaScript disabled and gives
 * crawlers every link, which the SVG-only version could not guarantee.
 *
 * Server component — no state, no interactivity beyond <details>.
 */
export default function UniverseList({ graph }: { graph: PositionedGraph }) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));

  const fields = graph.nodes.filter((n) => n.kind === "field");

  // field id -> ordered concept ids, following the curated roadmap sequence.
  const conceptsFor = new Map<string, { id: string; track: string; order: number }[]>();
  const toolsFor = new Map<string, string[]>();

  for (const e of graph.edges) {
    if (e.source === "field-concept-path") {
      const field = e.from.startsWith("field:") ? e.from : e.to;
      const concept = e.from.startsWith("concept:") ? e.from : e.to;
      const list = conceptsFor.get(field) ?? [];
      list.push({ id: concept, track: e.track ?? "intuitions", order: e.order ?? 0 });
      conceptsFor.set(field, list);
    } else if (e.source === "field-tool") {
      const field = e.from.startsWith("field:") ? e.from : e.to;
      const tool = e.from.startsWith("tool:") ? e.from : e.to;
      toolsFor.set(field, [...(toolsFor.get(field) ?? []), tool]);
    }
  }

  // Complete rosters, so every node has a server-rendered link somewhere.
  const conceptsByGroup = new Map<string, typeof graph.nodes>();
  for (const n of graph.nodes) {
    if (n.kind !== "concept") continue;
    const g = n.group ?? "Other";
    conceptsByGroup.set(g, [...(conceptsByGroup.get(g) ?? []), n]);
  }
  const toolsByCategory = new Map<string, typeof graph.nodes>();
  for (const n of graph.nodes) {
    if (n.kind !== "tool") continue;
    const c = n.category ?? "OTHER";
    toolsByCategory.set(c, [...(toolsByCategory.get(c) ?? []), n]);
  }

  const linkStyle: React.CSSProperties = {
    color: "var(--accent-secondary)",
    textDecoration: "none",
    fontSize: 14,
  };

  const panel: React.CSSProperties = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: "12px 16px",
  };

  const summaryStyle: React.CSSProperties = {
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
    fontSize: 15,
    fontWeight: 500,
    color: "var(--text-primary)",
  };

  const countStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text-muted)",
    marginLeft: 10,
    letterSpacing: "0.08em",
  };

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    margin: "0 0 6px",
  };

  const listStyle: React.CSSProperties = {
    margin: 0,
    paddingLeft: 18,
    display: "grid",
    gap: 4,
  };

  return (
    <section
      id="universe-list"
      style={{
        maxWidth: "var(--max-width-content)",
        margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 48px)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 16,
        }}
      >
        Browse as a list
      </h2>

      <div style={{ display: "grid", gap: 8 }}>
        {fields.map((field) => {
          const concepts = (conceptsFor.get(field.id) ?? []).sort(
            (a, b) => a.track.localeCompare(b.track) || a.order - b.order,
          );
          const tools = toolsFor.get(field.id) ?? [];

          return (
            <details
              key={field.id}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "12px 16px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {field.title}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    marginLeft: 10,
                    letterSpacing: "0.08em",
                  }}
                >
                  {concepts.length} concepts · {tools.length} tools
                </span>
              </summary>

              <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                <p style={{ margin: 0 }}>
                  <Link href={field.href} style={{ ...linkStyle, color: "var(--accent-primary)" }}>
                    Open the {field.title} field guide →
                  </Link>
                </p>

                {(["intuitions", "deeper"] as const).map((track) => {
                  const inTrack = concepts.filter((c) => c.track === track);
                  if (!inTrack.length) return null;
                  return (
                    <div key={track}>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          margin: "0 0 6px",
                        }}
                      >
                        {track === "intuitions" ? "Start here" : "Goes deeper"}
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                        {inTrack.map((c) => {
                          const node = byId.get(c.id);
                          if (!node) return null;
                          return (
                            <li key={c.id}>
                              <Link href={node.href} style={linkStyle}>
                                {node.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}

                {tools.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        margin: "0 0 6px",
                      }}
                    >
                      Tools
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                      {tools.map((id) => {
                        const node = byId.get(id);
                        if (!node) return null;
                        return (
                          <li key={id}>
                            <Link href={node.href} style={linkStyle}>
                              {node.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          );
        })}

        {/*
          The per-field tree above only reaches nodes that a field curates —
          40 of 59 concepts and 38 of 60 tools. The canvas renders the rest, but
          it is client-only (useSearchParams keeps the page statically
          prerenderable), so without these two sections the remaining nodes
          would exist in no server-rendered HTML at all: invisible to crawlers
          and unreachable with JavaScript off.
        */}
        <details style={panel}>
          <summary style={summaryStyle}>
            Every concept
            <span style={countStyle}>{conceptsByGroup.size} groups</span>
          </summary>
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {[...conceptsByGroup.entries()].map(([group, list]) => (
              <div key={group}>
                <p style={eyebrow}>{group}</p>
                <ul style={listStyle}>
                  {list.map((n) => (
                    <li key={n.id}>
                      <Link href={n.href} style={linkStyle}>
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        <details style={panel}>
          <summary style={summaryStyle}>
            Every tool
            <span style={countStyle}>{toolsByCategory.size} categories</span>
          </summary>
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {[...toolsByCategory.entries()].map(([cat, list]) => (
              <div key={cat}>
                <p style={eyebrow}>{cat}</p>
                <ul style={listStyle}>
                  {list.map((n) => (
                    <li key={n.id}>
                      <Link href={n.href} style={linkStyle}>
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
