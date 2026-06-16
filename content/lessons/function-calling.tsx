import type { Lesson } from "@/lib/lessons";
import FunctionCallingDemo from "@/components/learn/FunctionCallingDemo";

const lesson: Lesson = {
  slug: "function-calling",
  title: "Function Calling",
  tagline: "How a model reaches out of the chat box and does things.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A language model can&apos;t check today&apos;s weather, query your
            database, or send an email. It only predicts text. So how do
            assistants do all of that?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            They don&apos;t. They <em>ask your code</em> to. That hand-off is{" "}
            <strong>function calling</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Text, but structured",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You give the model a menu of functions it&apos;s allowed to use —
            each with a name and the arguments it expects. When the model
            decides one is needed, instead of answering it emits a structured
            request: <code>get_weather(city: &quot;Oslo&quot;)</code>.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Your code runs that function, gets a real result, and hands it back.
            The model then turns the raw result into a normal reply.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does function calling let a model do?",
      choices: [
        {
          text: "Rewrite its own training so it learns new skills",
          feedback:
            "No training happens — it just emits a request. The model's weights never change here.",
        },
        {
          text: "Emit a structured request to run a tool or API, then use the result in its answer",
          correct: true,
          feedback:
            "Exactly — it chooses the tool and the arguments; your code does the doing.",
        },
        {
          text: "Connect directly to the internet on its own",
          feedback:
            "It can't reach out itself — it asks for a function to be run, and that function is what touches the world.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Give the assistant a request and watch it pick a function, fill in the
          arguments, and fold the result back into its reply.
        </p>
      ),
      demo: FunctionCallingDemo,
      tryThis: "Notice the model never runs the function — it just asks for it by name.",
    },
    {
      kind: "check",
      id: "check-who",
      prompt: "When the model calls get_weather(\"Oslo\"), who actually runs it?",
      choices: [
        {
          text: "The model executes the code internally",
          feedback:
            "It can't run code — it only produced the request as text. Something outside has to act on it.",
        },
        {
          text: "Your application runs the function and returns the result to the model",
          correct: true,
          feedback:
            "Right — the model proposes, your code disposes. That boundary is also where you enforce safety.",
        },
        {
          text: "Nobody — the call is just decoration",
          feedback:
            "It's a real instruction your code is expected to fulfil, then feed the answer back.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it matters",
      body: (
        <>
          <p style={{ margin: 0 }}>
            This one mechanism is the backbone of almost everything &quot;agentic.&quot;
            Search, code execution, database lookups, booking, sending messages —
            all of it is the model choosing functions and reading their results,
            often several in a row.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And because <em>your</em> code sits in the middle, you decide what
            the model is even allowed to attempt.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-agents",
      prompt: "Why is function calling the foundation of AI agents?",
      choices: [
        {
          text: "It lets a model loop: pick a tool, read the result, decide the next action toward a goal",
          correct: true,
          feedback:
            "Exactly — chain those calls together and a text predictor becomes something that gets things done.",
        },
        {
          text: "It makes the model respond faster",
          feedback:
            "Tool calls usually add steps and latency — the win is capability, not speed.",
        },
        {
          text: "It removes the need for a model at all",
          feedback:
            "The model is the one choosing which functions to call — it's central, not optional.",
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
            Function calling is the bridge between a model that only writes text
            and a world full of things to do. The model names the action; your
            code performs it and reports back.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Wire a loop around that bridge and you have an <strong>agent</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
