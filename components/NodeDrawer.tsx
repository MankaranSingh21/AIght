"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { ToolNodeData } from "./ToolNode";
import ToolLogo from "./ToolLogo";
import { useReadOnly } from "./RoadmapIdContext";

// ── Types ──────────────────────────────────────────────────────────────────

type Props = {
  node: Node<ToolNodeData> | null;
  onClose: () => void;
  onStatusChange: (nodeId: string, status: ToolNodeData["status"]) => void;
};

// ── Helpers ────────────────────────────────────────────────────────────────

function toEmbedUrl(url: string): string | null {
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)([a-zA-Z0-9_-]{11})/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return null;
}

// ── Maps ───────────────────────────────────────────────────────────────────

const accentPill: Record<string, string> = {
  moss:     "bg-moss-500 text-parchment",
  amber:    "bg-amber-400 text-espresso",
  lavender: "bg-lavender-400 text-parchment",
};

const STATUS_OPTIONS: {
  value: ToolNodeData["status"];
  label: string;
  idle: string;
  active: string;
}[] = [
  {
    value:  "todo",
    label:  "To Do",
    idle:   "border-forest/20 text-forest/50 hover:bg-espresso/5",
    active: "bg-espresso text-parchment border-espresso",
  },
  {
    value:  "in-progress",
    label:  "In Progress",
    idle:   "border-amber-300 text-amber-700 hover:bg-amber-50",
    active: "bg-amber-400 text-espresso border-amber-400",
  },
  {
    value:  "done",
    label:  "Done ✓",
    idle:   "border-moss-300 text-moss-700 hover:bg-moss-50",
    active: "bg-moss-500 text-parchment border-moss-500",
  },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function NodeDrawer({ node, onClose, onStatusChange }: Props) {
  const readOnly = useReadOnly();
  const [tutorialsOpen, setTutorialsOpen] = useState(false);

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="absolute inset-0 bg-espresso/20 md:hidden z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            aria-label={`Details for ${node.data.label}`}
            className="
              absolute top-0 right-0 bottom-0 z-20
              w-[360px] max-w-[90vw]
              bg-parchment border-l border-moss-200 shadow-[−4px_0_24px_rgba(44,26,14,0.08)]
              flex flex-col overflow-hidden
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-moss-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  <ToolLogo url={node.data.url} emoji={node.data.emoji} size={44} className="rounded-xl" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-base font-bold text-espresso leading-tight truncate">
                    {node.data.label}
                  </h2>
                  <span className={`mt-1 inline-block text-2xs font-body font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${accentPill[node.data.accent] ?? accentPill.moss}`}>
                    {node.data.category}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-moss-100 text-forest/40 hover:text-espresso transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">

              {/* Why this tool */}
              {node.data.rationale && (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold mb-2">
                    ✦ Why this tool
                  </p>
                  <p className="font-body text-sm text-espresso/80 leading-relaxed">
                    {node.data.rationale}
                  </p>
                </section>
              )}

              {/* ── Primary content: contextual mission OR generic guide fallback ── */}
              {node.data.step_instructions ? (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-amber-700 font-semibold mb-2">
                    ✦ Your Mission
                  </p>
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3.5">
                    <p className="font-body text-sm text-espresso/90 leading-relaxed">
                      {node.data.step_instructions}
                    </p>
                  </div>
                </section>
              ) : node.data.learning_guide ? (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold mb-2">
                    ✦ How to use it
                  </p>
                  <p className="font-body text-sm text-forest/80 leading-relaxed">
                    {node.data.learning_guide}
                  </p>
                </section>
              ) : null}

              {/* ── Collapsible general tutorials (only when step_instructions takes the spotlight) ── */}
              {node.data.step_instructions &&
                (node.data.learning_guide || (node.data.video_url && toEmbedUrl(node.data.video_url))) && (
                <section>
                  <button
                    onClick={() => setTutorialsOpen((o) => !o)}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold group-hover:text-moss-800 transition-colors duration-150">
                      ✦ General Tutorials
                    </p>
                    <motion.span
                      animate={{ rotate: tutorialsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-forest/40 text-xs leading-none"
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {tutorialsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-4">
                          {node.data.learning_guide && (
                            <p className="font-body text-sm text-forest/70 leading-relaxed">
                              {node.data.learning_guide}
                            </p>
                          )}
                          {node.data.video_url && toEmbedUrl(node.data.video_url) && (
                            <div className="relative w-full rounded-2xl overflow-hidden border border-moss-100" style={{ paddingBottom: "56.25%" }}>
                              <iframe
                                src={toEmbedUrl(node.data.video_url)!}
                                title={`${node.data.label} tutorial`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )}

              {/* ── Standalone video (when no step_instructions to take priority) ── */}
              {!node.data.step_instructions && node.data.video_url && toEmbedUrl(node.data.video_url) && (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold mb-2">
                    ✦ Watch
                  </p>
                  <div className="relative w-full rounded-2xl overflow-hidden border border-moss-100" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={toEmbedUrl(node.data.video_url)!}
                      title={`${node.data.label} tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </section>
              )}

              {/* Progress status toggle */}
              {!readOnly && (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold mb-3">
                    ✦ Progress
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => onStatusChange(node.id, opt.value)}
                        className={`
                          py-2.5 rounded-xl text-2xs font-body font-semibold border
                          transition-all duration-150
                          ${node.data.status === opt.value ? opt.active : opt.idle}
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Read-only status display */}
              {readOnly && node.data.status && (
                <section>
                  <p className="font-body text-2xs uppercase tracking-widest text-moss-600 font-semibold mb-2">
                    ✦ Progress
                  </p>
                  {(() => {
                    const opt = STATUS_OPTIONS.find((o) => o.value === node.data.status);
                    return opt ? (
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-2xs font-body font-semibold border ${opt.active}`}>
                        {opt.label}
                      </span>
                    ) : null;
                  })()}
                </section>
              )}
            </div>

            {/* ── Footer — Launch button ── */}
            {node.data.url && (
              <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-moss-100">
                <motion.a
                  href={node.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2 w-full
                    font-body text-sm font-semibold
                    py-3 rounded-2xl
                    bg-moss-500 hover:bg-moss-600 text-parchment
                    transition-colors duration-150
                  "
                  whileTap={{ scale: 0.98 }}
                >
                  Launch Tool ↗
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
