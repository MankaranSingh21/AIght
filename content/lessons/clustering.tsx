import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "clustering",
  title: "Clustering",
  tagline: "Finding the groups in your data when nobody labelled them.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Sometimes you don&apos;t have labels — just a pile of data and a hunch
            that there&apos;s structure in it. Customers who behave alike, articles
            about similar topics, readings that group into types. Nobody told the
            model the groups. It has to <em>find</em> them.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s <strong>clustering</strong>: discovering groups by
            similarity, with no answer key.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "unsupervised",
      eyebrow: "Learning without answers",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Clustering is the headline example of <em>unsupervised</em> learning.
            Where classification is handed labelled examples, clustering gets none
            — it groups points so that members of a group are similar to each
            other and different from the rest.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It doesn&apos;t know what the groups <em>mean</em>. It just finds that
            they exist. Naming them is your job.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-kind",
      prompt: "Clustering is an example of which kind of learning?",
      choices: [
        {
          text: "Unsupervised — it groups data without labels",
          correct: true,
          feedback:
            "Right — it finds structure on its own, with no answer key.",
        },
        {
          text: "Supervised — it needs labelled examples",
          feedback:
            "No labels required — that's exactly what makes clustering unsupervised.",
        },
        {
          text: "Reinforcement — it learns from rewards",
          feedback:
            "No reward signal here — clustering just groups similar points.",
        },
      ],
    },
    {
      kind: "explain",
      id: "uses",
      eyebrow: "What it's good for",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Clustering shines at exploration and segmentation: discovering customer
            types you didn&apos;t know to look for, grouping documents, spotting
            anomalies (points that fit no cluster), or compressing data into a few
            representative groups.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s how you find the categories <em>before</em> you have any —
            often a first step that later feeds a labelled, supervised task.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-use",
      prompt: "You have a year of customer data and no predefined segments. What can clustering do?",
      choices: [
        {
          text: "Surface natural groupings of similar customers you didn't know to define in advance",
          correct: true,
          feedback:
            "Right — it discovers the segments from the data, which you can then interpret and name.",
        },
        {
          text: "Predict each customer's exact future spend",
          feedback:
            "That's a regression task needing labels — clustering finds groups, it doesn't predict a target value.",
        },
        {
          text: "Tell you the officially correct number of customer types",
          feedback:
            "There's no official answer — clustering proposes groupings; how many is a judgment call.",
        },
      ],
    },
    {
      kind: "explain",
      id: "caveat",
      eyebrow: "The groups aren't truth",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Clustering will always return groups — even from random noise. The
            number of clusters is often something <em>you</em> choose, and
            different choices give different stories. So a clustering result is a
            hypothesis to investigate, not a fact handed down.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The algorithm finds patterns; deciding which ones are real and useful
            is still on you.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-caveat",
      prompt: "What's a healthy way to treat a clustering result?",
      choices: [
        {
          text: "As a hypothesis to investigate — it always returns groups, even from noise, and the count is often your choice",
          correct: true,
          feedback:
            "Right — clusters are a starting point for interpretation, not objective truth.",
        },
        {
          text: "As the single objectively correct grouping of the data",
          feedback:
            "There's rarely one correct answer — results depend on choices like the number of clusters and similarity measure.",
        },
        {
          text: "As proof that the groups are meaningful",
          feedback:
            "Finding groups doesn't prove they matter — you still have to validate that they're real and useful.",
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
            Clustering finds structure in unlabelled data by grouping similar
            points — unsupervised learning&apos;s signature move. It&apos;s
            powerful for discovery, but its groups are hypotheses you interpret,
            not truths it proves.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Whether your groups — or any model — are actually good comes down to{" "}
            <strong>evaluation metrics</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
