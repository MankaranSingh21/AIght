"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import type { ToolCardProps } from "./ToolCard";

// ── Grid constants (orthographic zoom=80 → 1 unit = 80 px) ───────────────────

const COLS = 3;
const CARD_W = 3.4;   // 272 px
const CARD_H = 2.2;   // 176 px
const GAP_X  = 0.4;   //  32 px
const GAP_Y  = 0.4;   //  32 px
const ZOOM   = 80;
const CARD_W_PX = CARD_W * ZOOM;
const CARD_H_PX = CARD_H * ZOOM;
const GAP_X_PX  = GAP_X  * ZOOM;
const GAP_Y_PX  = GAP_Y  * ZOOM;

// ── Three.js: single card mesh ────────────────────────────────────────────────

function ToolMesh({
  index,
  rows,
  isHovered,
}: {
  index: number;
  rows: number;
  isHovered: boolean;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const cardMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const col   = index % COLS;
  const row   = Math.floor(index / COLS);
  const baseX = (col - (COLS - 1) / 2) * (CARD_W + GAP_X);
  const baseY = ((rows - 1) / 2 - row) * (CARD_H + GAP_Y);

  const hovRef = useRef(false);
  hovRef.current = isHovered;

  useFrame((_, delta) => {
    const g  = groupRef.current;
    const gm = glowMatRef.current;
    const cm = cardMatRef.current;
    if (!g || !gm || !cm) return;

    const t = Math.min(1, delta * 10);
    const h = hovRef.current;

    // Lift the card group
    const targetY = baseY + (h ? 0.12 : 0);
    g.position.y += (targetY - g.position.y) * t;

    // Glow border opacity
    gm.opacity += ((h ? 0.22 : 0) - gm.opacity) * t;

    // Card body colour
    cm.color.lerp(new THREE.Color(h ? "#1e1c18" : "#131110"), t * 0.5);
  });

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]}>
      {/* Glow border (slightly oversized box behind the card) */}
      <RoundedBox args={[CARD_W + 0.1, CARD_H + 0.1, 0.01]} radius={0.14} smoothness={4}>
        <meshBasicMaterial
          ref={glowMatRef}
          color="#AAFF4D"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </RoundedBox>
      {/* Card body */}
      <RoundedBox args={[CARD_W, CARD_H, 0.08]} radius={0.12} smoothness={4}>
        <meshBasicMaterial ref={cardMatRef} color="#131110" />
      </RoundedBox>
    </group>
  );
}

function Scene({
  count,
  rows,
  hoveredIdx,
}: {
  count: number;
  rows: number;
  hoveredIdx: number;
}) {
  return (
    <>
      <OrthographicCamera makeDefault zoom={ZOOM} position={[0, 0, 10]} />
      <ambientLight intensity={1} />
      {Array.from({ length: count }).map((_, i) => (
        <ToolMesh key={i} index={i} rows={rows} isHovered={hoveredIdx === i} />
      ))}
    </>
  );
}

// ── Hover popup ───────────────────────────────────────────────────────────────

function HoverPopup({ tool, x, y }: { tool: ToolCardProps; x: number; y: number }) {
  return (
    <div
      style={{
        position: "fixed",
        left: x + 18,
        top: y + 18,
        zIndex: 8888,
        background: "rgba(20,18,16,0.96)",
        border: "1px solid rgba(170,255,77,0.22)",
        borderRadius: 12,
        padding: "16px 20px",
        maxWidth: 280,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#AAFF4D",
            boxShadow: "0 0 6px rgba(170,255,77,0.6)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 15,
            fontWeight: 600,
            color: "#F5EFE0",
            letterSpacing: "-0.01em",
          }}
        >
          {tool.name}
        </span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-editorial)",
          fontSize: 12,
          lineHeight: 1.65,
          color: "rgba(245,239,224,0.55)",
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {tool.tagline}
      </p>

      {tool.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tool.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag tag-accent" style={{ fontSize: 9 }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#AAFF4D",
            boxShadow: "0 0 5px rgba(170,255,77,0.5)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,239,224,0.30)",
          }}
        >
          Live
        </span>
      </div>
    </div>
  );
}

