import type { Lesson } from "@/lib/lessons";
import AlignmentDemo from "@/components/learn/AlignmentDemo";

const lesson: Lesson = {
  slug: "alignment",
  title: "Alignment",
  tagline: "Making a capable model actually want what we want.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Imagine a wildly capable assistant that does <em>exactly</em> what
            you ask — and you ask it to &quot;get rid of my spam,&quot; so it
            deletes your whole inbox. Technically obedient. Completely wrong.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Alignment</strong> is the work of closing the gap between
            what we say, what we mean, and what we actually value.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "two-things",
      eyebrow: "Capable ≠ aligned",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Capability is whether a model <em>can</em> do something. Alignment is
            whether it does the thing we&apos;d actually want. They&apos;re
            separate axes: a model can be highly capable and badly aligned, or
            safe but useless.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And the target is slippery, because we can never fully write down
            everything we mean. &quot;Be helpful&quot; hides a thousand unspoken
            &quot;but not like <em>that</em>&quot;s.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "What does AI alignment refer to?",
      choices: [
        {
          text: "Getting a model's goals and behaviour to match human intentions and values",
          correct: true,
          feedback:
            "Right — not just what we literally said, but what we actually meant and care about.",
        },
        {
          text: "Lining up the text neatly on the screen",
          feedback:
            "Different 'alignment' entirely — this is about behaviour matching human intent.",
        },
        {
          text: "Synchronising the servers in a data centre",
          feedback:
            "That's infrastructure. Alignment is about what the model is trying to do.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Watch a capable system pursue a literal goal — and notice the moment
          &quot;doing what it was told&quot; parts ways with &quot;doing what we
          wanted.&quot;
        </p>
      ),
      demo: AlignmentDemo,
      tryThis: "The failure isn't a lack of skill — it's aiming that skill at the wrong target.",
    },
    {
      kind: "check",
      id: "check-vs-capability",
      prompt: "A more capable model is automatically a more aligned one. True?",
      choices: [
        {
          text: "True — smarter means safer",
          feedback:
            "Not so — capability and alignment are separate. A more capable model can pursue a wrong goal more effectively.",
        },
        {
          text: "False — capability and alignment are different things; more skill can even raise the stakes of misalignment",
          correct: true,
          feedback:
            "Exactly — power without the right goal is more dangerous, not less.",
        },
      ],
    },
    {
      kind: "explain",
      id: "why-hard",
      eyebrow: "Why it's hard",
      body: (
        <>
          <p style={{ margin: 0 }}>
            We align models with proxies — human ratings, written principles —
            because we can&apos;t hand a model &quot;human values&quot; directly.
            But optimise any proxy hard enough and it bends: a model learns to
            <em> look</em> good to raters rather than <em>be</em> good. That&apos;s
            why RLHF and constitutional AI exist, and why neither is the last word.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Alignment isn&apos;t a checkbox you tick once. It&apos;s an ongoing
            negotiation between what we can measure and what we actually want.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-proxy",
      prompt: "Why can optimising a proxy (like human approval) go wrong?",
      choices: [
        {
          text: "The model can learn to game the proxy — looking good to raters instead of being good",
          correct: true,
          feedback:
            "Right — push any stand-in hard enough and it stops tracking the real thing you cared about.",
        },
        {
          text: "Proxies always perfectly capture human values",
          feedback:
            "If they did, alignment would be solved. The gap between proxy and value is exactly the problem.",
        },
        {
          text: "Because human approval can't be measured at all",
          feedback:
            "It can be measured — the trouble is that optimising the measure distorts it.",
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
            Alignment is steering a capable system toward what humans actually
            intend — separate from how capable it is, and hard precisely because
            we can&apos;t fully specify what we mean. The more powerful the model,
            the more the aim matters.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            One concrete attempt to instil good behaviour from written rules is{" "}
            <strong>constitutional AI</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
