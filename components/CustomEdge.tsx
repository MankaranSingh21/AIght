"use client";

import { useCallback } from "react";
import {
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { useReadOnly } from "./RoadmapIdContext";

// ── CustomEdge ─────────────────────────────────────────────────────────────
//
// Wraps React Flow's built-in "smoothstep" edge with a small solarpunk-
// styled delete button rendered at the path midpoint via EdgeLabelRenderer.
//
// Registered as edgeTypes["smoothstep"] so every existing persisted edge
// (type: "smoothstep") automatically picks this up with no DB migration.

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();
  const readOnly = useReadOnly();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteElements({ edges: [{ id }] });
    },
    [id, deleteElements]
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#3D8A2B",
          strokeWidth: 2,
          ...style,
        }}
      />

      {/* Delete button — only rendered in edit mode */}
      {!readOnly && (
        <EdgeLabelRenderer>
          <button
            onClick={handleDelete}
            aria-label="Delete connection"
            // position: absolute + translate is the EdgeLabelRenderer convention.
            // pointerEvents: all is required because EdgeLabelRenderer's parent
            // has pointer-events: none by default.
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="
              nodrag nopan
              w-[18px] h-[18px] rounded-full
              flex items-center justify-center
              border border-moss-300/60 bg-parchment/90
              text-forest/40 text-sm font-bold leading-none
              shadow-sm
              hover:bg-moss-100 hover:border-moss-500 hover:text-espresso hover:scale-110
              transition-all duration-150
            "
          >
            ×
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
