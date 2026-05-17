import Link from "next/link";
import type { ConceptMeta } from "@/lib/learn";
import fields from "@/content/paths/fields.json";

type Field = (typeof fields)[number];

interface ToolLite { slug: string; name: string }
interface FieldLite { slug: string; field: string }

interface ConceptMiniMapProps {
  concept: ConceptMeta;
  allConcepts: ConceptMeta[];
  exemplarTools: ToolLite[];   // resolved from concept.exemplar_tools by the page
  keyFields?: FieldLite[];     // resolved from concept.key_fields by the page
}

// Compact spatial map for /learn/[slug]. Server-rendered SVG. Tooltips use
// CSS hover on a <g> wrapper — no client JS needed.
//
// Layout (viewBox 720x340):
//   ┌── prerequisites (top row) ─────────────────────────────┐
//   │                                                        │
//   ├─ sibling (left)         CENTER          sibling (right)┤
//   │                                                        │
//   └── exemplar tools (bottom row) ─ misconceptions (corners)┘
export default function ConceptMiniMap({ concept, allConcepts, exemplarTools, keyFields }: ConceptMiniMapProps) {
  const VW = 720;
  const VH = 340;

  // Pull related concepts: prerequisites + successors + related as siblings.
  const prereqs = (concept.prerequisites ?? [])
    .map((s) => allConcepts.find((c) => c.slug === s))
    .filter((c): c is ConceptMeta => Boolean(c))
    .slice(0, 3);

  // "Siblings" = `related` minus prerequisites
  const siblings = (concept.related ?? [])
    .filter((s) => !(concept.prerequisites ?? []).includes(s))
    .map((s) => allConcepts.find((c) => c.slug === s))
    .filter((c): c is ConceptMeta => Boolean(c))
    .slice(0, 4);

  const tools = exemplarTools.slice(0, 4);
  const misconceptions = (concept.misconceptions ?? []).slice(0, 3);

  // Position prerequisites in a top row
  const prereqPositions = prereqs.map((p, i) => {
    const n = prereqs.length;
    const t = n === 1 ? 0.5 : i / (n - 1);
    return { node: p, x: 120 + t * (VW - 240), y: 56 };
  });

  // Position siblings — split left/right
  const siblingPositions = siblings.map((s, i) => {
    const leftSide = i % 2 === 0;
    const stack = Math.floor(i / 2);
    return {
      node: s,
      x: leftSide ? 70 : VW - 70,
      y: 170 + stack * 56,
    };
  });

  // Position exemplar tools in a bottom row
  const toolPositions = tools.map((t, i) => {
    const n = tools.length;
    const tt = n === 1 ? 0.5 : i / (n - 1);
    return { node: t, x: 120 + tt * (VW - 240), y: VH - 56 };
  });

  // Misconceptions at the corners (top-left, top-right, bottom-left)
  const miscPositions = misconceptions.map((m, i) => {
    const slots = [
      { x: 36, y: 22 },
      { x: VW - 36, y: 22 },
      { x: 36, y: VH - 22 },
    ];
    return { text: m, ...slots[i] };
  });

  const center = { x: VW / 2, y: VH / 2 };

  function edgePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
    const dx = b.x - a.x;
    const cx = a.x + dx * 0.5;
    return `M ${a.x} ${a.y} Q ${cx} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;
  }

  return (
    <figure
      style={{
        margin: "0 0 40px",
        padding: "20px 12px 16px",
        background: "rgba(255,250,240,0.02)",
        border: "1px solid rgba(245,239,224,0.07)",
        borderRadius: 14,
        position: "relative",
      }}
      aria-label={`Mini-map for ${concept.title}: prerequisites, related concepts, exemplar tools, and common misconceptions.`}
    >
      <p style={{
        position: "absolute", top: 10, left: 16,
        fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "rgba(245,239,224,0.30)", margin: 0,
      }}>
        Where this idea lives
      </p>

      <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-hidden style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <radialGradient id="cm-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(170,255,77,0.30)" />
            <stop offset="100%" stopColor="rgba(170,255,77,0)" />
          </radialGradient>
        </defs>

        {/* Edges */}
        <g aria-hidden>
          {prereqPositions.map((p, i) => (
            <path key={`pre-edge-${i}`} d={edgePath(p, center)} stroke="rgba(170,255,77,0.35)" strokeWidth="0.8" fill="none" />
          ))}
          {siblingPositions.map((s, i) => (
            <path key={`sib-edge-${i}`} d={edgePath(s, center)} stroke="rgba(0,255,209,0.30)" strokeWidth="0.8" fill="none" strokeDasharray="3 4" />
          ))}
          {toolPositions.map((t, i) => (
            <path key={`tool-edge-${i}`} d={edgePath(t, center)} stroke="rgba(244,171,31,0.30)" strokeWidth="0.8" fill="none" />
          ))}
        </g>

        {/* Band labels */}
        {prereqPositions.length > 0 && (
          <text x={VW / 2} y={20} textAnchor="middle" fontSize="10" letterSpacing="0.15em" fill="rgba(245,239,224,0.30)" style={{ fontFamily: "var(--font-mono), monospace" }}>
            PREREQUISITES
          </text>
        )}
        {toolPositions.length > 0 && (
          <text x={VW / 2} y={VH - 8} textAnchor="middle" fontSize="10" letterSpacing="0.15em" fill="rgba(245,239,224,0.30)" style={{ fontFamily: "var(--font-mono), monospace" }}>
            TOOLS THAT SHOW IT
          </text>
        )}

        {/* Center concept */}
        <g>
          <circle cx={center.x} cy={center.y} r={44} fill="url(#cm-center-glow)" />
          <circle cx={center.x} cy={center.y} r={16} fill="rgba(170,255,77,0.20)" stroke="rgba(170,255,77,0.75)" strokeWidth={1.6} />
          <text x={center.x} y={center.y + 32} textAnchor="middle" fontSize="13" fill="var(--text-primary)" style={{ fontFamily: "var(--font-ui), sans-serif", fontWeight: 600 }}>
            {concept.title}
          </text>
        </g>

        {/* Prerequisites */}
        {prereqPositions.map((p) => (
          <a key={`pre-${p.node.slug}`} href={`/learn/${p.node.slug}`}>
            <g className="cm-node">
              <circle cx={p.x} cy={p.y} r={9} fill="rgba(170,255,77,0.14)" stroke="rgba(170,255,77,0.55)" strokeWidth={1.2} />
              <text x={p.x} y={p.y + 24} textAnchor="middle" fontSize="11" fill="rgba(245,239,224,0.70)" style={{ fontFamily: "var(--font-ui), sans-serif" }}>
                {p.node.title}
              </text>
              <title>{`${p.node.title} — ${p.node.tagline}`}</title>
            </g>
          </a>
        ))}

        {/* Siblings */}
        {siblingPositions.map((s) => (
          <a key={`sib-${s.node.slug}`} href={`/learn/${s.node.slug}`}>
            <g className="cm-node">
              <circle cx={s.x} cy={s.y} r={8} fill="rgba(0,255,209,0.14)" stroke="rgba(0,255,209,0.55)" strokeWidth={1.2} />
              <text
                x={s.x}
                y={s.y + 22}
                textAnchor={s.x < VW / 2 ? "start" : "end"}
                dx={s.x < VW / 2 ? -10 : 10}
                fontSize="11"
                fill="rgba(245,239,224,0.62)"
                style={{ fontFamily: "var(--font-ui), sans-serif" }}
              >
                {s.node.title}
              </text>
              <title>{`${s.node.title} — ${s.node.tagline}`}</title>
            </g>
          </a>
        ))}

        {/* Exemplar tools */}
        {toolPositions.map((t) => (
          <a key={`tool-${t.node.slug}`} href={`/tool/${t.node.slug}`}>
            <g className="cm-node">
              <circle cx={t.x} cy={t.y} r={7} fill="rgba(244,171,31,0.14)" stroke="rgba(244,171,31,0.55)" strokeWidth={1.2} />
              <text x={t.x} y={t.y - 14} textAnchor="middle" fontSize="11" fill="rgba(245,239,224,0.62)" style={{ fontFamily: "var(--font-ui), sans-serif" }}>
                {t.node.name}
              </text>
              <title>{t.node.name}</title>
            </g>
          </a>
        ))}

        {/* Misconceptions — inert visual satellites */}
        {miscPositions.map((m, i) => (
          <g key={`misc-${i}`} className="cm-node" aria-hidden>
            <circle cx={m.x} cy={m.y} r={4} fill="rgba(224,112,112,0.18)" stroke="rgba(224,112,112,0.45)" strokeWidth={1} strokeDasharray="2 2" />
            <title>{`Common misconception: ${m.text}`}</title>
          </g>
        ))}
      </svg>

      {/* Legend + key-field tags */}
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "space-between",
        alignItems: "center", gap: 12, padding: "8px 12px 0",
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "rgba(245,239,224,0.45)",
      }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "rgba(170,255,77,0.65)", marginRight: 6, verticalAlign: "middle" }} />prereqs</span>
          <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "rgba(0,255,209,0.65)", marginRight: 6, verticalAlign: "middle" }} />related</span>
          <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "rgba(244,171,31,0.65)", marginRight: 6, verticalAlign: "middle" }} />tools</span>
          {misconceptions.length > 0 && (
            <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "rgba(224,112,112,0.65)", marginRight: 6, verticalAlign: "middle" }} />misconceptions</span>
          )}
        </div>
        {keyFields && keyFields.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ opacity: 0.6 }}>shows up in:</span>
            {keyFields.slice(0, 4).map((f) => (
              <Link
                key={f.slug}
                href={`/learn/paths/${f.slug}`}
                style={{ color: "var(--accent-primary)", textDecoration: "none", borderBottom: "1px dashed rgba(170,255,77,0.30)" }}
              >
                {f.field}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .cm-node { transition: filter 200ms ease, opacity 200ms ease; }
        .cm-node:hover { filter: brightness(1.4); }
        figure a { text-decoration: none; }
        figure a:hover circle { stroke-width: 2 !important; }
      `}</style>
    </figure>
  );
}
