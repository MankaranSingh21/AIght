import type { Lesson } from "@/lib/lessons";
import AgenticMemoryDemo from "@/components/learn/AgenticMemoryDemo";

const lesson: Lesson = {
  slug: "agentic-memory",
  title: "Agentic Memory",
  tagline: "Giving an agent something to remember beyond this conversation.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            An agent working on a long task hits a wall: the context window. Once
            the conversation outgrows it, the earliest steps — what it already
            tried, what you told it last week — silently fall off the edge. The
            agent gets amnesia mid-task.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Memory</strong> is the fix: a place to store things and pull
            them back when they&apos;re needed.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Write it down, look it up",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Rather than cram everything into the prompt, the agent writes
            important facts to an external store — notes, a vector database, a
            running summary. Later, it retrieves just the relevant pieces and
            slots them back into context.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s the difference between holding a whole book in your head and
            keeping a notebook you can flip back to.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is memory for an AI agent?",
      choices: [
        {
          text: "A way to store and recall information across steps or sessions, beyond the context window",
          correct: true,
          feedback:
            "Right — it lets the agent remember past actions and facts without keeping them all in the prompt.",
        },
        {
          text: "The RAM installed in the server it runs on",
          feedback:
            "Not hardware memory — it's the persisted, retrievable state the agent builds up while working.",
        },
        {
          text: "The knowledge baked into the model during training",
          feedback:
            "Training knowledge is fixed and general. Agentic memory is the specific stuff it accrues on the job.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch an agent store a fact, lose it from active context, then retrieve
          it again when the task calls for it.
        </p>
      ),
      demo: AgenticMemoryDemo,
      tryThis: "The fact leaves the prompt but not the agent — that's the whole point.",
    },
    {
      kind: "check",
      id: "check-vs-context",
      prompt: "Why not just make the context window huge and skip memory entirely?",
      choices: [
        {
          text: "Even big windows fill up and get slow and costly; memory lets the agent keep only what's relevant in context",
          correct: true,
          feedback:
            "Right — retrieval beats brute force. Pull back the relevant note instead of carrying everything, always.",
        },
        {
          text: "Large context windows don't exist",
          feedback:
            "They do — but they're finite, pricier, and can dilute attention. Memory is more than a stopgap.",
        },
        {
          text: "Because memory is faster than reading the prompt",
          feedback:
            "It's not about raw speed — it's about not having to hold everything at once.",
        },
      ],
    },
    {
      kind: "explain",
      id: "hard-parts",
      eyebrow: "The hard parts",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Memory raises new questions. What&apos;s worth remembering? When
            should something be forgotten or updated? Retrieve the wrong note and
            you&apos;ve handed the agent a stale or irrelevant fact — sometimes
            worse than no memory at all.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Good memory is as much about <em>forgetting</em> and <em>choosing</em>
            {" "}as it is about storing.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-risk",
      prompt: "What's a real risk of an agent's memory system?",
      choices: [
        {
          text: "Retrieving a stale or irrelevant memory and acting on it as if it were current",
          correct: true,
          feedback:
            "Right — bad recall can be worse than none. Deciding what to keep, drop, and surface is the hard craft.",
        },
        {
          text: "It makes the agent forget how to speak",
          feedback:
            "Language ability comes from the model and isn't touched by the memory store.",
        },
        {
          text: "It permanently rewrites the model's weights",
          feedback:
            "Memory lives outside the model — nothing is written into the weights.",
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
            Agentic memory gives an agent continuity past the context window — a
            notebook to store and retrieve what matters across a long task or
            many sessions. The craft is in choosing what to keep and what to
            surface, not just hoarding everything.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Give several memory-equipped agents distinct roles and you get a{" "}
            <strong>multi-agent</strong> system.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
