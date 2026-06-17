import type { Lesson } from "@/lib/lessons";
import ConstitutionalAiDemo from "@/components/learn/ConstitutionalAiDemo";

const lesson: Lesson = {
  slug: "constitutional-ai",
  title: "Constitutional AI",
  tagline: "Teaching a model to police itself against written principles.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            RLHF leans on armies of human raters judging which answer is safer.
            That&apos;s slow, costly, and asks people to read a lot of unpleasant
            text. What if the model could critique itself instead?
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Constitutional AI</strong> gives the model a short list of
            written principles — a &quot;constitution&quot; — and trains it to
            hold its own answers up against them.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Critique, then revise",
      body: (
        <>
          <p style={{ margin: 0 }}>
            The model drafts a response, then is asked: does this violate a
            principle? If so, rewrite it. It generates the critique and the
            improved answer itself, guided by the constitution rather than a
            human label on every example.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Those self-revised answers become training signal — so safety scales
            with compute instead of with the size of a labelling team.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does Constitutional AI train a model to do?",
      choices: [
        {
          text: "Critique and revise its own answers against a set of written principles",
          correct: true,
          feedback:
            "Right — the model self-corrects toward the constitution, cutting the need for human labels on every case.",
        },
        {
          text: "Memorise a country's actual legal constitution",
          feedback:
            "The 'constitution' is a set of behavioural principles, not a legal document.",
        },
        {
          text: "Follow no rules at all",
          feedback:
            "The opposite — it's explicitly governed by stated principles it checks itself against.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a first-draft answer get measured against a principle — and
          revised. The judge and the writer are the same model.
        </p>
      ),
      demo: ConstitutionalAiDemo,
      tryThis: "The improvement comes from the model checking itself, not from a human stepping in.",
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "What problem with RLHF does Constitutional AI most directly ease?",
      choices: [
        {
          text: "Its heavy reliance on human raters labelling huge volumes of (often unpleasant) examples",
          correct: true,
          feedback:
            "Exactly — moving the judging to the model itself makes safety training scale far more cheaply.",
        },
        {
          text: "That RLHF makes models too small",
          feedback:
            "RLHF doesn't change model size — the bottleneck it eases is human labelling effort.",
        },
        {
          text: "That RLHF can't run on GPUs",
          feedback:
            "Both run on GPUs — the difference is who does the judging, humans or the model.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveat",
      eyebrow: "The principles aren't magic",
      body: (
        <>
          <p style={{ margin: 0 }}>
            A constitution is only as good as what&apos;s written in it — and a
            model&apos;s reading of it. Vague or conflicting principles produce
            vague or conflicting behaviour, and the model can still misjudge.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It also makes the values explicit and inspectable, which is part of
            the appeal: you can read the rules a model was shaped by, instead of
            inferring them from a million private human ratings.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-limit",
      prompt: "What mostly determines how well Constitutional AI works?",
      choices: [
        {
          text: "How clear and well-chosen the written principles are — and how well the model interprets them",
          correct: true,
          feedback:
            "Right — garbage principles in, garbage behaviour out. The constitution is the lever.",
        },
        {
          text: "Nothing — it works perfectly regardless of the principles",
          feedback:
            "It's only as good as the principles and the model's reading of them — both can fall short.",
        },
        {
          text: "The speed of the GPU it runs on",
          feedback:
            "Hardware affects cost, not whether the principles capture what you actually want.",
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
            Constitutional AI swaps &quot;humans judge every answer&quot; for
            &quot;the model judges itself against written principles.&quot; It
            scales safety training and makes the governing values explicit — but
            only works as well as those principles are written.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s one concrete answer to the broader puzzle of{" "}
            <strong>alignment</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
