import type { Lesson } from "@/lib/lessons";
import AgentsSimulation from "@/components/learn/AgentsSimulation";

const lesson: Lesson = {
  slug: "agents",
  title: "AI Agents",
  tagline: "The difference between answering and acting is a loop.",
  minutes: 7,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A chatbot responds: you ask, it answers, done. An{" "}
            <strong>agent</strong> acts: it takes your goal, figures out steps,
            runs them, looks at what came back, adjusts, and keeps going until
            the goal is reached — or it decides it can&apos;t.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The word has been stretched thin by marketing. The careful
            distinction isn&apos;t capability — it&apos;s <em>the loop</em>.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-defn",
      prompt: "What makes something an agent rather than a chatbot?",
      choices: [
        {
          text: "It uses a bigger, smarter model",
          feedback:
            "Model size is orthogonal — a small model in a loop is an agent; a frontier model answering once is not.",
        },
        {
          text: "It runs in a feedback loop: observe, reason, act, observe again",
          correct: true,
          feedback:
            "That's the defining trait — the ReAct pattern: Reason and Act, repeated until done.",
        },
        {
          text: "It has a personality and a name",
          feedback:
            "Branding, not architecture. The loop is what counts.",
        },
      ],
    },
    {
      kind: "explain",
      id: "loop",
      eyebrow: "The loop",
      body: (
        <>
          <p style={{ margin: 0 }}>
            <strong>Observe</strong> the current state — what tools exist,
            what&apos;s already happened. <strong>Reason</strong> about the next
            move (&quot;I need to search before I can answer&quot;).{" "}
            <strong>Act</strong> — call a tool, write a file, send a request.
            Then observe the result and go again.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            In code it&apos;s a while-loop: keep calling the model with tool
            results fed back in; when it stops calling tools, it&apos;s done.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch an agent work a goal: tool calls, observations, course
          corrections.
        </p>
      ),
      demo: AgentsSimulation,
      tryThis: "Follow one observation and see how it changes the next action.",
    },
    {
      kind: "check",
      id: "check-stop",
      prompt: "In the standard agent loop, how does the run end?",
      choices: [
        {
          text: "After a fixed number of steps, always",
          feedback:
            "Step caps exist as a safety rail, but they're not the normal exit.",
        },
        {
          text: "When the model responds without calling any more tools",
          correct: true,
          feedback:
            "Right — no tool calls means the model considers the goal handled (or unreachable) and returns its answer.",
        },
        {
          text: "When the user closes the chat window",
          feedback:
            "Agents typically run server-side — the loop's own exit condition is what ends it.",
        },
      ],
    },
    {
      kind: "explain",
      id: "hard",
      eyebrow: "The hard part",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most agents fail not because the model is wrong, but because the
            feedback loop is brittle. The model is often fine; the scaffolding
            cracks — flaky tools, ambiguous errors, state that drifts out of
            sync with reality.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Building good agents is mostly building good loops: clear tool
            contracts, honest error messages, and a way to stop.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-fail",
      prompt:
        "An agent keeps retrying a tool that returns a vague error, burning tokens for an hour. Where's the real bug?",
      choices: [
        {
          text: "The model is too dumb to give up",
          feedback:
            "A model can only reason about what the loop shows it — a vague error gives it nothing to reason with.",
        },
        {
          text: "The scaffolding: bad error reporting and no stop condition",
          correct: true,
          feedback:
            "Exactly — brittle loop, not broken model. Honest errors and a step budget would have ended this in minutes.",
        },
        {
          text: "Agents fundamentally can't use tools reliably",
          feedback:
            "They can, broadly — when the tool contracts and feedback are designed with care.",
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
            Agent = model + loop + tools. Judge any &quot;agentic&quot; product
            by its loop: what it observes, how it recovers, when it stops.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            How tools get standardized across agents is the{" "}
            <strong>Model Context Protocol</strong> — covered in its own essay.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
