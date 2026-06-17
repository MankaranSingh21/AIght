import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "features-and-labels",
  title: "Features & Labels",
  tagline: "The inputs and the answer key that teach a model.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Most classic machine learning boils down to two columns of thinking:
            the things you <em>know</em>, and the thing you want to{" "}
            <em>predict</em>. Get clear on which is which and half the jargon
            evaporates.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The things you know are <strong>features</strong>. The thing you want
            is the <strong>label</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "example",
      eyebrow: "A concrete example",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Predicting house prices? The features are square footage, number of
            bedrooms, postcode, age. The label is the price. Filtering spam? The
            features are the words and sender; the label is spam-or-not.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The model&apos;s whole job is to learn the relationship from features
            to label — so that, given new features, it can guess the label it
            hasn&apos;t been told.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-label",
      prompt: "In supervised learning, what is a 'label'?",
      choices: [
        {
          text: "The correct answer the model is trained to predict",
          correct: true,
          feedback:
            "Right — features are the inputs, the label is the target answer.",
        },
        {
          text: "The name of the dataset file",
          feedback:
            "That's just a filename — a label is the ground-truth output for each example.",
        },
        {
          text: "A tag the model invents on its own",
          feedback:
            "Labels are supplied by humans or a process; inventing them is unsupervised territory.",
        },
      ],
    },
    {
      kind: "explain",
      id: "supervised",
      eyebrow: "Why labels are precious",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Learning from labelled examples is called <em>supervised</em> learning
            — supervised because each example comes with the right answer attached.
            Those answers usually have to be created by people, which makes good
            labels slow and expensive: the real bottleneck in many projects.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            No labels? Then you&apos;re in unsupervised territory, where the model
            finds structure with no answer key at all.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-feature",
      prompt: "You're predicting whether a loan will be repaid. Which is a feature, not the label?",
      choices: [
        {
          text: "The applicant's income",
          correct: true,
          feedback:
            "Right — income is an input you know. The label is the thing you're predicting: repaid or not.",
        },
        {
          text: "Whether the loan was actually repaid",
          feedback:
            "That's the label — the outcome you're trying to predict, not an input feature.",
        },
        {
          text: "The model's final accuracy score",
          feedback:
            "That's an evaluation metric, not a feature of any single example.",
        },
      ],
    },
    {
      kind: "explain",
      id: "feature-quality",
      eyebrow: "Features make or break it",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Which features you choose often matters more than which algorithm you
            use. Give the model irrelevant inputs and it learns noise; give it the
            right ones and a simple model can shine. Picking and shaping good
            features — <em>feature engineering</em> — is a craft in itself.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            And beware features that secretly leak the answer — they make training
            look brilliant and deployment fail.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-leak",
      prompt: "A model predicting illness uses 'was prescribed the treatment' as a feature. Why is that a problem?",
      choices: [
        {
          text: "It leaks the answer — that feature is only known because of the outcome you're predicting",
          correct: true,
          feedback:
            "Right — label leakage flatters training accuracy and collapses in the real world, where you don't have it yet.",
        },
        {
          text: "It's fine — more features are always better",
          feedback:
            "Not when a feature encodes the answer. Leakage is a classic, costly trap.",
        },
        {
          text: "Because it makes the dataset bigger",
          feedback:
            "Size isn't the issue — the issue is that the feature wouldn't be available at prediction time honestly.",
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
            Features are the inputs you know; the label is the answer you want.
            Supervised learning maps one to the other from labelled examples — and
            the quality of your features (and the honesty of them) decides how far
            the model gets.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Once you have features and labels, the next question is how to tell if
            the model actually learned: <strong>training vs testing</strong>.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
