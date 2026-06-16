import type { Lesson } from "@/lib/lessons";
import DiffusionDemo from "@/components/learn/DiffusionDemo";

const lesson: Lesson = {
  slug: "diffusion",
  title: "Diffusion",
  tagline: "How image models sculpt a picture out of pure noise.",
  minutes: 6,
  steps: [
    {
      kind: "explain",
      id: "hook",
      eyebrow: "The idea",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Type &quot;an otter astronaut, oil painting&quot; and seconds later
            there it is. The model didn&apos;t find that picture anywhere. It
            built it — starting from a screen of random static and refining,
            step by step, until an otter emerged.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That refining-out-of-noise is <strong>diffusion</strong>.
          </p>
        </>
      ),
    },
    {
      kind: "explain",
      id: "forward-reverse",
      eyebrow: "Learn to undo the mess",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Training has a clever trick. Take a real image and add noise, a
            little at a time, until it&apos;s pure static — the easy direction.
            Then train a model to do the <em>hard</em> direction: predict and
            remove the noise, one step back toward the original.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            Do that across millions of images and the model learns what
            &quot;less noisy, more real&quot; looks like for almost anything.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-how",
      prompt: "How does a diffusion model generate a brand-new image?",
      choices: [
        {
          text: "It pastes together cropped pieces of images from its training set",
          feedback:
            "No collage. There are no stored image fragments to assemble — it generates from scratch.",
        },
        {
          text: "It starts from random noise and removes it step by step until a coherent image appears",
          correct: true,
          feedback:
            "Exactly — generation is the denoising direction, run from pure static.",
        },
        {
          text: "It looks up the closest matching image in a database",
          feedback:
            "There's no lookup table — the picture is synthesised pixel by pixel through denoising.",
        },
      ],
    },
    {
      kind: "interact",
      id: "demo",
      body: (
        <p style={{ margin: 0 }}>
          Run the denoising yourself. Each step strips away a little static and
          nudges the canvas toward something real.
        </p>
      ),
      demo: DiffusionDemo,
      tryThis: "Watch the first steps — structure appears before any fine detail does.",
    },
    {
      kind: "check",
      id: "check-myth",
      prompt: "Someone says a diffusion model just stitches together training images. Why is that wrong?",
      choices: [
        {
          text: "It is right — that's exactly how it works",
          feedback:
            "It isn't. The model holds no library of image pieces to stitch — it learned to denoise, not to copy.",
        },
        {
          text: "It starts from noise and denoises; it has no stored image fragments to stitch from",
          correct: true,
          feedback:
            "Right — the only thing it stores is how to remove noise, not the images themselves.",
        },
        {
          text: "Because it only ever makes abstract art",
          feedback:
            "It can render anything it was trained on — the point is it generates, it doesn't paste.",
        },
      ],
    },
    {
      kind: "explain",
      id: "guidance",
      eyebrow: "Where the prompt comes in",
      body: (
        <>
          <p style={{ margin: 0 }}>
            Left alone, denoising would drift toward <em>some</em> plausible
            image. Your text prompt acts as a steering wheel: at every step it
            pulls the denoising toward pictures that match the words. Push that
            steering harder and the image hugs the prompt more tightly.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            That&apos;s why the same prompt gives different images each run —
            different starting noise, same guiding pull.
          </p>
        </>
      ),
    },
    {
      kind: "check",
      id: "check-prompt",
      prompt: "What role does the text prompt play during generation?",
      choices: [
        {
          text: "It steers the denoising at each step toward images that match the words",
          correct: true,
          feedback:
            "Right — the prompt conditions every denoising step, guiding the noise toward your description.",
        },
        {
          text: "It selects a finished image from a folder named after the prompt",
          feedback:
            "There's no folder of finished images — the prompt guides synthesis, it doesn't pick a file.",
        },
        {
          text: "It only sets the image's file name",
          feedback:
            "The prompt shapes the actual pixels through guidance, not just metadata.",
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
            Diffusion learns one skill — remove a bit of noise — and runs it in
            reverse from static, steered by your words, until a picture forms.
            No collage, no lookup: just guided denoising.
          </p>
          <p style={{ margin: "1em 0 0" }}>
            The same idea of joining language to other kinds of output runs
            through <strong>multimodal</strong> models more broadly.
          </p>
        </>
      ),
    },
  ],
};

export default lesson;
