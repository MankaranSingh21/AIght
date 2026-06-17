import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "bias-in-data",
  title: "Bias in Data",
  tagline: "A model is a mirror — and mirrors don't flatter.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            People imagine biased AI as a model with a bad attitude. It&apos;s
            almost never that. The bias was in the data long before the model
            saw it — and the model simply learned the pattern, faithfully, the way
            it learns everything else.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            A model is a mirror of its training data. If the world it was shown
            was skewed, so is the reflection.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "where",
      eyebrow: "Where it comes from",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Bias creeps in through what gets collected (some groups over- or
            under-represented), how it&apos;s labelled (human judgments carry human
            assumptions), and what counts as the &quot;right&quot; answer
            (historical decisions that were themselves unfair).
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Train a hiring model on a company&apos;s past hires and it learns to
            repeat that history — including the parts the company would rather not
            repeat.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-where",
      prompt: "Where does most harmful bias in AI systems originate?",
      choices: [
        {
          text: "Patterns and imbalances in the training data and its labels",
          correct: true,
          feedback:
            "Right — models absorb the skews of their data and how it was labelled.",
        },
        {
          text: "Random electrical noise in the hardware",
          feedback:
            "Bias is systematic, not random — it traces back to data and design choices.",
        },
        {
          text: "The user's phrasing, and nothing else",
          feedback:
            "Phrasing can surface bias, but the bias was learned from data first.",
        },
      ],
    },
    {
      kind: "explain",
      id: "amplify",
      eyebrow: "It doesn't just copy — it amplifies",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Worse than mirroring, models can <em>magnify</em> a skew. If a
            pattern holds 70% of the time in the data, a model optimising for the
            most likely answer may apply it 100% of the time — turning a tendency
            into a rule, and a rule into a feedback loop when its outputs become
            tomorrow&apos;s data.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Small imbalances in, larger imbalances out.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-amplify",
      prompt: "How can a model make a mild bias in the data worse?",
      choices: [
        {
          text: "By optimising for the most likely answer, it can turn a 70% tendency into a near-universal rule",
          correct: true,
          feedback:
            "Right — models can amplify skews, and feedback loops can entrench them further.",
        },
        {
          text: "It can't — a model's output is always less biased than its data",
          feedback:
            "Often the opposite — amplification is a well-documented risk, not a guaranteed reduction.",
        },
        {
          text: "By randomly flipping some predictions",
          feedback:
            "Amplification is systematic, not random noise — it sharpens the existing skew.",
        },
      ],
    },
    {
      kind: "explain",
      id: "fix",
      eyebrow: "Why it's hard to fix",
      body: (
        <>
          <p style={{ margin: 0 }}>
            You can&apos;t just tell a model &quot;be fair.&quot; Bias hides in
            proxies — a postcode standing in for race, a gap in a résumé standing
            in for caregiving. Remove the obvious field and the model finds the
            shadow of it elsewhere. There isn&apos;t even one agreed definition of
            &quot;fair.&quot;
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Mitigation is real work: auditing data, testing outcomes across
            groups, and deciding — explicitly — what fairness means here.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-fix",
      prompt: "Why isn't deleting the sensitive column (like race) enough to remove bias?",
      choices: [
        {
          text: "Other fields act as proxies, so the model reconstructs the pattern from their shadows",
          correct: true,
          feedback:
            "Right — postcode, name, and more can stand in for the removed attribute. Bias has to be audited, not just hidden.",
        },
        {
          text: "Deleting a column is impossible",
          feedback:
            "It's easy to delete — the problem is that correlated proxies remain.",
        },
        {
          text: "Because that makes the model larger",
          feedback:
            "Size is unrelated — the issue is proxy variables carrying the same information.",
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
            Bias in AI is mostly bias in data — learned faithfully, sometimes
            amplified, and stubborn because it lives in proxies and definitions,
            not a single fixable field. The model isn&apos;t prejudiced; it&apos;s
            obedient to what it was shown.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Which is exactly why what you feed a model is never a neutral choice.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