// ── Detail overlay ────────────────────────────────────────────────────────────

function DetailOverlay({
  tool,
  onClose,
}: {
  tool: ToolCardProps;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(12,10,8,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          background: "rgba(255,250,240,0.04)",
          border: "1px solid rgba(170,255,77,0.18)",
          borderRadius: 20,
          padding: "48px",
          backdropFilter: "blur(40px)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#AAFF4D",
            }}
          >
            {tool.category}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              color: "#F5EFE0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {tool.name}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: 16,
              color: "rgba(245,239,224,0.60)",
              lineHeight: 1.75,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {tool.tagline}
          </p>
        </div>

        {/* Tags */}
        {tool.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tool.tags.map((tag) => (
              <span key={tag} className="tag tag-accent">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#AAFF4D",
              boxShadow: "0 0 8px rgba(170,255,77,0.7)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(245,239,224,0.40)",
            }}
          >
            Live tool
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link
            href={`/tool/${tool.slug}`}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              fontWeight: 500,
              color: "#0C0A08",
              background: "#AAFF4D",
              padding: "12px 24px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 150ms ease",
            }}
            onClick={onClose}
          >
            Full details →
          </Link>
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: 14 }}
            >
              Visit {tool.name} ↗
            </a>
          )}
        </div>

        {/* Dismiss hint */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(245,239,224,0.18)",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          ESC or click outside to dismiss
        </p>
      </div>
    </div>
  );
}

// ── Mobile fallback card ──────────────────────────────────────────────────────

function MobileCard({ tool }: { tool: ToolCardProps }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={`/tool/${tool.slug}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${hov ? "rgba(170,255,77,0.20)" : "rgba(245,239,224,0.07)"}`,
          background: hov ? "rgba(255,250,240,0.05)" : "rgba(255,250,240,0.03)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          transition: "all 200ms ease",
          transform: hov ? "translateY(-2px)" : "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#AAFF4D",
          }}
        >
          {tool.category}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 16,
            fontWeight: 600,
            color: "#F5EFE0",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {tool.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-editorial)",
            fontSize: 13,
            color: "rgba(245,239,224,0.50)",
            lineHeight: 1.65,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {tool.tagline}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag tag-accent">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

type Props = {
  tools: ToolCardProps[];
  itemsPerPage?: number;
};

