"use client";

import { useState, useTransition } from "react";
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

  function patch(id: string, changes: Partial<EditState>) {
    setEditStates((prev) => ({ ...prev, [id]: { ...prev[id], ...changes } }));
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
      } else {
        patch(tool.id, { saved: true });
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
            className="rounded-lg border border-subtle bg-panel overflow-hidden"
          >
            {/* Row */}
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl w-8 flex-shrink-0">{tool.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-primary truncate">
                  {tool.name}
                </p>
                <p className="font-mono text-xs text-muted uppercase tracking-wider">
                  {tool.category ?? "—"} · {tool.slug}
                </p>
              </div>

              {/* Status dots */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  aria-label={state.videoUrl ? "Has video" : "No video"}
                  className={`w-2 h-2 rounded-full ${
                    state.videoUrl ? "bg-accent" : "bg-raised"
                  }`}
                />
                <span
                  aria-label={state.learningGuide ? "Has guide" : "No guide"}
                  className={`w-2 h-2 rounded-full ${
                    state.learningGuide ? "bg-warm" : "bg-raised"
                  }`}
                />
                <button
                  onClick={() => toggle(tool.id)}
                  className={`
                    font-sans text-xs font-medium px-4 py-1.5 rounded-full border transition-colors duration-150
                    ${isOpen
                      ? "bg-primary text-inverse border-primary"
                      : "bg-raised text-secondary border-subtle hover:border-emphasis hover:text-primary"
                    }
                  `}
                >
                  {isOpen ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {/* Inline form */}
            {isOpen && (
              <div className="border-t border-subtle px-5 py-5 space-y-4 bg-raised">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-muted">
                    Video URL
                    <span className="ml-2 font-normal normal-case tracking-normal">
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
                    className="w-full font-mono text-sm bg-page border border-[var(--border-default)] rounded-md px-4 py-2.5 text-primary placeholder:text-muted focus:outline-none focus:border-emphasis transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-muted">
                    Learning Guide
                    <span className="ml-2 font-normal normal-case tracking-normal">
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
                    className="w-full font-sans text-sm bg-page border border-[var(--border-default)] rounded-md px-4 py-2.5 text-primary placeholder:text-muted focus:outline-none focus:border-emphasis transition-colors resize-y"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSave(tool)}
                    disabled={isPending}
                    className="font-sans text-sm font-medium px-6 py-2.5 rounded-md bg-accent text-inverse hover:bg-accent-dim disabled:opacity-50 transition-colors duration-150"
                  >
                    {isPending ? "Saving…" : "Save"}
                  </button>

                  {state.saved && (
                    <span className="font-sans text-sm text-accent">
                      ✓ Saved
                    </span>
                  )}
                  {state.error && (
                    <span className="font-sans text-sm text-danger">
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
