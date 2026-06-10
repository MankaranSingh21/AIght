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
  utility_score: number | null;
  privacy_score: number | null;
  speed_score: number | null;
  cost_score: number | null;
  transparency_score: number | null;
};

type EditState = {
  videoUrl: string;
  learningGuide: string;
  utilityScore: number;
  privacyScore: number;
  speedScore: number;
  costScore: number;
  transparencyScore: number;
  error: string | null;
  saved: boolean;
};

const SCORE_AXES = [
  { key: "utilityScore" as const, label: "Utility", color: "#AAFF4D" },
  { key: "privacyScore" as const, label: "Privacy", color: "#00FFD1" },
  { key: "speedScore" as const, label: "Speed", color: "#FFD100" },
  { key: "costScore" as const, label: "Cost", color: "#B088FF" },
  { key: "transparencyScore" as const, label: "Transparency", color: "#F4AB1F" },
];

export default function AdminToolList({ tools }: { tools: AdminTool[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>(() =>
    Object.fromEntries(
      tools.map((t) => [
        t.id,
        {
          videoUrl: t.video_url ?? "",
          learningGuide: t.learning_guide ?? "",
          utilityScore: t.utility_score ?? 0,
          privacyScore: t.privacy_score ?? 0,
          speedScore: t.speed_score ?? 0,
          costScore: t.cost_score ?? 0,
          transparencyScore: t.transparency_score ?? 0,
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
        state.learningGuide,
        {
          utility_score: state.utilityScore,
          privacy_score: state.privacyScore,
          speed_score: state.speedScore,
          cost_score: state.costScore,
          transparency_score: state.transparencyScore,
        }
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
        const hasScores = state.utilityScore > 0 || state.privacyScore > 0 || state.speedScore > 0 || state.costScore > 0 || state.transparencyScore > 0;

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
                <span
                  aria-label={hasScores ? "Has scores" : "No scores"}
                  className={`w-2 h-2 rounded-full ${
                    hasScores ? "bg-[#00FFD1]" : "bg-raised"
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
              <div className="border-t border-subtle px-5 py-5 space-y-5 bg-raised">
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

                {/* Score sliders */}
                <div className="space-y-3">
                  <p className="font-sans text-xs font-medium uppercase tracking-widest text-muted">
                    Scoring (0–100)
                  </p>
                  {!hasScores && (
                    <p className="font-mono text-xs text-warm">
                      ⚠ All scores are zero — this tool renders an empty radar on /compare and its detail page.
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SCORE_AXES.map(({ key, label, color }) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor={`${tool.id}-${key}`}
                            className="font-mono text-xs text-muted"
                          >
                            {label}
                          </label>
                          <span
                            className="font-mono text-xs font-bold"
                            style={{ color }}
                          >
                            {Math.round(state[key])}
                          </span>
                        </div>
                        <input
                          id={`${tool.id}-${key}`}
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={state[key]}
                          onChange={(e) =>
                            patch(tool.id, {
                              [key]: parseFloat(e.target.value),
                              saved: false,
                            })
                          }
                          className="w-full h-1.5 rounded-full appearance-none bg-panel cursor-pointer"
                          style={{ accentColor: color }}
                        />
                      </div>
                    ))}
                  </div>
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
