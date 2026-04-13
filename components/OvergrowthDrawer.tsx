"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
};

// ── URL parsing ────────────────────────────────────────────────────────────

function extractUrls(raw: string): string[] {
  return raw
    .split(/[\s\n]+/)
    .map((s) => s.trim())
    .filter((s) => {
      try {
        new URL(s);
        return true;
      } catch {
        return false;
      }
    });
}

// ── Component ──────────────────────────────────────────────────────────────

export default function OvergrowthDrawer({ open, onClose }: Props) {
  const [raw, setRaw]           = useState("");
  const [isPlanting, setPlanting] = useState(false);
  const [planted, setPlanted]   = useState(false);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  const urls    = extractUrls(raw);
  const hasUrls = urls.length > 0;

  // Focus the textarea as soon as the drawer finishes opening.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 380);
      return () => clearTimeout(t);
    }
    // Reset state when the drawer is closed so it's fresh next time.
    if (!open) {
      setRaw("");
      setPlanting(false);
      setPlanted(false);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasUrls || isPlanting) return;

    setPlanting(true);
    setPlanted(false);

    // ── Handoff point ─────────────────────────────────────────────────────
    // TODO: replace console.log with the server action that processes URLs.
    console.log("[Overgrowth] URLs to map:", urls);

    // Simulate async work so the loading state is visible.
    setTimeout(() => {
      setPlanting(false);
      setPlanted(true);
    }, 1800);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="absolute inset-0 z-20 bg-espresso/20 backdrop-blur-[2px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            className="
              absolute inset-y-0 right-0 z-30
              w-full sm:w-[460px] md:w-[500px]
              flex flex-col
              bg-parchment border-l border-moss-200
              shadow-[−8px_0_32px_rgba(44,26,14,0.1)]
              overflow-hidden
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            {/* ── Header ── */}
            <div className="relative flex-shrink-0 px-7 pt-8 pb-6 bg-gradient-to-b from-moss-50/70 to-transparent border-b border-moss-200/60">
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="
                  absolute top-5 right-5
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-forest/40 hover:text-espresso hover:bg-moss-100
                  transition-colors duration-150
                "
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon + eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-moss-500 flex-shrink-0" />
                <p className="font-body text-2xs uppercase tracking-[0.22em] text-moss-500 font-semibold">
                  Ritual Space ✦
                </p>
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl font-bold text-espresso leading-tight mb-3">
                The Overgrowth
              </h2>

              {/* Subtext */}
              <p className="font-body text-sm text-forest/65 leading-relaxed italic max-w-sm">
                Surrender your watch-later lists and bookmarked tutorials.
                We will map the noise so you can find the signal.
              </p>
            </div>

            {/* ── Body ── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 min-h-0 px-7 py-6 gap-5 overflow-y-auto scrollbar-hide"
            >
              {/* Textarea field */}
              <div className="flex flex-col gap-2.5 flex-1 min-h-0">
                <label
                  htmlFor="overgrowth-urls"
                  className="font-body text-2xs uppercase tracking-[0.2em] text-moss-500 font-semibold"
                >
                  Your Links
                </label>

                <textarea
                  id="overgrowth-urls"
                  ref={textareaRef}
                  value={raw}
                  onChange={(e) => {
                    setRaw(e.target.value);
                    setPlanted(false);
                  }}
                  placeholder={
                    "Paste everything here — one link per line, or a whole dump at once.\n\n" +
                    "https://youtube.com/watch?v=...\n" +
                    "https://docs.anthropic.com/...\n" +
                    "https://twitter.com/..."
                  }
                  disabled={isPlanting}
                  className="
                    flex-1 min-h-[200px] w-full resize-none
                    font-body text-sm text-espresso leading-relaxed
                    placeholder:text-forest/30 placeholder:italic
                    bg-parchment/60 rounded-2xl
                    border border-moss-200
                    px-5 py-4
                    focus:outline-none focus:border-moss-400
                    focus:ring-2 focus:ring-moss-200/60
                    transition-colors duration-150
                    disabled:opacity-60
                  "
                />

                {/* Live URL count */}
                <AnimatePresence mode="wait">
                  {raw.trim().length > 0 && (
                    <motion.p
                      key={hasUrls ? "found" : "none"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="font-body text-xs text-forest/50 pl-1"
                    >
                      {hasUrls
                        ? `${urls.length} link${urls.length === 1 ? "" : "s"} detected — ready to map`
                        : "No valid URLs detected yet"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Planted success state */}
              <AnimatePresence>
                {planted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-moss-300 bg-moss-50 px-5 py-4 flex items-start gap-3"
                  >
                    <span className="text-lg mt-0.5 flex-shrink-0">🌱</span>
                    <div className="space-y-0.5">
                      <p className="font-body text-sm font-semibold text-moss-700">
                        Seeds planted.
                      </p>
                      <p className="font-body text-xs text-forest/60">
                        {urls.length} link{urls.length === 1 ? "" : "s"} received.
                        Mapping is ready — check the console for now.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!hasUrls || isPlanting}
                className="
                  flex-shrink-0 w-full flex items-center justify-center gap-2.5
                  font-body font-semibold text-base
                  px-6 py-3.5 rounded-2xl
                  bg-moss-500 text-parchment border border-moss-600
                  hover:bg-moss-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
                whileTap={hasUrls && !isPlanting ? { scale: 0.97 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isPlanting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        🌿
                      </motion.span>
                      Planting seeds…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Map the Garden
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Flavour text */}
              <p className="font-body text-2xs text-forest/35 text-center pb-2 italic">
                The garden takes what it needs. The rest composted quietly.
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
