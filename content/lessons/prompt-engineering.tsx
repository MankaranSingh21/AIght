import type { Lesson } from "@/lib/lessons";
import PromptEngineeringDemo from "@/components/learn/PromptEngineeringDemo";

const lesson: Lesson = {
  slug: "prompt-engineering",
  title: "Prompt Engineering",
  tagline: "Mostly the craft of saying what you actually want.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A language model is a conditional probability machine: everything
            you put in the prompt — every word, structure, and example — shifts
            the probabilities of what comes out.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Ask &quot;what are the pros and cons of X?&quot; and you get a
            balanced list. Ask &quot;why is X a good idea?&quot; and the model
            leans toward agreement. Same knowledge, different frame, different
            answer.
          </p>
        </>
      ),
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Toggle between a vague prompt and a specific one. Watch the output
          change.
        </p>
      ),
      demo: PromptEngineeringDemo,
      tryThis: "Notice it's specificity doing the work — not magic words.",
    },
    {
      kind: "check",
      id: "check-specific",
      prompt: "Which prompt will most reliably produce something usable?",
      choices: [
        {
          text: "“Write a good email”",
          feedback:
            "Generic in, generic out — “good” activates the blandest patterns the model knows.",
        },
        {
          text: "“Write a three-sentence follow-up from a consultant to a client who missed a deadline — professional, warm, no passive aggression”",
          correct: true,
          feedback:
            "Right — the level of detail you'd give a competent stranger. That's most of the craft.",
        },
        {
          text: "“You are the world's greatest email writer. Write an email.”",
          feedback:
            "Flattery is not specification — the model still doesn't know what you want.",
        },
      ],
    },
    {
      kind: "explain",
      id: "fewshot",
      eyebrow: "The highest-leverage technique",
      body: (
        <>
          <p style={{ margin: 0 }}>
            <strong>Zero-shot</strong>: describe the task, let the model handle
            it. Fine for anything common in training data.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Few-shot</strong>: show two or three examples of the
            input → output you want before your real query. For consistent
            formatting and style, this is the single highest-leverage technique
            there is.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-fewshot",
      prompt:
        "Your model keeps formatting its answers inconsistently. What's the highest-leverage fix?",
      choices: [
        {
          text: "Raise the temperature so it explores more formats",
          feedback:
            "That adds variation — the exact opposite of what consistency needs.",
        },
        {
          text: "Show 2–3 examples of the exact output format before the real query",
          correct: true,
          feedback:
            "Few-shot prompting. The examples pin down the pattern far more reliably than instructions alone.",
        },
        {
          text: "Ask the model to “be more consistent”",
          feedback:
            "Vague meta-instructions barely move the needle compared to showing the format.",
        },
      ],
    },
    {
      kind: "explain",
      id: "order",
      eyebrow: "Position matters",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Information near the start and end of a long prompt gets more
            weight. Burying your main constraint in the middle is genuinely
            risky — the model can simply miss it (the &quot;lost in the
            middle&quot; effect).
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Lead with the role and the task; end with the constraint you care
            about most.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-order",
      prompt:
        "You have one non-negotiable constraint in a long prompt. Where does it go?",
      choices: [
        {
          text: "Buried in the middle, where the detail lives",
          feedback:
            "The middle is exactly where attention sags — that's the riskiest slot in the prompt.",
        },
        {
          text: "At the start or the end, where models weight information most",
          correct: true,
          feedback:
            "Right — and repeating it at both ends is a legitimate trick for long prompts.",
        },
        {
          text: "In a separate message sent afterwards as a reminder",
          feedback:
            "Sometimes workable in chat, but within a single prompt, position is the lever you control.",
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
            Prompting isn&apos;t incantation. It&apos;s specificity, examples,
            and position — being honest about what you want, in the detail
            you&apos;d give a competent stranger.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            When one prompt isn&apos;t enough and the model needs to act in
            steps, you&apos;re looking at <strong>agents</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
