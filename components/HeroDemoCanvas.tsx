"use client";

import "@xyflow/react/dist/style.css";

import { useState, useCallback, memo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type Node,
  type Edge,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";

// ── Demo node data ─────────────────────────────────────────────────────────

type DemoNodeData = {
  label: string;
  emoji: string;
  category: string;
  step: number;
  accent: "amber" | "moss" | "lavender";
};

const accentMap = {
  amber: {
    header: "bg-amber-100 dark:bg-amber-900/30",
    badge: "bg-amber-400 text-espresso",
    dot: "bg-amber-400",
    border: "border-amber-200 dark:border-amber-800/50",
    handle: "#F4AB1F",
  },
  moss: {
    header: "bg-moss-100 dark:bg-moss-900/30",
    badge: "bg-moss-500 text-parchment",
    dot: "bg-moss-500",
    border: "border-moss-200 dark:border-moss-800/50",
    handle: "#3D8A2B",
  },
  lavender: {
    header: "bg-lavender-100 dark:bg-lavender-900/30",
    badge: "bg-lavender-400 text-parchment",
    dot: "bg-lavender-400",
    border: "border-lavender-200 dark:border-lavender-800/50",
    handle: "#A373D7",
  },
};

// ── Custom read-only node ──────────────────────────────────────────────────

const DemoNode = memo(function DemoNode({ data }: { data: DemoNodeData }) {
  const a = accentMap[data.accent];

  return (
    <div
      className={`
        relative w-44 rounded-2xl border overflow-hidden
        bg-parchment dark:bg-charcoal-800
        shadow-card dark:shadow-card-dark
        ${a.border}
        select-none cursor-grab active:cursor-grabbing
      `}
    >
      {/* Step badge */}
      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-espresso dark:bg-charcoal-950 flex items-center justify-center shadow-sm">
        <span className="font-serif text-[9px] font-bold text-parchment">{data.step}</span>
      </div>

      {/* Header strip */}
      <div className={`px-3 py-2 ${a.header} flex items-center gap-2`}>
        <span className="text-sm leading-none">{data.emoji}</span>
        <span className={`text-[9px] font-body font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${a.badge}`}>
          {data.category}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2">
        <p className="font-serif text-sm font-bold text-espresso dark:text-parchment leading-tight">
          {data.label}
        </p>
        <div className="flex items-center gap-1.5">
          <motion.span
            className={`inline-block w-1.5 h-1.5 rounded-full ${a.dot}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-body text-[10px] text-forest/50 dark:text-parchment/40 uppercase tracking-widest">
            To do
          </span>
        </div>
      </div>
    </div>
  );
});

const nodeTypes: NodeTypes = { demo: DemoNode as never };

// ── Initial graph data ─────────────────────────────────────────────────────

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "demo",
    position: { x: 30,  y: 80 },
    data: { label: "Bolt.new", emoji: "⚡", category: "Code Gen", step: 1, accent: "amber" },
    draggable: true,
  },
  {
    id: "2",
    type: "demo",
    position: { x: 240, y: 10 },
    data: { label: "Claude", emoji: "🤖", category: "AI Chat", step: 2, accent: "moss" },
    draggable: true,
  },
  {
    id: "3",
    type: "demo",
    position: { x: 450, y: 80 },
    data: { label: "Cursor", emoji: "🖱️", category: "Dev Tool", step: 3, accent: "lavender" },
    draggable: true,
  },
  {
    id: "4",
    type: "demo",
    position: { x: 120, y: 210 },
    data: { label: "NotebookLM", emoji: "📓", category: "Research", step: 4, accent: "moss" },
    draggable: true,
  },
  {
    id: "5",
    type: "demo",
    position: { x: 360, y: 210 },
    data: { label: "Perplexity", emoji: "🔭", category: "Search", step: 5, accent: "amber" },
    draggable: true,
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true, style: { stroke: "#3D8A2B", strokeWidth: 1.8, opacity: 0.5 } },
  { id: "e2-3", source: "2", target: "3", type: "smoothstep", animated: true, style: { stroke: "#3D8A2B", strokeWidth: 1.8, opacity: 0.5 } },
  { id: "e1-4", source: "1", target: "4", type: "smoothstep", animated: true, style: { stroke: "#F4AB1F", strokeWidth: 1.8, opacity: 0.5 } },
  { id: "e2-5", source: "2", target: "5", type: "smoothstep", animated: true, style: { stroke: "#3D8A2B", strokeWidth: 1.8, opacity: 0.5 } },
  { id: "e4-5", source: "4", target: "5", type: "smoothstep", animated: false, style: { stroke: "#A373D7", strokeWidth: 1.5, opacity: 0.4 } },
];

// ── Main component ─────────────────────────────────────────────────────────

export default function HeroDemoCanvas() {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges] = useEdgesState(INITIAL_EDGES);
  const [hasDragged, setHasDragged] = useState(false);

  const onNodeDragStart = useCallback(() => {
    setHasDragged(true);
  }, []);

  return (
    <motion.div
      className="relative rounded-3xl border border-moss-200 dark:border-charcoal-700 overflow-hidden shadow-card-hover dark:shadow-card-dark-hover"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 26 }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-espresso/[0.04] dark:bg-charcoal-800 border-b border-moss-200 dark:border-charcoal-700 flex-shrink-0">
        <div className="flex gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-300/70" />
          <div className="w-3 h-3 rounded-full bg-amber-300/70" />
          <div className="w-3 h-3 rounded-full bg-moss-300/70" />
        </div>
        <div className="flex-1 mx-3 bg-parchment dark:bg-charcoal-900 rounded-full border border-moss-100 dark:border-charcoal-700 px-4 py-1">
          <span className="font-body text-xs text-forest/35 dark:text-parchment/30 select-none">
            aightai.in/roadmaps/my-ai-stack
          </span>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 font-body text-xs text-forest/40 dark:text-parchment/30 flex-shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-moss-400 animate-pulse" />
          read-only
        </span>
      </div>

      {/* Canvas */}
      <div className="h-56 sm:h-72 md:h-80 lg:h-96 bg-parchment dark:bg-charcoal-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeDragStart={onNodeDragStart}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.4}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
            color="#8ABF76"
            style={{ opacity: 0.4 }}
          />
          <Controls
            showInteractive={false}
            className="!bottom-4 !right-4 !left-auto !top-auto"
          />
        </ReactFlow>
      </div>

      {/* "Try dragging me" hint */}
      <AnimatePresence>
        {!hasDragged && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-espresso/80 dark:bg-charcoal-950/80 backdrop-blur-sm shadow-lg">
              <motion.span
                animate={{ x: [0, 4, -4, 4, 0] }}
                transition={{ delay: 1.8, duration: 0.6, repeat: 3, repeatDelay: 3 }}
                className="text-sm"
              >
                👆
              </motion.span>
              <span className="font-body text-xs font-medium text-parchment whitespace-nowrap">
                Try dragging me ✦
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
