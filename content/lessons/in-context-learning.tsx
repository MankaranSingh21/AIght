import type { Lesson } from "@/lib/lessons";
import InContextLearningDemo from "@/components/learn/InContextLearningDemo";

const lesson: Lesson = {
  slug: "in-context-learning",
  title: "In-Context Learning",
  tagline: "Showing a model a few examples — and it just picks up the task.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Give a model two or three examples of a task right in the prompt —
            &quot;happy → 😊, sad → 😢, angry → ?&quot; — and it finishes the
            pattern. Nobody retrained it. It figured out the task on the spot,
            from the examples alone.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s <strong>in-context learning</strong>, and it was one of
            the genuine surprises of large language models.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "no-update",
      eyebrow: "Learning that leaves no trace",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The word &quot;learning&quot; is a little misleading. No weights
            change. The model isn&apos;t permanently smarter afterward — the
            moment the prompt ends, the lesson is gone. It &quot;learned&quot;
            the task only for that one request.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Showing examples like this is called <em>few-shot</em> prompting;
            zero examples is <em>zero-shot</em>. More examples often help — up to
            the limits of the context window.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What's the defining feature of in-context learning?",
      choices: [
        {
          text: "The model permanently learns from every conversation it has",
          feedback:
            "It doesn't — the effect vanishes when the prompt ends. Nothing is saved to the weights.",
        },
        {
          text: "It picks up a task from examples in the prompt, with no weight updates",
          correct: true,
          feedback:
            "Right — the 'learning' lives entirely inside that one prompt's context.",
        },
        {
          text: "It retrains the model overnight on the day's chats",
          feedback:
            "That would be fine-tuning. In-context learning changes nothing permanent.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Feed the model a few examples of a made-up task and watch it infer the
          rule, then apply it to a new case it&apos;s never seen.
        </p>
      ),
      demo: InContextLearningDemo,
      tryThis: "Change the examples and the model's behaviour changes with them — instantly.",
    },
    {
      kind: "check",
      id: "check-vs-ft",
      prompt: "How does in-context learning differ from fine-tuning?",
      choices: [
        {
          text: "Fine-tuning updates the weights permanently; in-context learning only shapes one response",
          correct: true,
          feedback:
            "Exactly — one is a lasting change to the model, the other is a temporary effect of the prompt.",
        },
        {
          text: "They're the same thing with different names",
          feedback:
            "Very different — one touches the weights, the other never does.",
        },
        {
          text: "In-context learning needs a GPU; fine-tuning doesn't",
          feedback:
            "If anything it's the reverse — fine-tuning is the compute-heavy one. The real difference is permanence.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-matters",
      eyebrow: "Why it changed everything",
      body: (
        <>
          <p style={{ margin: 0 }}>
            In-context learning is why one model can do thousands of tasks
            without a custom version for each. You don&apos;t train a new model
            to classify your tickets — you just show it a few labelled examples
            and ask. Prompting <em>is</em> programming, in this light.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It also has limits: the examples eat context, and a few samples
            can&apos;t teach genuinely new knowledge the model never had.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What's a real limit of in-context learning?",
      choices: [
        {
          text: "The examples take up context-window space, and a handful can't instil knowledge the model lacks",
          correct: true,
          feedback:
            "Right — it steers existing ability within the prompt; it doesn't add new facts or unlimited room.",
        },
        {
          text: "It permanently corrupts the model",
          feedback:
            "It changes nothing permanent — there's nothing to corrupt once the prompt ends.",
        },
        {
          text: "It only works in English",
          feedback:
            "It works across languages and tasks — the real limits are context length and prior ability.",
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
            In-context learning lets a model adapt to a task from a few examples
            in the prompt — powerful, instant, and completely temporary. It&apos;s
            the reason a single general model can wear a thousand hats.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Lean on it first. Reach for fine-tuning only when a prompt genuinely
            can&apos;t get you there.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
