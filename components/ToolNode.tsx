"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { updateToolStatus } from "@/app/actions/roadmap";
import { useRoadmapId, useReadOnly } from "./RoadmapIdContext";
import ToolLogo from "./ToolLogo";

// ── Types ──────────────────────────────────────────────────────────────────

export type ToolNodeData = {
  label: string;
  emoji: string;
  url?: string | null;
  category: string;
  accent: "moss" | "amber" | "lavender";
  status: "todo" | "in-progress" | "done";
  stepNumber?: number;
  rationale?: string;
  step_instructions?: string;
  learning_guide?: string | null;
  video_url?: string | null;
};

// ── Maps ───────────────────────────────────────────────────────────────────

const accentMap: Record<string, { header: string; badge: string; handle: string }> = {
  moss: {
    header: "bg-moss-100",
    badge:  "bg-moss-500 text-parchment",
    handle: "#3D8A2B",
  },
  amber: {
    header: "bg-amber-100",
    badge:  "bg-amber-400 text-espresso",
    handle: "#F4AB1F",
  },
  lavender: {
    header: "bg-lavender-100",
    badge:  "bg-lavender-400 text-parchment",
    handle: "#A373D7",
  },
  sand: {
    header: "bg-amber-50",
    badge:  "bg-amber-200 text-espresso",
    handle: "#F4AB1F",
  },
};

const statusCycle: Record<ToolNodeData["status"], ToolNodeData["status"]> = {
  "todo":        "in-progress",
  "in-progress": "done",
  "done":        "todo",
};

const statusStyle: Record<ToolNodeData["status"], { dot: string; label: string }> = {
  "todo":        { dot: "bg-forest/30",  label: "To do" },
  "in-progress": { dot: "bg-amber-400",  label: "In progress" },
  "done":        { dot: "bg-moss-500",   label: "Done" },
};

// ── Component ──────────────────────────────────────────────────────────────

function ToolNode({ id, data, selected }: NodeProps & { data: ToolNodeData }) {
  const { deleteElements, updateNodeData } = useReactFlow();
  const roadmapId = useRoadmapId();
  const readOnly  = useReadOnly();

  const a = accentMap[data.accent] ?? accentMap["moss"];
  const s = statusStyle[data.status] ?? statusStyle["todo"];

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    // deleteElements triggers React Flow's onNodesDelete on the canvas,
    // which handles resequencing + persistence from there.
    deleteElements({ nodes: [{ id }] });
  }

  function handleStatusCycle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = statusCycle[data.status] ?? "todo";
    updateNodeData(id, { status: next });
    updateToolStatus(id, next, roadmapId);
  }

  return (
    <div
      className={`
        relative group w-[188px] rounded-2xl border bg-parchment shadow-card
        cursor-pointer transition-all duration-200
        ${selected
          ? "border-moss-500 shadow-moss ring-2 ring-moss-300/50"
          : "border-moss-200 hover:border-moss-400 hover:shadow-card-hover hover:ring-1 hover:ring-moss-300/40"
        }
      `}
    >
      {/* Target handle — left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10, borderRadius: "50%", background: a.handle, border: "2px solid #F5EFE0" }}
      />

      {/* Step number badge */}
      {data.stepNumber !== undefined && (
        <div className="absolute -top-3 -left-3 z-10 w-7 h-7 rounded-full bg-espresso text-parchment flex items-center justify-center shadow-card">
          <span className="font-body text-2xs font-bold leading-none">
            {data.stepNumber}
          </span>
        </div>
      )}

      {/* Logo header strip */}
      <div className={`relative ${a.header} flex items-center gap-2.5 px-4 py-3 rounded-t-2xl`}>
        <ToolLogo url={data.url} emoji={data.emoji} size={28} />
        <span className={`text-2xs font-body font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${a.badge}`}>
          {data.category}
        </span>

        {/* Delete button — fades in on hover (edit mode only) */}
        {!readOnly && (
          <button
            onClick={handleDelete}
            aria-label={`Remove ${data.label} from roadmap`}
            className="
              absolute top-1.5 right-1.5
              w-5 h-5 rounded-full flex items-center justify-center
              bg-espresso/0 hover:bg-espresso/15 text-espresso/40 hover:text-espresso/80
              opacity-0 group-hover:opacity-100
              transition-all duration-150 text-sm font-bold leading-none
            "
          >
            <span aria-hidden>×</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-2.5 pb-3 space-y-2">
        <p className="font-serif text-sm font-bold text-espresso leading-snug">
          {data.label}
        </p>

        {/* Rationale — 2-line clamp */}
        {data.rationale && (
          <p className="font-body text-xs text-forest/50 leading-snug line-clamp-2">
            {data.rationale}
          </p>
        )}

        {/* Status pill — clickable in edit mode, static in read-only */}
        {readOnly ? (
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <span className="font-body text-2xs text-forest/60 uppercase tracking-widest">
              {s.label}
            </span>
          </div>
        ) : (
          <button
            onClick={handleStatusCycle}
            aria-label={`Status: ${s.label}. Click to advance.`}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity duration-150 cursor-pointer"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <span className="font-body text-2xs text-forest/60 uppercase tracking-widest">
              {s.label}
            </span>
          </button>
        )}
      </div>

      {/* Source handle — right */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10, borderRadius: "50%", background: a.handle, border: "2px solid #F5EFE0" }}
      />
    </div>
  );
}

export default memo(ToolNode);
