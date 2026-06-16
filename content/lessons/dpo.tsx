import type { Lesson } from "@/lib/lessons";
import DpoDemo from "@/components/learn/DpoDemo";

const lesson: Lesson = {
  slug: "dpo",
  title: "DPO",
  tagline: "Aligning a model to preferences — without the reinforcement-learning machinery.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            RLHF works, but it&apos;s a contraption: collect preferences, train a
            separate reward model, then run finicky reinforcement learning
            against it. Lots of moving parts, lots of ways to wobble.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            <strong>Direct Preference Optimization</strong> asks: what if we
            skipped the middle entirely and trained on the preferences directly?
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "how",
      eyebrow: "Straight from the pairs",
      body: (
        <>
          <p style={{ margin: 0 }}>
            DPO uses the same raw material as RLHF — pairs of answers where a
            human marked one &quot;chosen&quot; and one &quot;rejected.&quot; But
            instead of distilling those into a reward model and doing RL, it
            adjusts the model directly: make the chosen answer more likely, the
            rejected one less.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            No reward model. No reinforcement-learning loop. Just a more
            straightforward training objective on the preference data.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-what",
      prompt: "How does DPO differ from RLHF?",
      choices: [
        {
          text: "It needs no human preferences at all",
          feedback:
            "It still needs the chosen/rejected pairs — that's the shared input. What it drops is the machinery after.",
        },
        {
          text: "It optimises the model directly on preference pairs, with no separate reward model or RL loop",
          correct: true,
          feedback:
            "Right — same preferences, simpler path: it skips the reward model and the reinforcement learning.",
        },
        {
          text: "It replaces fine-tuning with a bigger prompt",
          feedback:
            "DPO is a training method that updates weights — not a prompting trick.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          See the same preference pair drive alignment two ways — the RLHF
          pipeline versus DPO&apos;s direct route to the same destination.
        </p>
      ),
      demo: DpoDemo,
      tryThis: "Same chosen/rejected data — fewer steps to get there.",
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why do teams often reach for DPO over classic RLHF?",
      choices: [
        {
          text: "It's simpler and more stable to train, with fewer moving parts to tune",
          correct: true,
          feedback:
            "Exactly — dropping the reward model and RL loop removes a lot of fragility.",
        },
        {
          text: "It guarantees a strictly better model every time",
          feedback:
            "Not guaranteed — results vary by setup. The reliable win is simplicity, not universal superiority.",
        },
        {
          text: "It needs no training data or compute",
          feedback:
            "It still trains on preference data and costs compute — just with a leaner pipeline.",
        },
      ],
    },
    {
      kind: "explain",
      id: "same-goal",
      eyebrow: "Same goal, same caveats",
      body: (
        <>
          <p style={{ margin: 0 }}>
            DPO is a different <em>route</em>, not a different destination.
            It&apos;s still aligning the model to whatever humans preferred — so
            it inherits the same shadows as RLHF: it can learn to be sycophantic,
            or to game the patterns in the preference data.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Cleaner pipeline, same hard truth: the model becomes whatever the
            preferences rewarded.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-goal",
      prompt: "DPO and RLHF ultimately aim at the same thing. What is it?",
      choices: [
        {
          text: "Aligning the model's behaviour to human preferences",
          correct: true,
          feedback:
            "Right — both turn 'people preferred this answer' into a model that produces more answers like it.",
        },
        {
          text: "Teaching the model brand-new facts",
          feedback:
            "Neither adds knowledge — they shape behaviour. Facts come from pretraining.",
        },
        {
          text: "Making the model smaller and faster",
          feedback:
            "That's quantization or distillation. DPO is about alignment, not size.",
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
            DPO reaches RLHF&apos;s goal — a model aligned to human preferences —
            by training on the preference pairs directly, no reward model or RL
            in between. Simpler to run, same caveats to watch.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s a big reason preference alignment got more accessible to
            teams without a research lab&apos;s worth of plumbing.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