export default function ToolGrid3D({ tools, itemsPerPage = 12 }: Props) {
  const [page, setPage]             = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [hoveredTool, setHoveredTool] = useState<ToolCardProps | null>(null);
  const [popupPos, setPopupPos]     = useState({ x: 0, y: 0 });
  const [detailTool, setDetailTool] = useState<ToolCardProps | null>(null);
  const [cursorPos, setCursorPos]   = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted]   = useState(false);
  const [isWide, setIsWide]         = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsWide(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset page when tool list changes
  useEffect(() => {
    setPage(0);
    setHoveredIdx(-1);
    setHoveredTool(null);
  }, [tools.length]);

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const pageTools  = tools.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const rows       = Math.ceil(pageTools.length / COLS) || 1;
  const canvasH    = rows * CARD_H_PX + Math.max(0, rows - 1) * GAP_Y_PX + 64;
  const gridW      = COLS * CARD_W_PX + (COLS - 1) * GAP_X_PX; // 880 px

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setPopupPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleHover = useCallback((idx: number, tool: ToolCardProps) => {
    setHoveredIdx(idx);
    setHoveredTool(tool);
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredIdx(-1);
    setHoveredTool(null);
  }, []);

  const handleClick = useCallback((tool: ToolCardProps) => {
    setDetailTool(tool);
  }, []);

  // ── Mobile fallback ──────────────────────────────────────────────────────────

  if (isMounted && !isWide) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {pageTools.map((tool) => (
          <MobileCard key={tool.slug} tool={tool} />
        ))}
      </div>
    );
  }

  // ── SSR / pre-mount placeholder — skeleton grid ──────────────────────────────

  if (!isMounted) {
    const skeletonCount = Math.min(pageTools.length || 6, 6);
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_W_PX}px, 1fr))`, gap: GAP_X_PX }}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="skel"
            style={{ height: CARD_H_PX, borderRadius: 12, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    );
  }

  // ── Desktop 3D grid ──────────────────────────────────────────────────────────

  return (
    <>
      {detailTool && (
        <DetailOverlay tool={detailTool} onClose={() => setDetailTool(null)} />
      )}
      {hoveredTool && (
        <HoverPopup tool={hoveredTool} x={popupPos.x} y={popupPos.y} />
      )}

      <div style={{ width: "100%", position: "relative" }}>
        {/* Custom cursor ring — follows pointer inside the grid */}
        {hoveredTool && (
          <div
            style={{
              position: "fixed",
              left: cursorPos.x - 20,
              top: cursorPos.y - 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1.5px solid rgba(170,255,77,0.65)",
              boxShadow:
                "0 0 14px rgba(170,255,77,0.28), inset 0 0 6px rgba(170,255,77,0.08)",
              pointerEvents: "none",
              zIndex: 8889,
              transition: "opacity 100ms ease",
            }}
          />
        )}

        {/* Grid container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: canvasH,
            overflow: "hidden",
          }}
        >
          {/* Three.js canvas — card backgrounds and glow animations */}
          <Canvas
            style={{ position: "absolute", inset: 0 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Scene
              count={pageTools.length}
              rows={rows}
              hoveredIdx={hoveredIdx}
            />
          </Canvas>

          {/* DOM overlay — card text and pointer events */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseMove={handleMouseMove}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, ${CARD_W_PX}px)`,
                gap: `${GAP_Y_PX}px ${GAP_X_PX}px`,
                width: gridW,
              }}
            >
              {pageTools.map((tool, i) => (
                <div
                  key={tool.slug}
                  style={{
                    width: CARD_W_PX,
                    height: CARD_H_PX,
                    cursor: "pointer",
                    transform:
                      hoveredIdx === i
                        ? "translateY(-9.6px)"
                        : "translateY(0)",
                    transition: "transform 180ms ease",
                    padding: "22px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={() => handleHover(i, tool)}
                  onMouseLeave={handleLeave}
                  onClick={() => handleClick(tool)}
                >
                  {/* Category eyebrow */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#AAFF4D",
                    }}
                  >
                    {tool.category}
                  </span>

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 15,
                      fontWeight: 600,
                      color:
                        hoveredIdx === i ? "#F5EFE0" : "rgba(245,239,224,0.85)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      margin: 0,
                      transition: "color 180ms ease",
                    }}
                  >
                    {tool.name}
                  </h3>

                  {/* Tagline */}
                  <p
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "rgba(245,239,224,0.45)",
                      margin: 0,
                      flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      fontStyle: "italic",
                    }}
                  >
                    {tool.tagline}
                  </p>

                  {/* Tags — .tag.tag-accent as per design system */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="tag tag-accent"
                        style={{ fontSize: 9 }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Live badge */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#AAFF4D",
                        boxShadow: "0 0 5px rgba(170,255,77,0.6)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 8,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(245,239,224,0.25)",
                      }}
                    >
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                padding: "8px 20px",
                borderRadius: 6,
                border: "1px solid rgba(245,239,224,0.09)",
                background: "transparent",
                color:
                  page === 0
                    ? "rgba(245,239,224,0.20)"
                    : "rgba(245,239,224,0.50)",
                cursor: page === 0 ? "default" : "pointer",
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              ← Prev
            </button>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(245,239,224,0.30)",
                letterSpacing: "0.08em",
              }}
            >
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page === totalPages - 1}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                padding: "8px 20px",
                borderRadius: 6,
                border: "1px solid rgba(245,239,224,0.09)",
                background: "transparent",
                color:
                  page === totalPages - 1
                    ? "rgba(245,239,224,0.20)"
                    : "rgba(245,239,224,0.50)",
                cursor: page === totalPages - 1 ? "default" : "pointer",
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
