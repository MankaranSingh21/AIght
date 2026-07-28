"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import type { PositionedGraph, PositionedNode } from "@/lib/universe-layout";
import { buildIndex } from "@/lib/universe-adjacency";
import { loadQuizResult, QUIZ_CHANGED_EVENT } from "@/lib/quiz-storage";
import { track } from "@/lib/analytics";
import UniverseSVG, { type FilterMode } from "./UniverseSVG";
import UniverseSearch from "./UniverseSearch";

interface Props {
  graph: PositionedGraph;
}

export default function UniverseCanvas({ graph }: Props) {
  const index = useMemo(() => buildIndex(graph), [graph]);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [scale, setScale] = useState(1);
  const [labelMode, setLabelMode] = useState<"auto" | "all">("auto");
  const [userField, setUserField] = useState<{ slug: string; name: string } | null>(null);

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const deepLinked = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Quiz result (enables the "my field" filter + initial centring) ──
  useEffect(() => {
    const refresh = () => {
      const r = loadQuizResult();
      setUserField(r ? { slug: r.fieldSlug, name: r.fieldName } : null);
    };
    refresh();
    window.addEventListener(QUIZ_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(QUIZ_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // ── URL state ──
  const writeUrl = useCallback(
    (next: { node?: string | null; filter?: FilterMode }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (next.node !== undefined) {
        if (next.node) params.set("node", next.node);
        else params.delete("node");
      }
      if (next.filter !== undefined) {
        if (next.filter === "all") params.delete("filter");
        else params.set("filter", next.filter);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const focusNode = useCallback(
    (id: string, via: "click" | "search" | "deeplink") => {
      const node = index.nodeById.get(id);
      if (!node) return;
      setLockedId(id);
      // RZPP takes a DOM id directly — every node <g> carries its node id.
      transformRef.current?.zoomToElement(id, 2.2, 480);
      track("universe_node_opened", { id, kind: node.kind, via });
    },
    [index],
  );

  // Apply ?node= / ?filter= once on mount.
  useEffect(() => {
    if (deepLinked.current) return;
    deepLinked.current = true;
    const f = searchParams?.get("filter") as FilterMode | null;
    if (f && ["field", "concepts", "tools"].includes(f)) setFilter(f);
    const n = searchParams?.get("node");
    if (n && index.nodeById.has(n)) {
      // Wait for the transform to mount before zooming.
      setTimeout(() => focusNode(n, "deeplink"), 120);
    }
  }, [searchParams, index, focusNode]);

  // Escape clears the lock.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && lockedId) {
        setLockedId(null);
        writeUrl({ node: null });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lockedId, writeUrl]);

  // ── Filtering ──
  const visibleIds = useMemo<Set<string> | null>(() => {
    if (filter === "all") return null;
    if (filter === "concepts")
      return new Set(graph.nodes.filter((n) => n.kind === "concept").map((n) => n.id));
    if (filter === "tools")
      return new Set(graph.nodes.filter((n) => n.kind === "tool").map((n) => n.id));
    if (filter === "field" && userField) {
      const fieldId = `field:${userField.slug}`;
      const ids = new Set<string>([fieldId]);
      const direct = index.neighbors.get(fieldId);
      direct?.forEach((id) => ids.add(id));
      // Second degree, concepts only — keeps the neighbourhood readable.
      direct?.forEach((id) => {
        if (id.startsWith("concept:")) {
          index.neighbors.get(id)?.forEach((nbr) => {
            if (nbr.startsWith("concept:")) ids.add(nbr);
          });
        }
      });
      return ids;
    }
    return null;
  }, [filter, userField, graph.nodes, index]);

  function handleNodeClick(e: React.MouseEvent, node: PositionedNode) {
    // Fields lock first (show the neighbourhood), navigate on the second click.
    // Concepts and tools navigate straight away.
    if (node.kind !== "field") {
      track("universe_node_opened", { id: node.id, kind: node.kind, via: "click" });
      return;
    }
    e.preventDefault();
    if (lockedId === node.id) {
      router.push(node.href);
      return;
    }
    focusNode(node.id, "click");
    writeUrl({ node: node.id });
  }

  const FILTERS: { value: FilterMode; label: string; disabled?: boolean }[] = [
    { value: "all", label: "All" },
    {
      value: "field",
      label: userField ? `My field · ${userField.name}` : "My field (take the quiz)",
      disabled: !userField,
    },
    { value: "concepts", label: "Concepts only" },
    { value: "tools", label: "Tools only" },
  ];

  const chipStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.06em",
    padding: "6px 12px",
    borderRadius: 999,
    background: active ? "var(--accent-primary)" : disabled ? "transparent" : "rgba(255,250,240,0.04)",
    color: active ? "var(--text-inverse, #0C0A08)" : disabled ? "var(--text-muted)" : "var(--text-secondary)",
    border: active ? "1px solid var(--accent-primary)" : "1px solid rgba(245,239,224,0.10)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "all 150ms ease",
  });

  const lockedNode = lockedId ? index.nodeById.get(lockedId) : null;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <div role="status" aria-live="polite" className="sr-only-universe">
        {lockedNode ? `${lockedNode.title} focused. Activate again to open.` : ""}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        {FILTERS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              if (opt.disabled) return;
              setFilter(opt.value);
              writeUrl({ filter: opt.value });
              track("universe_filtered", { filter: opt.value });
            }}
            disabled={opt.disabled}
            aria-pressed={filter === opt.value}
            style={chipStyle(filter === opt.value, opt.disabled)}
          >
            {opt.label}
          </button>
        ))}

        <span style={{ flex: 1, minWidth: 12 }} />

        <UniverseSearch
          graph={graph}
          onSelect={(id) => {
            focusNode(id, "search");
            writeUrl({ node: id });
          }}
        />

        <button
          onClick={() => setLabelMode((m) => (m === "auto" ? "all" : "auto"))}
          aria-pressed={labelMode === "all"}
          style={chipStyle(labelMode === "all")}
          title="Show every label regardless of zoom"
        >
          Labels: {labelMode}
        </button>
      </div>

      {/* Canvas */}
      <div
        style={{
          position: "relative",
          height: "min(78vh, 900px)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          overflow: "hidden",
          overscrollBehavior: "contain",
        }}
      >
        <TransformWrapper
          ref={transformRef}
          minScale={0.5}
          maxScale={6}
          initialScale={1}
          centerOnInit
          doubleClick={{ mode: "zoomIn", step: 0.8 }}
          // Plain wheel must keep scrolling the PAGE. Without activationKeys the
          // canvas swallows the wheel and the page appears to freeze over it.
          wheel={{ step: 0.06, activationKeys: ["Control", "Meta"] }}
          panning={{ velocityDisabled: true }}
          onTransform={(_ref, state) => setScale(state.scale)}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <UniverseSVG
                  graph={graph}
                  index={index}
                  hoverId={hoverId}
                  lockedId={lockedId}
                  visibleIds={visibleIds}
                  scale={scale}
                  labelMode={labelMode}
                  onHover={setHoverId}
                  onNodeClick={handleNodeClick}
                />
              </TransformComponent>

              <div
                style={{
                  position: "absolute",
                  right: 14,
                  bottom: 14,
                  display: "flex",
                  gap: 6,
                }}
              >
                {[
                  { label: "−", fn: () => zoomOut(), aria: "Zoom out" },
                  { label: "+", fn: () => zoomIn(), aria: "Zoom in" },
                  { label: "⟲", fn: () => resetTransform(), aria: "Reset view" },
                ].map((b) => (
                  <button
                    key={b.aria}
                    onClick={b.fn}
                    aria-label={b.aria}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(22,18,16,0.9)",
                      border: "1px solid rgba(245,239,224,0.12)",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
        }}
      >
        {[
          { c: "rgba(170,255,77,0.65)", t: "Field" },
          { c: "rgba(0,255,209,0.65)", t: "Concept" },
          { c: "rgba(244,171,31,0.55)", t: "Tool" },
        ].map((l) => (
          <span key={l.t} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: l.c }} />
            {l.t}
          </span>
        ))}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              border: "1px dashed rgba(244,171,31,0.55)",
            }}
          />
          not yet mapped to a concept
        </span>
        <Link href="/learn/paths/quiz" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>
          See your trajectory →
        </Link>
      </div>

      <style>{`
        .sr-only-universe {
          position: absolute; left: -10000px; top: auto;
          width: 1px; height: 1px; overflow: hidden;
        }
      `}</style>
    </div>
  );
}
