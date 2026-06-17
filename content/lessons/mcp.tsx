import type { Lesson } from "@/lib/lessons";
import McpSimulation from "@/components/learn/McpSimulation";

const lesson: Lesson = {
  slug: "mcp",
  title: "MCP",
  tagline: "A common plug for connecting AI to tools and data.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Function calling lets a model use a tool — but someone has to wire
            each tool to each app by hand. Want your assistant to reach your
            files, your database, your calendar? That&apos;s a custom integration
            apiece, rebuilt for every new model and every new app. It doesn&apos;t
            scale.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The <strong>Model Context Protocol</strong> is the standard that
            replaces all that bespoke wiring with one plug.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Build once, plug in anywhere",
      body: (
        <>
          <p style={{ margin: 0 }}>
            MCP defines a common language between AI apps (clients) and the tools
            and data they use (servers). Expose your service as an MCP server
            once, and any MCP-speaking app can use it — no per-app glue code.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Think of it as a USB-C port for AI: a shared shape, so the model and
            the tool don&apos;t need a custom adapter to talk.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does the Model Context Protocol standardise?",
      choices: [
        {
          text: "How AI apps connect to external tools and data sources",
          correct: true,
          feedback:
            "Right — one common interface, so integrations are built once and reused everywhere.",
        },
        {
          text: "How models are physically manufactured",
          feedback:
            "It's a software interface for connectivity, not anything to do with hardware.",
        },
        {
          text: "The price of each API call",
          feedback:
            "It's about how things connect, not billing.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a client discover what an MCP server offers, then call a tool
          through the shared protocol — no bespoke integration in sight.
        </p>
      ),
      demo: McpSimulation,
      tryThis: "The same client could talk to any MCP server — that's the whole win.",
    },
    {
      kind: "check",
      id: "check-vs-fc",
      prompt: "How does MCP relate to function calling?",
      choices: [
        {
          text: "Function calling is a model asking to use a tool; MCP standardises how that tool is connected and discovered",
          correct: true,
          feedback:
            "Right — they're complementary. The model still calls functions; MCP makes the plumbing reusable across apps.",
        },
        {
          text: "MCP replaces the model entirely",
          feedback:
            "The model is still doing the calling — MCP just standardises what it can plug into.",
        },
        {
          text: "They're the same thing under two names",
          feedback:
            "Related but distinct — one is the model's request, the other is the connection standard around it.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it caught on",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Standards win by network effect. Every tool exposed over MCP works
            with every MCP client; every new client inherits the whole existing
            ecosystem of servers. That&apos;s how a protocol turns N×M custom
            integrations into N + M.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The same connectivity also widens the attack surface — an MCP server
            feeds untrusted content and tools to a model, so the prompt-injection
            cautions very much apply.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-benefit",
      prompt: "What's the core benefit of a standard like MCP?",
      choices: [
        {
          text: "A tool built once works with every compatible app, instead of needing custom glue for each",
          correct: true,
          feedback:
            "Exactly — it collapses N×M bespoke integrations into build-once, plug-in-anywhere.",
        },
        {
          text: "It makes models reason better",
          feedback:
            "It doesn't change the model's reasoning — it standardises what the model can connect to.",
        },
        {
          text: "It removes the need for any tools",
          feedback:
            "It's all about connecting tools — it makes them easier to plug in, not unnecessary.",
        },
      ],
    },
    {
      kind: "explain",
      id: "wrap",
      eyebrow: "Keep this",
      body: (
        <>
          <p style={{ margin: 0 }}>
            MCP is a shared standard for plugging AI apps into tools and data —
            build an integration once, use it everywhere. It&apos;s the
            connective tissue that lets the tool-using, agentic world grow
            without rebuilding the same wiring forever.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One plug, many tools — with the usual caution about trusting what
            comes through it.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
