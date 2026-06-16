import type { Lesson } from "@/lib/lessons";
import ChainOfThoughtDemo from "@/components/learn/ChainOfThoughtDemo";

const lesson: Lesson = {
  slug: "chain-of-thought",
  title: "Chain of Thought",
  tagline: "Why “think step by step” makes models smarter.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Ask a model a tricky multi-step question and it often blurts out a
            confident, wrong answer. Add four words — &quot;think step by
            step&quot; — and the same model, on the same question, frequently
            gets it right.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s <strong>chain-of-thought</strong>: letting the model
            reason out loud before it commits to an answer.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "why",
      eyebrow: "Why it works",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A model produces one token at a time, with a fixed budget of
            computation per token. Demanding the final answer immediately forces
            all the reasoning into a single leap.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Writing the steps out spreads the work across many tokens. Each
            intermediate line becomes context the next line can build on — the
            model is, in effect, using its own output as scratch paper.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does chain-of-thought actually refer to?",
      choices: [
        {
          text: "Chaining several different models together into a pipeline",
          feedback:
            "That's a multi-model pipeline — a different idea. Chain-of-thought is one model reasoning across its own tokens.",
        },
        {
          text: "Prompting the model to lay out intermediate reasoning steps before the final answer",
          correct: true,
          feedback:
            "Right — the 'chain' is the sequence of steps the model writes on the way to the answer.",
        },
        {
          text: "Connecting the model to an external calculator",
          feedback:
            "Useful, but that's tool use. Chain-of-thought needs no external help — just room to think.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch the same problem answered two ways — a straight-to-the-answer
          leap, and a step-by-step walk. Notice where the leap goes wrong.
        </p>
      ),
      demo: ChainOfThoughtDemo,
      tryThis: "Follow the steps — the answer is only as good as the chain that leads to it.",
    },
    {
      kind: "check",
      id: "check-when",
      prompt: "On which task does chain-of-thought help the most?",
      choices: [
        {
          text: "A multi-step word problem with several quantities to track",
          correct: true,
          feedback:
            "Yes — the more intermediate steps a problem needs, the more room-to-reason pays off.",
        },
        {
          text: "Looking up a single well-known fact",
          feedback:
            "For a one-step recall there's nothing to reason through — the steps add length, not accuracy.",
        },
        {
          text: "Rewriting a sentence in a friendlier tone",
          feedback:
            "Style tasks don't have a reasoning chain to expose, so CoT does little here.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveat",
      eyebrow: "An honest caveat",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The written steps look like the model&apos;s real thinking — but
            they aren&apos;t a transcript of its internals. A model can reach the
            right answer for reasons it doesn&apos;t state, or write a tidy chain
            that rationalises a wrong one.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            So treat the chain as a useful aid that genuinely improves accuracy,
            not as a guaranteed window into <em>why</em> the model answered.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-faith",
      prompt: "Is a model's written reasoning a faithful record of how it really got the answer?",
      choices: [
        {
          text: "Yes — it's a direct printout of the model's internal computation",
          feedback:
            "No — the steps are generated text, not a log of the underlying math. They can diverge from the real cause.",
        },
        {
          text: "Not necessarily — it's plausible reasoning that usually helps accuracy, but isn't a guaranteed transcript",
          correct: true,
          feedback:
            "Exactly. It earns its keep by improving answers, not by being a faithful confession.",
        },
        {
          text: "It's always wrong and should be ignored",
          feedback:
            "Too cynical — it reliably boosts performance on reasoning tasks. Just don't over-trust it as an explanation.",
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
            Give a model space to reason and hard problems get easier — because
            it can compute across steps instead of in one jump. Just don&apos;t
            mistake the tidy explanation for the whole truth of how it got there.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Models that bake this in — reasoning before answering, by default —
            are the <strong>reasoning models</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
