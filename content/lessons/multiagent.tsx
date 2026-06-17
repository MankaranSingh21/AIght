import type { Lesson } from "@/lib/lessons";
import MultiagentDemo from "@/components/learn/MultiagentDemo";

const lesson: Lesson = {
  slug: "multiagent",
  title: "Multi-Agent Systems",
  tagline: "When several AI agents split the work — and check each other.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            One agent doing everything — planning, researching, writing, checking
            — can lose the thread on a big task. So instead of one generalist,
            you assemble a team: several agents, each with a role, working
            together.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s a <strong>multi-agent system</strong>: a planner, a
            researcher, a critic, handing work back and forth.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "why",
      eyebrow: "Roles and second opinions",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Two things make this powerful. <em>Specialisation</em>: a focused
            prompt and toolset per role beats one agent juggling everything.
            And <em>cross-checking</em>: when one agent&apos;s job is to critique
            another&apos;s output, mistakes get caught that a lone agent would
            sail right past.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A critic that only has to ask &quot;is this right?&quot; is a
            surprisingly strong safety net.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What is a multi-agent system?",
      choices: [
        {
          text: "Several agents, often with different roles, coordinating on a task",
          correct: true,
          feedback:
            "Right — a team of agents dividing the work and handing off to each other.",
        },
        {
          text: "One agent simply run several times in parallel for speed",
          feedback:
            "That's parallelism. Multi-agent means distinct, cooperating agents — usually with different jobs.",
        },
        {
          text: "A single model with a larger memory store",
          feedback:
            "More memory isn't more agents — the defining feature is multiple coordinating agents.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a small team tackle a task — each agent taking its role, passing
          work along, and catching what the others missed.
        </p>
      ),
      demo: MultiagentDemo,
      tryThis: "Notice the critic's job isn't to do the work — it's to find what's wrong with it.",
    },
    {
      kind: "check",
      id: "check-benefit",
      prompt: "Why can splitting a task across role-specialised agents beat one do-everything agent?",
      choices: [
        {
          text: "Focused roles plus agents that check each other catch errors a single agent would miss",
          correct: true,
          feedback:
            "Exactly — specialisation sharpens each step, and cross-checking is a real error filter.",
        },
        {
          text: "Because more agents always means a faster answer",
          feedback:
            "Often slower, actually — coordination adds steps. The win is quality and reliability, not speed.",
        },
        {
          text: "Because each agent needs a smaller model",
          feedback:
            "They typically share the same underlying model — the gain is from roles and review, not model size.",
        },
      ],
    },
    {
      kind: "explain",
      id: "cost",
      eyebrow: "It isn't free",
      body: (
        <>
          <p style={{ margin: 0 }}>
            More agents means more calls — more latency, more tokens, more cost.
            Coordination can go wrong too: agents talking past each other, looping,
            or confidently agreeing on a shared mistake. A team of agents can
            amplify a bad assumption as easily as a good idea.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So reach for multiple agents when a task genuinely has distinct
            stages — not as a reflex. Often one well-prompted agent is plenty.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-cost",
      prompt: "What's a real downside of a multi-agent setup?",
      choices: [
        {
          text: "More calls mean more cost and latency — and agents can loop or agree on the same wrong answer",
          correct: true,
          feedback:
            "Right — coordination has overhead and failure modes. Use it when the task truly has separate stages.",
        },
        {
          text: "It's impossible to have agents review each other",
          feedback:
            "Cross-review is one of its main strengths — very much possible and useful.",
        },
        {
          text: "Each agent must run on its own physical server",
          feedback:
            "They can share infrastructure — the real costs are tokens, latency, and coordination, not servers.",
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
            A multi-agent system divides a task among role-specialised agents and
            lets them check each other — sharper steps and a built-in error
            filter, at the price of more cost and coordination. Powerful for
            genuinely multi-stage work, overkill for the rest.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            More minds help only when the problem actually has parts to divide.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
