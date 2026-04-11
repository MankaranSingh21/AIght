"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateToolContent } from "@/app/actions/admin";

type AdminTool = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  emoji: string;
  video_url: string | null;
  learning_guide: string | null;
};

type EditState = {
  videoUrl: string;
  learningGuide: string;
  error: string | null;
  saved: boolean;
};

export default function AdminToolList({ tools }: { tools: AdminTool[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>(() =>
    Object.fromEntries(
      tools.map((t) => [
        t.id,
        {
          videoUrl: t.video_url ?? "",
          learningGuide: t.learning_guide ?? "",
          error: null,
          saved: false,
        },
      ])
    )
  );
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function patch(id: string, patch: Partial<EditState>) {
    setEditStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function handleSave(tool: AdminTool) {
    const state = editStates[tool.id];
    patch(tool.id, { error: null, saved: false });

    startTransition(async () => {
      const result = await updateToolContent(
        tool.id,
        state.videoUrl,
        state.learningGuide
      );
      if (result.error) {
        patch(tool.id, { error: result.error });
        toast.error("Save failed", { description: result.error });
      } else {
        patch(tool.id, { saved: true });
        toast.success("Saved", { description: `${tool.name} updated.` });
        setTimeout(() => patch(tool.id, { saved: false }), 2500);
      }
    });
  }

  return (
    <div className="space-y-2">
      {tools.map((tool) => {
        const state = editStates[tool.id];
        const isOpen = expandedId === tool.id;

        return (
          <div
            key={tool.id}
            className="rounded-2xl border border-moss-200 bg-parchment overflow-hidden"
          >
            {/* Row */}
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl w-8 flex-shrink-0">{tool.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-bold text-espresso truncate">
                  {tool.name}
                </p>
                <p className="font-body text-xs text-forest/50 uppercase tracking-wider">
                  {tool.category ?? "—"} · {tool.slug}
                </p>
              </div>

              {/* Status dots */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  aria-label={state.videoUrl ? "Has video" : "No video"}
                  className={`w-2 h-2 rounded-full ${
                    state.videoUrl ? "bg-moss-500" : "bg-moss-200"
                  }`}
                />
                <span
                  aria-label={state.learningGuide ? "Has guide" : "No guide"}
                  className={`w-2 h-2 rounded-full ${
                    state.learningGuide ? "bg-amber-400" : "bg-amber-100"
                  }`}
                />
                <button
                  onClick={() => toggle(tool.id)}
                  className={`
                    font-body text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors duration-150
                    ${isOpen
                      ? "bg-espresso text-parchment border-espresso"
                      : "bg-moss-100 text-forest border-moss-200 hover:bg-moss-200"
                    }
                  `}
                >
                  {isOpen ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {/* Inline form */}
            {isOpen && (
              <div className="border-t border-moss-100 px-5 py-5 space-y-4 bg-moss-50/40">
                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-forest/60">
                    Video URL
                    <span className="ml-2 font-normal normal-case tracking-normal text-forest/40">
                      (YouTube embed URL)
                    </span>
                  </label>
                  <input
                    type="url"
                    value={state.videoUrl}
                    onChange={(e) =>
                      patch(tool.id, { videoUrl: e.target.value, saved: false })
                    }
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    className="w-full font-body text-sm bg-parchment border border-moss-200 rounded-xl px-4 py-2.5 text-espresso placeholder:text-forest/30 focus:outline-none focus:border-moss-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-forest/60">
                    Learning Guide
                    <span className="ml-2 font-normal normal-case tracking-normal text-forest/40">
                      (separate paragraphs with a blank line)
                    </span>
                  </label>
                  <textarea
                    rows={8}
                    value={state.learningGuide}
                    onChange={(e) =>
                      patch(tool.id, {
                        learningGuide: e.target.value,
                        saved: false,
                      })
                    }
                    placeholder="Write a friendly, practical guide for getting started with this tool..."
                    className="w-full font-body text-sm bg-parchment border border-moss-200 rounded-xl px-4 py-2.5 text-espresso placeholder:text-forest/30 focus:outline-none focus:border-moss-400 transition-colors resize-y"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSave(tool)}
                    disabled={isPending}
                    className="font-body text-sm font-semibold px-6 py-2.5 rounded-xl bg-moss-500 text-parchment hover:bg-moss-600 disabled:opacity-50 transition-colors duration-150"
                  >
                    {isPending ? "Saving…" : "Save"}
                  </button>

                  {state.saved && (
                    <span className="font-body text-sm text-moss-600 font-medium">
                      ✓ Saved
                    </span>
                  )}
                  {state.error && (
                    <span className="font-body text-sm text-red-600">
                      {state.error}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
