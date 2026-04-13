"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────

type ToolResult = {
  slug: string;
  name: string;
  emoji: string;
  category: string | null;
  tags: string[];
};

type CatItem  = { type: "cat";  id: string; label: string; emoji: string };
type LinkItem = { type: "link"; id: string; label: string; emoji: string; href: string };
type LeftItem = CatItem | LinkItem;

// ── Constants ──────────────────────────────────────────────────────────────

const QUICK_LINKS: LinkItem[] = [
  { type: "link", id: "ql-tools",    label: "All Tools",   emoji: "✦",  href: "/tools"    },
  { type: "link", id: "ql-roadmaps", label: "My Canvases", emoji: "🗺️", href: "/roadmaps" },
];

const CAT_EMOJI: Record<string, string> = {
  writing:      "✍️",
  coding:       "💻",
  image:        "🎨",
  video:        "🎬",
  audio:        "🎵",
  productivity: "⚡",
  research:     "🔭",
  automation:   "🤖",
  design:       "🎭",
  marketing:    "📣",
  data:         "📊",
  ai:           "✨",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CommandMenu() {
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState("");
  const [tools, setTools]             = useState<ToolResult[]>([]);
  const [activeCatId, setActiveCatId] = useState("all");
  const [leftIdx, setLeftIdx]         = useState(0);
  const [toolIdx, setToolIdx]         = useState(0);
  const [leftFocused, setLeftFocused] = useState(true);
  const inputRef                      = useRef<HTMLInputElement>(null);
  const router                        = useRouter();

  // Fetch tools once on mount
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("tools")
      .select("slug, name, emoji, category, tags")
      .order("name")
      .then(({ data }) => setTools(data ?? []));
  }, []);

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Custom event from Navbar trigger button
  useEffect(() => {
    function onOpen() { setOpen(true); }
    document.addEventListener("open-command-menu", onOpen);
    return () => document.removeEventListener("open-command-menu", onOpen);
  }, []);

  // Reset on close; focus input on open
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveCatId("all");
      setLeftIdx(0);
      setToolIdx(0);
      setLeftFocused(true);
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  // ── Derived data ───────────────────────────────────────────────────────

  const categories = useMemo<CatItem[]>(() => {
    const unique = Array.from(
      new Set(tools.map((t) => t.category).filter(Boolean))
    ) as string[];
    return [
      { type: "cat", id: "all", label: "All Tools", emoji: "✦" },
      ...unique.map((cat) => ({
        type: "cat" as const,
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        emoji: CAT_EMOJI[cat.toLowerCase()] ?? "🔧",
      })),
    ];
  }, [tools]);

  const leftItems = useMemo<LeftItem[]>(
    () => [...QUICK_LINKS, ...categories],
    [categories]
  );

  const isSearching = query.trim().length > 0;

  const filteredTools = useMemo(() => {
    if (!isSearching) return [];
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.category ?? "").toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [tools, query, isSearching]);

  const rightTools = useMemo(
    () => (activeCatId === "all" ? tools : tools.filter((t) => t.category === activeCatId)),
    [tools, activeCatId]
  );

  // ── Keyboard navigation ────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); return; }

      if (isSearching) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setToolIdx((i) => Math.min(i + 1, filteredTools.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setToolIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const t = filteredTools[toolIdx];
          if (t) navigate(`/tool/${t.slug}`);
        }
        return;
      }

      // Two-pane mode
      if (leftFocused) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = Math.min(leftIdx + 1, leftItems.length - 1);
          setLeftIdx(next);
          const item = leftItems[next];
          if (item.type === "cat") setActiveCatId(item.id);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = Math.max(leftIdx - 1, 0);
          setLeftIdx(prev);
          const item = leftItems[prev];
          if (item.type === "cat") setActiveCatId(item.id);
        } else if (e.key === "ArrowRight" || (e.key === "Tab" && !e.shiftKey)) {
          e.preventDefault();
          if (rightTools.length > 0) { setLeftFocused(false); setToolIdx(0); }
        } else if (e.key === "Enter") {
          e.preventDefault();
          const item = leftItems[leftIdx];
          if (item.type === "link") navigate(item.href);
          else if (rightTools.length > 0) { setLeftFocused(false); setToolIdx(0); }
        }
      } else {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setToolIdx((i) => Math.min(i + 1, rightTools.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setToolIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "ArrowLeft" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          setLeftFocused(true);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const t = rightTools[toolIdx];
          if (t) navigate(`/tool/${t.slug}`);
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isSearching, leftFocused, leftIdx, toolIdx, leftItems, rightTools, filteredTools, navigate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-espresso/25 backdrop-blur-sm" />

      {/* Palette card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-parchment rounded-3xl border border-moss-300 shadow-card-hover overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-moss-100">
          <Search className="w-4 h-4 text-moss-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setToolIdx(0); }}
            placeholder="Search tools by name, category, or tag…"
            className="
              flex-1 bg-transparent font-body text-sm text-espresso
              placeholder:text-forest/40 outline-none
            "
          />
          <kbd className="font-body text-2xs text-forest/40 border border-moss-200 rounded-md px-1.5 py-0.5 leading-none">
            esc
          </kbd>
        </div>

        {/* Body — fixed height */}
        <div className="flex overflow-hidden" style={{ height: 360 }}>
          {isSearching ? (
            /* ── Search mode: single flat list ── */
            <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
              {filteredTools.length === 0 ? (
                <div className="py-16 text-center font-body text-sm text-forest/50">
                  No tools found. ✦
                </div>
              ) : (
                filteredTools.map((tool, i) => (
                  <button
                    key={tool.slug}
                    onClick={() => navigate(`/tool/${tool.slug}`)}
                    onMouseEnter={() => setToolIdx(i)}
                    className={`
                      w-full flex items-center gap-3 px-5 py-3
                      transition-colors duration-100 text-left
                      ${i === toolIdx ? "bg-moss-50" : "hover:bg-moss-50/50"}
                    `}
                  >
                    <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-base flex-shrink-0">
                      {tool.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-espresso truncate">{tool.name}</p>
                      {tool.category && (
                        <p className="font-body text-2xs text-forest/50 uppercase tracking-wider">{tool.category}</p>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-forest/30 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          ) : (
            /* ── Two-pane mode ── */
            <>
              {/* Left pane — quick links + categories */}
              <div className="w-[200px] flex-shrink-0 border-r border-moss-100 overflow-y-auto py-2 scrollbar-hide">
                <p className="font-body text-2xs uppercase tracking-[0.2em] text-forest/35 px-4 pb-1 pt-1">
                  Quick Links
                </p>
                {QUICK_LINKS.map((item, i) => {
                  const gIdx   = i;
                  const active = leftIdx === gIdx && leftFocused;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => { setLeftIdx(gIdx); setLeftFocused(true); }}
                      className="relative w-full flex items-center gap-2.5 px-4 py-2.5 text-left"
                    >
                      {active && (
                        <motion.span
                          layoutId="cmd-left-pill"
                          className="absolute inset-0 bg-moss-50"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10 text-base leading-none">{item.emoji}</span>
                      <span className="relative z-10 font-body text-sm text-espresso truncate flex-1">
                        {item.label}
                      </span>
                      <ArrowRight className="relative z-10 w-3 h-3 text-forest/30 flex-shrink-0" />
                    </button>
                  );
                })}

                <p className="font-body text-2xs uppercase tracking-[0.2em] text-forest/35 px-4 pb-1 pt-3">
                  Categories
                </p>
                {categories.map((cat, i) => {
                  const gIdx      = QUICK_LINKS.length + i;
                  const active    = leftIdx === gIdx && leftFocused;
                  const catActive = activeCatId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCatId(cat.id); setLeftIdx(gIdx); setLeftFocused(true); }}
                      onMouseEnter={() => { setActiveCatId(cat.id); setLeftIdx(gIdx); setLeftFocused(true); }}
                      className="relative w-full flex items-center gap-2.5 px-4 py-2.5 text-left"
                    >
                      {active && (
                        <motion.span
                          layoutId="cmd-left-pill"
                          className="absolute inset-0 bg-moss-50"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10 text-base leading-none">{cat.emoji}</span>
                      <span className={`
                        relative z-10 font-body text-sm truncate flex-1
                        ${catActive ? "text-espresso font-medium" : "text-forest/70"}
                      `}>
                        {cat.label}
                      </span>
                      {catActive && (
                        <ChevronRight className="relative z-10 w-3 h-3 text-moss-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right pane — tools for the active category */}
              <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCatId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.14 }}
                  >
                    {rightTools.length === 0 ? (
                      <div className="py-16 text-center font-body text-sm text-forest/50">
                        No tools in this category yet. ✦
                      </div>
                    ) : (
                      rightTools.map((tool, i) => (
                        <button
                          key={tool.slug}
                          onClick={() => navigate(`/tool/${tool.slug}`)}
                          onMouseEnter={() => { setToolIdx(i); setLeftFocused(false); }}
                          className={`
                            w-full flex items-center gap-3 px-5 py-3
                            transition-colors duration-100 text-left
                            ${i === toolIdx && !leftFocused ? "bg-moss-50" : "hover:bg-moss-50/50"}
                          `}
                        >
                          <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-base flex-shrink-0">
                            {tool.emoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium text-espresso truncate">{tool.name}</p>
                            {tool.category && (
                              <p className="font-body text-2xs text-forest/50 uppercase tracking-wider">{tool.category}</p>
                            )}
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-forest/30 flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="border-t border-moss-100 px-5 py-2.5 flex items-center gap-4">
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">↑↓</kbd>
            navigate
          </span>
          {!isSearching && (
            <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
              <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">←→</kbd>
              switch pane
            </span>
          )}
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">↵</kbd>
            open
          </span>
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5 ml-auto">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">esc</kbd>
            close
          </span>
        </div>
      </motion.div>
    </div>
  );
}
