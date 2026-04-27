'use client';

import { useRef, useState } from 'react';

type ToolId = 'filesystem' | 'websearch' | 'calendar' | 'database';

interface ToolNode {
  id: ToolId;
  label: string;
  sublabel: string;
  cx: number;
  cy: number;
}

const TOOLS: ToolNode[] = [
  { id: 'filesystem', label: 'File System',  sublabel: 'read · write',  cx: 80,  cy: 80  },
  { id: 'websearch',  label: 'Web Search',   sublabel: 'query · fetch', cx: 440, cy: 80  },
  { id: 'calendar',   label: 'Calendar',     sublabel: 'events · time', cx: 80,  cy: 280 },
  { id: 'database',   label: 'Database',     sublabel: 'query · store', cx: 440, cy: 280 },
];

const AI_CX = 260;
const AI_CY = 180;
const TOOL_W = 110;
const TOOL_H = 50;
const AI_W = 130;
const AI_H = 60;

const TOOL_LABELS: Record<ToolId, string> = {
  filesystem: 'File System',
  websearch:  'Web Search',
  calendar:   'Calendar',
  database:   'Database',
};

function lineLen(tool: ToolNode): number {
  return Math.ceil(
    Math.sqrt((AI_CX - tool.cx) ** 2 + (AI_CY - tool.cy) ** 2)
  );
}

function nowStr(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function insightText(connected: Set<ToolId>): string {
  const verbs: Record<ToolId, string> = {
    filesystem: 'read files',
    websearch:  'search the web',
    calendar:   'check your calendar',
    database:   'query databases',
  };
  const list = Array.from(connected).map((id) => verbs[id]);
  if (list.length === 2)
    return `Your AI can now ${list[0]} AND ${list[1]} simultaneously.`;
  if (list.length === 3)
    return `Three tools. One conversation. No custom integrations needed.`;
  return `All four tools live. This is what a fully-wired MCP environment looks like.`;
}

interface LogEntry {
  id: number;
  time: string;
  label: string;
}

const KEYFRAMES = TOOLS.map((t) => {
  const len = lineLen(t);
  return `@keyframes mcpDraw_${t.id} {
  from { stroke-dashoffset: ${len}; opacity: 0; }
  to   { stroke-dashoffset: 0;    opacity: 0.85; }
}`;
}).join('\n');

const GLOBAL_STYLES = `
${KEYFRAMES}
@keyframes mcpInsight {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export default function McpSimulation() {
  const [connected, setConnected] = useState<Set<ToolId>>(new Set());
  const [animVer, setAnimVer] = useState<Record<ToolId, number>>({
    filesystem: 0, websearch: 0, calendar: 0, database: 0,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  function connect(id: ToolId) {
    if (connected.has(id)) return;
    setConnected((prev) => new Set([...prev, id]));
    setAnimVer((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    setLogs((prev) => [
      ...prev,
      { id: ++logId.current, time: nowStr(), label: TOOL_LABELS[id] },
    ]);
  }

  const numConnected = connected.size;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10)',
        margin: 'var(--space-10) 0',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-4)',
        }}
      >
        ◉ INTERACTIVE
      </p>

      {/* Diagram */}
      <svg
        viewBox="0 0 520 360"
        style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 'var(--space-2)' }}
        aria-label="MCP tool connection diagram"
      >
        <defs>
          <style>{GLOBAL_STYLES}</style>
        </defs>

        {/* Lines drawn behind nodes */}
        {TOOLS.map((tool) => {
          if (!connected.has(tool.id)) return null;
          const len = lineLen(tool);
          const ver = animVer[tool.id];
          return (
            <line
              key={`${tool.id}-v${ver}`}
              x1={tool.cx}
              y1={tool.cy}
              x2={AI_CX}
              y2={AI_CY}
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              strokeLinecap="round"
              style={{
                strokeDashoffset: len,
                animation: `mcpDraw_${tool.id} 600ms cubic-bezier(0.16, 1, 0.3, 1) both`,
              }}
            />
          );
        })}

        {/* Tool nodes */}
        {TOOLS.map((tool) => {
          const isConn = connected.has(tool.id);
          return (
            <g
              key={tool.id}
              onClick={() => connect(tool.id)}
              style={{ cursor: isConn ? 'default' : 'pointer' }}
              role="button"
              aria-label={`Connect ${tool.label} via MCP`}
            >
              <rect
                x={tool.cx - TOOL_W / 2}
                y={tool.cy - TOOL_H / 2}
                width={TOOL_W}
                height={TOOL_H}
                rx={8}
                style={{
                  fill:   isConn ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
                  stroke: isConn ? 'var(--accent-primary)'     : 'var(--border-default)',
                  strokeWidth: 1.5,
                  transition: 'fill 200ms ease, stroke 200ms ease',
                }}
              />
              <text
                x={tool.cx}
                y={tool.cy - 7}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: '500',
                  fill: isConn ? 'var(--accent-primary)' : 'var(--text-primary)',
                  transition: 'fill 200ms ease',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {tool.label}
              </text>
              <text
                x={tool.cx}
                y={tool.cy + 10}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fill: isConn ? 'var(--accent-primary)' : 'var(--text-muted)',
                  transition: 'fill 200ms ease',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {tool.sublabel}
              </text>
              {!isConn && (
                <text
                  x={tool.cx}
                  y={tool.cy + 26}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8.5px',
                    fill: 'var(--text-muted)',
                    opacity: 0.6,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  click to connect
                </text>
              )}
            </g>
          );
        })}

        {/* AI Model — center */}
        <g>
          <rect
            x={AI_CX - AI_W / 2}
            y={AI_CY - AI_H / 2}
            width={AI_W}
            height={AI_H}
            rx={10}
            style={{
              fill:   numConnected > 0 ? 'var(--accent-primary-glow)' : 'var(--bg-surface)',
              stroke: numConnected > 0 ? 'var(--accent-primary)'     : 'var(--border-default)',
              strokeWidth: numConnected > 0 ? 2 : 1,
              transition: 'fill 300ms ease, stroke 300ms ease, stroke-width 300ms ease',
            }}
          />
          <text
            x={AI_CX}
            y={AI_CY - 6}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: '600',
              fill: numConnected > 0 ? 'var(--accent-primary)' : 'var(--text-primary)',
              transition: 'fill 300ms ease',
              userSelect: 'none',
            }}
          >
            AI Model
          </text>
          <text
            x={AI_CX}
            y={AI_CY + 12}
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fill: numConnected > 0 ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'fill 300ms ease',
              userSelect: 'none',
            }}
          >
            {numConnected > 0
              ? `${numConnected} tool${numConnected > 1 ? 's' : ''} live`
              : 'MCP client'}
          </text>
        </g>
      </svg>

      {/* Log panel */}
      {logs.length > 0 && (
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            maxHeight: '120px',
            overflowY: 'auto',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: numConnected >= 2 ? 'var(--space-4)' : 0,
          }}
        >
          {logs.map((entry) => (
            <div key={entry.id} style={{ lineHeight: 1.8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                }}
              >
                [{entry.time}]
              </span>{' '}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--accent-primary)',
                }}
              >
                MCP handshake:
              </span>{' '}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                }}
              >
                {entry.label} connected
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Insight — appears when 2+ tools connected */}
      {numConnected >= 2 && (
        <p
          key={numConnected}
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: 0,
            animation: 'mcpInsight 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          {insightText(connected)}
        </p>
      )}
    </div>
  );
}
