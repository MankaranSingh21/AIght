import type { Lesson } from "@/lib/lessons";

const lesson: Lesson = {
  slug: "gpus-and-compute",
  title: "GPUs & Compute",
  tagline: "Why the AI race is, underneath, a race for raw horsepower.",
  minutes: 5,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Behind every breakthrough model is a deeply unglamorous fact: somebody
            ran an enormous amount of arithmetic, very fast, for a very long time.
            The chips that do it — mostly GPUs — have become one of the most
            fought-over resources in tech.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Understand <strong>compute</strong> and a lot of the industry&apos;s
            moves suddenly make sense.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "why-gpu",
      eyebrow: "Many small sums, all at once",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Neural networks are, underneath, mountains of matrix multiplication —
            the same simple arithmetic repeated billions of times. A CPU has a few
            powerful cores that work mostly one thing at a time. A GPU has thousands
            of simpler cores that do many at once.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            For a workload that&apos;s the same operation over and over, thousands
            of small workers crush a few big ones. That parallelism is the whole
            reason GPUs run AI.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-why",
      prompt: "Why are GPUs central to modern AI?",
      choices: [
        {
          text: "They do the massively parallel matrix math training needs, far faster than CPUs",
          correct: true,
          feedback:
            "Right — neural nets are mostly matrix multiplications, and GPUs excel at doing many in parallel.",
        },
        {
          text: "They store the training data",
          feedback:
            "Storage is disks — GPUs do the heavy parallel computation.",
        },
        {
          text: "They write the model's code",
          feedback:
            "They run the math; they don't author code.",
        },
      ],
    },
    {
      kind: "explain",
      id: "compute-currency",
      eyebrow: "Compute is the currency",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Training a frontier model can mean thousands of GPUs running for months
            — a bill in the tens or hundreds of millions of dollars, and a serious
            chunk of electricity. &quot;Compute&quot; — total arithmetic, often
            measured in GPU-hours or FLOPs — has become a currency: the thing labs
            buy, hoard, and compete over.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            It&apos;s also one of the three levers in the scaling laws: more
            compute, predictably better models.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-currency",
      prompt: "What does 'compute' refer to as a resource in AI?",
      choices: [
        {
          text: "The total amount of arithmetic available to train or run models — bought, measured, and competed over",
          correct: true,
          feedback:
            "Right — measured in things like GPU-hours or FLOPs, it's a core constraint and a scaling-law lever.",
        },
        {
          text: "The model's stored knowledge",
          feedback:
            "Knowledge lives in the weights — compute is the raw processing used to create and run them.",
        },
        {
          text: "The number of users a model has",
          feedback:
            "That's adoption — compute is the underlying processing horsepower.",
        },
      ],
    },
    {
      kind: "explain",
      id: "consequences",
      eyebrow: "Why it shapes everything",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Because compute is scarce and expensive, it shapes the whole field:
            chip shortages make headlines, access to GPUs decides who can train
            big models, and a lot of research is really about doing <em>more with
            less</em> — quantization, distillation, efficient architectures, all
            chasing the same goal of stretching limited compute further.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Follow the compute and you can often predict where the field is headed.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-efficiency",
      prompt: "Why is so much AI research aimed at efficiency (quantization, distillation, etc.)?",
      choices: [
        {
          text: "Compute is scarce and costly, so squeezing more capability from less of it is hugely valuable",
          correct: true,
          feedback:
            "Right — when horsepower is the bottleneck, doing more with less compute is a direct win.",
        },
        {
          text: "Because efficiency has no effect on cost or access",
          feedback:
            "It has a big effect — less compute per result means lower cost and wider access.",
        },
        {
          text: "Because models work better when they're slower",
          feedback:
            "The goal is the same quality for less compute, not slower models.",
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
            GPUs power AI because neural networks are massively parallel arithmetic,
            and compute — the total of that arithmetic — has become a scarce,
            strategic resource that shapes who builds what. Much of the field is a
            quiet contest over horsepower and how efficiently to use it.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Models, data, and compute — the three forces behind everything AI does.
            You now have the whole picture.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
