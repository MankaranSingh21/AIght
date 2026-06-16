import type { Lesson } from "@/lib/lessons";
import ReasoningModelsDemo from "@/components/learn/ReasoningModelsDemo";

const lesson: Lesson = {
  slug: "reasoning-models",
  title: "Reasoning Models",
  tagline: "Models that stop and think before they answer.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most models answer the instant you hit enter. A{" "}
            <strong>reasoning model</strong> pauses first — working through the
            problem privately, sometimes for many seconds, before it says a
            word.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That pause is the point. It&apos;s spending extra computation at
            answer time to think the problem through.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "vs-cot",
      eyebrow: "More than a prompt trick",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You can coax any model to reason by writing &quot;think step by
            step.&quot; A reasoning model has this <em>trained in</em> — usually
            with reinforcement learning that rewards reaching correct answers —
            so it generates a long internal chain by default and checks its own
            work as it goes.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The lever it pulls is <strong>test-time compute</strong>: think
            longer, get further. More thinking tokens, better answers — up to a
            point.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What most distinguishes a reasoning model from a standard one?",
      choices: [
        {
          text: "It has read more of the internet",
          feedback:
            "Knowledge isn't the difference. A reasoning model spends more effort thinking, not more data memorising.",
        },
        {
          text: "It spends extra computation working through steps before committing to an answer",
          correct: true,
          feedback:
            "Right — it trades time and tokens at answer-time for a better-reasoned result.",
        },
        {
          text: "It never makes mistakes",
          feedback:
            "It still errs — it's just better on problems that need several reasoning steps.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a fast answer and a reasoned answer race the same hard problem.
          One is quick; the other is right.
        </p>
      ),
      demo: ReasoningModelsDemo,
      tryThis: "Notice the reasoning model spends its time before answering, not after.",
    },
    {
      kind: "check",
      id: "check-when",
      prompt: "When is reaching for a reasoning model worth it?",
      choices: [
        {
          text: "A multi-step math, logic, or coding problem where a wrong leap is easy",
          correct: true,
          feedback:
            "Yes — the harder the chain of reasoning, the more that extra thinking pays off.",
        },
        {
          text: "Reformatting a list into a table",
          feedback:
            "A simple mechanical task gains little from deliberation — a fast model is the better fit.",
        },
        {
          text: "Looking up a capital city",
          feedback:
            "One-step recall doesn't need reasoning — you'd just pay more for the same answer.",
        },
      ],
    },
    {
      kind: "explain",
      id: "tradeoff",
      eyebrow: "The bill comes due",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Thinking isn&apos;t free. All those internal tokens mean reasoning
            models are <strong>slower</strong> and <strong>cost more</strong> per
            answer. On easy tasks that&apos;s pure waste — same result, higher
            bill, longer wait.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The skill is matching the model to the task: fast models for the
            many simple things, reasoning models for the few genuinely hard ones.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-cost",
      prompt: "What's the main cost of a reasoning model's extra thinking?",
      choices: [
        {
          text: "It permanently changes its own weights each time",
          feedback:
            "No training happens at answer-time — the thinking is generated tokens, not weight updates.",
        },
        {
          text: "More latency and higher cost, since all those reasoning tokens take time and money",
          correct: true,
          feedback:
            "Exactly — you pay in seconds and tokens for the deeper thinking.",
        },
        {
          text: "It forgets the original question",
          feedback:
            "It keeps the question in context throughout — the cost is time and tokens, not memory.",
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
            A reasoning model buys accuracy on hard problems with time and
            compute. It&apos;s not &quot;smarter&quot; everywhere — it&apos;s a
            model that knows how to spend more effort when effort is what the
            problem needs.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Use the deliberate thinker for the hard call, the quick one for
            everything else.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
