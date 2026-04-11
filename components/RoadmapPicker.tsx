"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { createRoadmap } from "@/app/actions/roadmap";

type Roadmap = { id: string; title: string };

type Props = {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onSelect: (roadmapId: string) => void;
};

export default function RoadmapPicker({ open, isPending, onClose, onSelect }: Props) {
  const [roadmaps, setRoadmaps]       = useState<Roadmap[]>([]);
  const [loading, setLoading]         = useState(false);
  const [newTitle, setNewTitle]       = useState("");
  const [isCreating, startCreateTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("roadmaps")
      .select("id, title")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setRoadmaps(data ?? []);
        setLoading(false);
      });
  }, [open]);

  function handleCreateAndAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    startCreateTransition(async () => {
      const result = await createRoadmap(newTitle.trim());
      if (result.error) {
        toast.error("Couldn't create canvas", { description: result.error });
        return;
      }
      if (result.id) {
        // Append to local list so it appears immediately if user cancels the add
        setRoadmaps((prev) => [...prev, { id: result.id!, title: newTitle.trim() }]);
        setNewTitle("");
        onSelect(result.id);
      }
    });
  }

  if (!open) return null;

  const busy = isPending || isCreating;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-espresso/20 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm bg-parchment rounded-3xl border border-moss-200 shadow-card-hover overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-moss-100">
          <p className="font-body text-2xs uppercase tracking-widest text-moss-500 mb-1">
            add to canvas
          </p>
          <h3 className="font-serif text-lg font-bold text-espresso">
            Choose a Roadmap
          </h3>
        </div>

        <div className="py-2 max-h-64 overflow-y-auto scrollbar-hide">
          {loading ? (
            <p className="px-6 py-4 font-body text-sm text-forest/50">Loading…</p>
          ) : roadmaps.length === 0 ? (
            /* ── Inline create flow ─────────────────────────── */
            <div className="px-6 py-5 space-y-4">
              <p className="font-body text-sm text-forest/60 leading-relaxed">
                You don&rsquo;t have any canvases yet. Name one and we&rsquo;ll create it and add this tool in one go.
              </p>
              <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Name your canvas…"
                  autoFocus
                  className="
                    flex-1 min-w-0 font-body text-sm bg-parchment border border-moss-200
                    rounded-xl px-3.5 py-2.5 text-espresso placeholder:text-forest/35
                    focus:outline-none focus:border-moss-400 transition-colors
                  "
                />
                <button
                  type="submit"
                  disabled={busy || !newTitle.trim()}
                  className="
                    font-body text-sm font-semibold px-4 py-2.5 rounded-xl flex-shrink-0
                    bg-moss-500 text-parchment hover:bg-moss-600
                    disabled:opacity-50 transition-colors duration-150
                  "
                >
                  {isCreating ? "…" : "Create & Add"}
                </button>
              </form>
            </div>
          ) : (
            roadmaps.map((rm) => (
              <button
                key={rm.id}
                disabled={busy}
                onClick={() => onSelect(rm.id)}
                className="
                  w-full text-left flex items-center gap-3 px-6 py-3.5
                  hover:bg-moss-50 transition-colors duration-100
                  disabled:opacity-50
                "
              >
                <span className="text-lg">🗺️</span>
                <span className="font-body text-sm text-espresso font-medium flex-1 truncate">
                  {rm.title}
                </span>
                {busy ? (
                  <span className="font-body text-2xs text-forest/40">adding…</span>
                ) : (
                  <span className="font-body text-2xs text-forest/30">→</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer — only shown when the user already has canvases */}
        {!loading && roadmaps.length > 0 && (
          <div className="px-6 py-4 border-t border-moss-100">
            <form onSubmit={handleCreateAndAdd} className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Or create a new canvas…"
                className="
                  flex-1 min-w-0 font-body text-sm bg-parchment border border-moss-200
                  rounded-xl px-3.5 py-2 text-espresso placeholder:text-forest/35
                  focus:outline-none focus:border-moss-400 transition-colors
                "
              />
              <button
                type="submit"
                disabled={busy || !newTitle.trim()}
                className="
                  font-body text-sm font-semibold px-3 py-2 rounded-xl flex-shrink-0
                  bg-moss-100 text-moss-700 hover:bg-moss-200
                  disabled:opacity-50 transition-colors duration-150
                "
              >
                {isCreating ? "…" : "+ New"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
