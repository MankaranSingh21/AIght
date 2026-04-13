"use client";

import "@xyflow/react/dist/style.css";

import posthog from "posthog-js";
import Link from "next/link";
import { useState, useEffect, useCallback, useTransition } from "react";
import NodeDrawer from "./NodeDrawer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sprout } from "lucide-react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import ToolNode, { type ToolNodeData } from "./ToolNode";
import CustomEdge from "./CustomEdge";
import { RoadmapIdContext, ReadOnlyContext } from "./RoadmapIdContext";
import { updateRoadmapEdges, toggleRoadmapVisibility, cloneRoadmap, updateToolStatus, persistNodes } from "@/app/actions/roadmap";

const nodeTypes = { toolNode: ToolNode };
// Override the built-in "smoothstep" type so every persisted edge automatically
// gets the delete button — no DB migration required.
const edgeTypes = { smoothstep: CustomEdge };
const NAVBAR_H = 56;

// Sort surviving nodes left-to-right by x position and reassign stepNumber.
function resequenceNodes(nodes: Node<ToolNodeData>[]): Node<ToolNodeData>[] {
  return [...nodes]
    .sort((a, b) => a.position.x - b.position.x)
    .map((node, i) => ({
      ...node,
      data: { ...node.data, stepNumber: i + 1 },
    }));
}

type Props = {
  roadmapId: string;
  title: string;
  initialNodes: Node<ToolNodeData>[];
  initialEdges: Edge[];
  initialIsPublic?: boolean;
  readOnly?: boolean;
};

// ── Clone button (read-only mode only) ────────────────────────────────────

