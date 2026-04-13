"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import posthog from "posthog-js";
import { createRoadmap } from "@/app/actions/roadmap";
import { generateRoadmapFromPrompt } from "@/app/actions/ai-curator";

type RoadmapRow = {
  id: string;
  title: string;
  created_at: string;
  nodeCount: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 26 } },
};

// ── AI Curator Bar ─────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  "I want to build a SaaS MVP as a solo developer",
  "I need to do deep research and synthesise long documents",
  "I want to create AI-generated art and sell prints",
  "I want to automate my writing workflow",
];

function AICuratorBar() {
  const [prompt, setPrompt]           = useState("");
  const [isGenerating, startGenerate] = useTransition();
  const router = useRouter();

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    startGenerate(async () => {
      const toastId = toast.loading("Asking Gemini to curate your roadmap…");
      const result  = await generateRoadmapFromPrompt(prompt.trim());

      if (result.error) {
        toast.error("Generation failed", { id: toastId, description: result.error });
        return;
      }

      posthog.capture("roadmap_generated", { prompt: prompt.trim() });
      toast.success(`"${result.title}" is ready ✦`, { id: toastId });
      router.push(`/roadmaps/${result.roadmapId}`);
    });
  }

  return (
    <div className="rounded-4xl border border-moss-200 bg-gradient-to-br from-moss-50 via-parchment to-amber-50 p-7 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-moss-500" />
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500 font-semibold">
            AI Curator ✦
          </p>
        </div>
        <h2 className="font-serif text-2xl font-bold text-espresso">
          Describe your goal. Get a roadmap.
        </h2>
        <p className="font-body text-sm text-forest/60">
          Gemini picks the best tools from our library and wires them into a pipeline — instantly.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I want to build a SaaS MVP as a solo developer…"
            disabled={isGenerating}
            className="
              flex-1 font-body text-sm bg-parchment border border-moss-200 rounded-2xl
              px-5 py-3.5 text-espresso placeholder:text-forest/35
              focus:outline-none focus:border-moss-400 transition-colors
              disabled:opacity-60
            "
          />
          <motion.button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="
              flex items-center gap-2.5 font-body text-sm font-semibold
              px-6 py-3.5 rounded-2xl flex-shrink-0
              bg-moss-500 text-parchment border border-moss-600
              hover:bg-moss-600 disabled:opacity-50
              transition-colors duration-150
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isGenerating ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    ✦
                  </motion.span>
                  Curating…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              disabled={isGenerating}
              className="
                font-body text-xs text-forest/60 hover:text-forest
                px-3 py-1.5 rounded-full border border-moss-200
                hover:border-moss-300 hover:bg-moss-50
                transition-colors duration-150 disabled:opacity-40
              "
            >
              {ex}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function RoadmapDashboard({ roadmaps }: { roadmaps: RoadmapRow[] }) {
  const [title, setTitle]            = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError]            = useState<string | null>(null);
  const router = useRouter();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await createRoadmap(title.trim());
      if (result.error) {
        setError(result.error);
      } else if (result.id) {
        setTitle("");
        router.push(`/roadmaps/${result.id}`);
      }
    });
  }

  return (
    <div className="space-y-10">
      {/* AI Curator */}
      <AICuratorBar />

      {/* Divider */}
      <div className="flex items-center gap-4 text-forest/30">
        <div className="flex-1 h-px bg-moss-100" />
        <span className="font-body text-xs uppercase tracking-widest">or start from scratch</span>
        <div className="flex-1 h-px bg-moss-100" />
      </div>

      {/* Manual create */}
      <form onSubmit={handleCreate} className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name your new canvas…"
          className="
            flex-1 font-body text-sm bg-parchment border border-moss-200 rounded-2xl
            px-5 py-3 text-espresso placeholder:text-forest/40
            focus:outline-none focus:border-moss-400 transition-colors
          "
        />
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="
            font-body text-sm font-semibold px-6 py-3 rounded-2xl
            bg-parchment text-forest border border-moss-200 hover:bg-moss-50
            disabled:opacity-50 transition-colors duration-150 flex-shrink-0
          "
        >
          {isPending ? "Creating…" : "+ Create Canvas"}
        </button>
      </form>

      {error && <p className="font-body text-sm text-red-600">{error}</p>}

      {/* Canvas grid */}
      {roadmaps.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="font-serif text-2xl font-semibold text-espresso/40">
            No canvases yet.
          </p>
          <p className="font-body text-sm text-forest/40">
            Use the AI Curator above or create a blank canvas. ✦
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {roadmaps.map((rm) => (
            <motion.div key={rm.id} variants={cardVariants}>
              <Link href={`/roadmaps/${rm.id}`} className="block group">
                <div className="
                  rounded-3xl border border-moss-200 bg-parchment shadow-card
                  hover:border-moss-400 hover:shadow-card-hover
                  transition-all duration-200 overflow-hidden
                ">
                  <div className="h-1.5 bg-gradient-to-r from-moss-200 to-amber-100 opacity-70" />

                  <div className="px-6 py-5 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-espresso group-hover:text-moss-700 transition-colors duration-150 leading-snug line-clamp-2">
                      {rm.title}
                    </h3>
                    <div className="flex items-center gap-4 font-body text-xs text-forest/50">
                      <span>{rm.nodeCount} {rm.nodeCount === 1 ? "tool" : "tools"}</span>
                      <span>·</span>
                      <span>
                        {new Date(rm.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-5">
                    <span className="
                      font-body text-xs font-semibold uppercase tracking-widest
                      text-moss-500 group-hover:text-moss-700 transition-colors
                    ">
                      Open Canvas →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