function CloneInHeader({ roadmapId }: { roadmapId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClone() {
    startTransition(async () => {
      const toastId = toast.loading("Cloning roadmap…");
      const result = await cloneRoadmap(roadmapId);
      if (result?.error) {
        toast.error("Clone failed", { id: toastId, description: result.error });
      } else if (result?.id) {
        toast.success("Roadmap cloned — it's yours now ✦", { id: toastId });
        router.push(`/roadmaps/${result.id}`);
      }
    });
  }

  return (
    <button
      onClick={handleClone}
      disabled={isPending}
      className="
        flex items-center gap-2 font-body text-sm font-semibold
        px-5 py-2 rounded-xl border
        bg-moss-500 text-parchment border-moss-600
        hover:bg-moss-600 disabled:opacity-50
        transition-colors duration-150 flex-shrink-0
      "
    >
      <Sprout className="w-4 h-4" />
      <span>{isPending ? "Cloning…" : "Clone to My Account"}</span>
    </button>
  );
}

// ── Share panel (edit mode only) ───────────────────────────────────────────

function SharePanel({ roadmapId, initialIsPublic }: { roadmapId: string; initialIsPublic: boolean }) {
  const [isPublic, setIsPublic]     = useState(initialIsPublic);
  const [copied, setCopied]         = useState(false);
  const [isPending, startTransition] = useTransition();

  // Derive the full URL only after mount to avoid SSR / client hydration mismatch.
  const [publicUrl, setPublicUrl] = useState(`/r/${roadmapId}`);
  useEffect(() => {
    setPublicUrl(`${window.location.origin}/r/${roadmapId}`);
  }, [roadmapId]);

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next); // optimistic
    startTransition(async () => {
      const result = await toggleRoadmapVisibility(roadmapId, next);
      if (result?.error) {
        setIsPublic(!next); // revert
        toast.error("Couldn't update sharing", { description: result.error });
      } else {
        toast.success(next ? "Roadmap is now public ✦" : "Roadmap is now private");
      }
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {isPublic && (
        <div className="flex items-center gap-1.5">
          <input
            readOnly
            value={publicUrl}
            className="
              hidden sm:block w-48 font-body text-xs text-forest/70
              bg-moss-50 border border-moss-200 rounded-lg px-2.5 py-1.5
              focus:outline-none select-all
            "
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            className="
              font-body text-xs font-semibold px-3 py-1.5 rounded-lg
              bg-moss-100 hover:bg-moss-200 text-moss-700
              transition-colors duration-150
            "
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`
          flex items-center gap-2 font-body text-xs font-semibold
          px-4 py-1.5 rounded-xl border transition-colors duration-150
          disabled:opacity-50
          ${isPublic
            ? "bg-moss-500 text-parchment border-moss-600 hover:bg-moss-600"
            : "bg-parchment text-forest border-moss-200 hover:bg-moss-50"
          }
        `}
      >
        <span>{isPublic ? "🔓" : "🔒"}</span>
        <span>{isPublic ? "Public" : "Share"}</span>
      </button>
    </div>
  );
}

// ── Main canvas ────────────────────────────────────────────────────────────

export default function RoadmapCanvas({
  roadmapId,
  title,
  initialNodes,
  initialEdges,
  initialIsPublic = false,
  readOnly = false,
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const isEmpty = nodes.length === 0;
  const [mobileBannerDismissed, setMobileBannerDismissed] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      const next = addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#3D8A2B", strokeWidth: 2 },
        },
        edges
      );
      setEdges(next);
      updateRoadmapEdges(next, roadmapId);
    },
    [edges, setEdges, roadmapId, readOnly]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<ToolNodeData>) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
      posthog.capture("node_clicked", { tool: node.data.label });
    },
    []
  );

  const handleNodesDelete = useCallback(
    (deletedNodes: Node<ToolNodeData>[]) => {
      const deletedIds = new Set(deletedNodes.map((n) => n.id));

      // When onNodesDelete fires, React Flow has already queued the removal via
      // onNodesChange, but `nodes` in the closure is still the pre-deletion
      // snapshot — so we filter by deletedIds to get the correct remainder.
      const resequenced = resequenceNodes(
        nodes.filter((n) => !deletedIds.has(n.id))
      );

      // Separate statements: no side effects inside state updater functions.
      setSelectedNodeId((prev) => (prev && deletedIds.has(prev) ? null : prev));
      setNodes(resequenced);
      persistNodes(resequenced, roadmapId);
    },
    [nodes, setNodes, roadmapId]
  );

  const handleStatusChange = useCallback(
    (nodeId: string, status: ToolNodeData["status"]) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
        )
      );
      updateToolStatus(nodeId, status, roadmapId);
    },
    [setNodes, roadmapId]
  );

  // Persist edge deletions triggered either by the × button on CustomEdge
  // or by keyboard (Backspace / Delete) when an edge is selected.
  // When onEdgesDelete fires, `edges` is still the pre-deletion snapshot,
  // so we filter out the deleted IDs to get the remaining set.
  const handleEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      const deletedIds = new Set(deletedEdges.map((e) => e.id));
      const remaining  = edges.filter((e) => !deletedIds.has(e.id));
      updateRoadmapEdges(remaining, roadmapId);
    },
    [edges, roadmapId]
  );

  return (
    <RoadmapIdContext.Provider value={roadmapId}>
      <ReadOnlyContext.Provider value={readOnly}>
        <div
          className="flex flex-col bg-parchment"
          style={{ height: `calc(100vh - ${NAVBAR_H}px)` }}
        >
          {/* Mobile banner — hidden on md+ */}
          {!mobileBannerDismissed && (
            <div className="md:hidden flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-amber-50 border-b border-amber-200">
              <p className="font-body text-xs text-amber-800 leading-snug">
                ✨ Desktop recommended for the best building experience.
              </p>
              <button
                onClick={() => setMobileBannerDismissed(true)}
                className="flex-shrink-0 text-amber-600 hover:text-amber-900 transition-colors duration-150 text-lg leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-moss-200 bg-parchment/80 backdrop-blur-sm gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {readOnly ? (
                <span className="
                  font-body text-2xs font-semibold uppercase tracking-widest
                  px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200
                  flex-shrink-0
                ">
                  View Only
                </span>
              ) : (
                <>
                  <Link
                    href="/roadmaps"
                    className="font-body text-xs text-forest/50 hover:text-forest transition-colors duration-150 flex-shrink-0"
                  >
                    ← All Canvases
                  </Link>
                  <span className="text-moss-200 flex-shrink-0">|</span>
                </>
              )}
              <div className="min-w-0">
                <p className="font-body text-2xs uppercase tracking-[0.18em] text-moss-500 font-semibold leading-none mb-0.5">
                  {readOnly ? "Shared Canvas" : "Canvas"}
                </p>
                <h1 className="font-serif text-base font-bold text-espresso leading-none truncate">
                  {title}
                </h1>
              </div>
            </div>

            {readOnly ? (
              <CloneInHeader roadmapId={roadmapId} />
            ) : (
              <SharePanel roadmapId={roadmapId} initialIsPublic={initialIsPublic} />
            )}
          </div>

          {/* React Flow */}
          <div className="flex-1 min-h-0 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={readOnly ? undefined : onNodesChange}
              onEdgesChange={readOnly ? undefined : onEdgesChange}
              onConnect={readOnly ? undefined : onConnect}
              onNodesDelete={readOnly ? undefined : handleNodesDelete}
              onEdgesDelete={readOnly ? undefined : handleEdgesDelete}
              onNodeClick={handleNodeClick}
              onPaneClick={() => setSelectedNodeId(null)}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              nodesDraggable={!readOnly}
              nodesConnectable={!readOnly}
              elementsSelectable={true}
              deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
              panOnScroll={true}
              zoomOnPinch={true}
              preventScrolling={false}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.4}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
              style={{ background: "#F5EFE0", height: "100%" }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={22}
                size={1.4}
                color="#8ABF76"
                style={{ opacity: 0.45 }}
              />

              {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center space-y-2">
                    <p className="font-serif text-2xl font-semibold text-espresso/40">
                      {readOnly ? "This canvas is empty." : "This canvas is empty."}
                    </p>
                    {!readOnly && (
                      <p className="font-body text-sm text-forest/40">
                        Browse tools and hit &ldquo;+ Add to Roadmap&rdquo; to start building. ✦
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Controls
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </ReactFlow>

            <NodeDrawer
              node={selectedNode as Node<ToolNodeData> | null}
              onClose={() => setSelectedNodeId(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </ReadOnlyContext.Provider>
    </RoadmapIdContext.Provider>
  );
}
