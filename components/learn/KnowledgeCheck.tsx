"use client";
import { useState, useEffect } from "react";

type MCQ = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const QUESTIONS: Record<string, MCQ[]> = {
  transformers: [
    {
      question: "What is the key innovation that makes transformers faster to train than RNNs?",
      options: ["Larger memory", "Parallel processing via self-attention", "Fewer parameters", "Recurrent loops"],
      correct: 1,
      explanation: "Transformers process all tokens in a sequence simultaneously using self-attention, unlike RNNs which process sequentially.",
    },
    {
      question: "What does 'attention' mean in a transformer?",
      options: ["The model pays more compute to longer inputs", "Each token learns to weight how much it should focus on every other token", "A filter that removes irrelevant words", "The number of layers in the model"],
      correct: 1,
      explanation: "Attention computes a weighted mix of other tokens' representations — each token asks 'how relevant is every other token to understanding me?'",
    },
    {
      question: "What is positional encoding used for?",
      options: ["Storing the model's memory", "Telling the model the order of tokens", "Compressing the input", "Reducing overfitting"],
      correct: 1,
      explanation: "Transformers have no inherent sense of order, so positional encodings inject sequence position information into each token embedding.",
    },
  ],
  rag: [
    {
      question: "What problem does RAG primarily solve?",
      options: ["Slow inference speed", "Knowledge cutoffs and hallucinations about facts", "High training costs", "Poor multilingual support"],
      correct: 1,
      explanation: "RAG retrieves up-to-date, relevant documents at inference time, grounding responses in real facts rather than relying on stale training data.",
    },
    {
      question: "What happens during the retrieval step in RAG?",
      options: ["The model is fine-tuned on new data", "Relevant document chunks are found using vector similarity search", "The model generates a draft answer", "User input is translated"],
      correct: 1,
      explanation: "The query is embedded and compared against a vector store; the closest chunks by cosine similarity are returned and added to the prompt.",
    },
    {
      question: "Why might RAG produce a wrong answer even with correct retrieved documents?",
      options: ["The model ignores the retrieved context", "The LLM may misread, misweight, or contradict the retrieved chunks", "The retrieval step adds too many tokens", "RAG cannot handle questions"],
      correct: 1,
      explanation: "Even with good retrieved chunks, the LLM can fail to faithfully use them — it may conflate retrieved facts with training priors.",
    },
  ],
  embeddings: [
    {
      question: "What is a text embedding?",
      options: ["A compressed image", "A dense numerical vector that captures semantic meaning", "A tokenised string", "A type of attention weight"],
      correct: 1,
      explanation: "Embeddings map text to a high-dimensional vector space where semantically similar texts are close together.",
    },
    {
      question: "Why can you do arithmetic with word embeddings?",
      options: ["Because they are integers", "Because their vector space encodes semantic relationships", "Because embeddings are randomly initialised", "You cannot — it's a myth"],
      correct: 1,
      explanation: "The geometry of embedding space reflects meaning: 'king − man + woman ≈ queen' because relationships are encoded as directional offsets.",
    },
    {
      question: "Which metric is most commonly used to compare embeddings?",
      options: ["Euclidean distance", "Cosine similarity", "Jaccard index", "Edit distance"],
      correct: 1,
      explanation: "Cosine similarity measures the angle between vectors, which captures semantic similarity independently of vector magnitude.",
    },
  ],
  agents: [
    {
      question: "What distinguishes an AI agent from a standard LLM?",
      options: ["Agents are larger models", "Agents can take actions and loop until a goal is reached", "Agents don't use language models", "Agents have no memory"],
      correct: 1,
      explanation: "Agents extend LLMs with tools, memory, and a loop: observe → think → act → observe, until the task is complete.",
    },
    {
      question: "What is a 'tool' in the context of AI agents?",
      options: ["A plugin for the IDE", "A callable function the agent can invoke (search, code execution, APIs)", "A type of training dataset", "A prompt template"],
      correct: 1,
      explanation: "Tools give agents capabilities beyond text generation: web search, code execution, database queries, calendar access, etc.",
    },
    {
      question: "What is the main risk of long-running autonomous agents?",
      options: ["They use too much RAM", "Error accumulation — early mistakes compound through later steps", "They can't handle multi-step tasks", "They respond too slowly"],
      correct: 1,
      explanation: "In multi-step chains, a small error in step 2 can derail steps 3–10. Agent reliability degrades roughly multiplicatively with chain length.",
    },
  ],
  "prompt-engineering": [
    {
      question: "Which element most reliably improves prompt quality?",
      options: ["Making the prompt shorter", "Specifying the exact output format desired", "Using formal language", "Repeating the question"],
      correct: 1,
      explanation: "Telling the model exactly how you want the output structured (bullet points, JSON, numbered list) dramatically reduces ambiguity.",
    },
    {
      question: "What does 'few-shot prompting' mean?",
      options: ["Sending multiple requests in quick succession", "Including 2–5 examples of the task in the prompt", "Fine-tuning with a small dataset", "Limiting the response length"],
      correct: 1,
      explanation: "Few-shot prompting adds example input/output pairs to the prompt so the model learns the pattern by demonstration, not just instruction.",
    },
    {
      question: "Why does adding constraints to a prompt help?",
      options: ["It makes the model run faster", "It narrows the space of acceptable outputs, reducing unhelpful variation", "It prevents the model from using training data", "Constraints are optional style choices"],
      correct: 1,
      explanation: "Without constraints, models explore a wide output space. 'Under 100 words', 'no bullet points', 'cite sources' all focus the model's behaviour.",
    },
  ],
  hallucination: [
    {
      question: "Why do LLMs hallucinate?",
      options: ["They are programmed to lie", "They predict plausible-sounding tokens without verifying truth", "Their training data is always wrong", "They have too few parameters"],
      correct: 1,
      explanation: "LLMs are trained to predict likely next tokens, not to be truthful. A confident-sounding fabrication can be more 'likely' than a correct admission of uncertainty.",
    },
    {
      question: "Which type of claim is an LLM most likely to hallucinate?",
      options: ["Common cultural knowledge", "Specific citations, statistics, and niche technical details", "Grammar rules", "Code syntax for popular languages"],
      correct: 1,
      explanation: "Specific, verifiable facts like paper titles, URLs, and exact statistics are frequent hallucination targets because the model must interpolate from patterns.",
    },
    {
      question: "What is the best mitigation for hallucination in production?",
      options: ["Larger models never hallucinate", "Retrieval-augmented generation + citation verification", "Asking the model to be honest", "Using temperature 0"],
      correct: 1,
      explanation: "Grounding responses in retrieved documents and requiring inline citations lets downstream systems verify claims against sources.",
    },
  ],
  "context-windows": [
    {
      question: "What happens when input exceeds a model's context window?",
      options: ["The model crashes", "Content is truncated, typically from the oldest/earliest parts", "The model doubles its window automatically", "Response quality doubles"],
      correct: 1,
      explanation: "Most implementations truncate from the start (oldest turns) when the window is full, meaning the model can 'forget' earlier conversation.",
    },
    {
      question: "Why can't you just make context windows infinitely large?",
      options: ["It's a software limitation only", "Compute scales quadratically with context length due to attention", "Models refuse long inputs", "Context windows are fixed by law"],
      correct: 1,
      explanation: "Self-attention requires comparing every token to every other token — O(n²) compute — making very long contexts expensive.",
    },
    {
      question: "What is 'lost in the middle'?",
      options: ["A type of hallucination", "The tendency for models to underweight information in the middle of long contexts", "A training failure mode", "An embedding compression bug"],
      correct: 1,
      explanation: "Research shows LLMs attend most to the start and end of long contexts, often failing to retrieve facts buried in the middle.",
    },
  ],
  multiagent: [
    {
      question: "What is the main advantage of multi-agent systems over a single large agent?",
      options: ["They use less memory", "Specialisation and parallelism — tasks can run concurrently with focused agents", "They don't need LLMs", "Fewer API calls total"],
      correct: 1,
      explanation: "Different agents can specialise (researcher, writer, fact-checker) and run in parallel, making complex workflows faster and more accurate.",
    },
    {
      question: "What is an 'orchestrator' in a multi-agent system?",
      options: ["A fine-tuned model", "The agent that manages task routing and coordinates other agents", "A monitoring dashboard", "A database layer"],
      correct: 1,
      explanation: "The orchestrator decides which agent handles which subtask, manages dependencies, and aggregates results into a final output.",
    },
    {
      question: "What is the primary failure mode in multi-agent pipelines?",
      options: ["Agents disagreeing on facts", "Error propagation — a mistake in one agent cascades to downstream agents", "Too many API calls", "Context windows filling up"],
      correct: 1,
      explanation: "If the researcher agent retrieves wrong data, the writer agent will draft incorrectly, and the publisher agent will publish the wrong thing.",
    },
  ],
  multimodal: [
    {
      question: "What makes a model 'multimodal'?",
      options: ["It runs on multiple GPUs", "It can accept and produce more than one type of data (text, image, audio)", "It supports multiple languages", "It has multiple attention heads"],
      correct: 1,
      explanation: "Multimodal models have unified representations across modalities — they process images, text, audio, or video in a shared embedding space.",
    },
    {
      question: "Which task is text-only processing insufficient for?",
      options: ["Summarisation", "Translation", "Medical imaging diagnosis", "Sentiment analysis"],
      correct: 2,
      explanation: "Medical scans are visual data — no amount of textual description fully substitutes for processing the actual pixel-level patterns in the image.",
    },
    {
      question: "What is 'cross-modal alignment' in training?",
      options: ["Aligning model outputs with human preferences", "Teaching the model that an image and its caption describe the same thing", "Balancing training data across languages", "Matching attention weights across layers"],
      correct: 1,
      explanation: "Models like CLIP are trained by contrasting matched image-text pairs against mismatched ones, forcing the model to align the two representations.",
    },
  ],
  training: [
    {
      question: "What does 'loss' measure in model training?",
      options: ["How much GPU memory is used", "How wrong the model's predictions are", "The number of training steps", "Inference latency"],
      correct: 1,
      explanation: "Loss quantifies prediction error — the gap between what the model predicted and the correct answer. Training minimises this over the dataset.",
    },
    {
      question: "What is RLHF?",
      options: ["A new architecture for faster inference", "A method that uses human preference feedback to steer model behaviour", "Random Layer Head Finetuning", "A dataset cleaning technique"],
      correct: 1,
      explanation: "Reinforcement Learning from Human Feedback trains a reward model on human preferences, then optimises the LLM to maximise that reward.",
    },
    {
      question: "What is 'overfitting' in the context of training loss?",
      options: ["When the model is too large", "When train loss decreases but eval loss rises — the model memorises rather than generalises", "When the training takes too long", "When the learning rate is too high"],
      correct: 1,
      explanation: "Overfitting means the model performs well on training data but poorly on unseen data — it has memorised examples rather than learned patterns.",
    },
  ],
  "fine-tuning": [
    {
      question: "What is fine-tuning?",
      options: ["Training a model from scratch on new data", "Continuing training a pretrained model on a smaller, task-specific dataset", "Running inference with lower temperature", "Compressing a model's weights"],
      correct: 1,
      explanation: "Fine-tuning adapts a pretrained model to a new domain or task by continuing gradient descent on targeted data — much cheaper than pretraining.",
    },
    {
      question: "What does fine-tuning change vs what it doesn't?",
      options: ["It changes the architecture but not the weights", "It changes how the model responds, not its fundamental world knowledge", "It only changes the tokeniser", "It replaces all of the pretrained weights"],
      correct: 1,
      explanation: "Fine-tuning shifts style, tone, format, and domain vocabulary — but the model's underlying reasoning and knowledge come from pretraining.",
    },
    {
      question: "What is 'catastrophic forgetting'?",
      options: ["When a model hallucinates important facts", "When fine-tuning causes the model to forget previously learned general capabilities", "When context window limits prevent long recall", "When the model stops responding to prompts"],
      correct: 1,
      explanation: "Aggressive fine-tuning can overwrite general capabilities — the model becomes specialised but loses breadth. Techniques like LoRA reduce this risk.",
    },
  ],
  alignment: [
    {
      question: "What does AI alignment mean?",
      options: ["Aligning training data formatting", "Ensuring AI systems behave according to human values and intentions", "Balancing compute across GPUs", "Making AI models faster"],
      correct: 1,
      explanation: "Alignment is the challenge of making AI systems reliably pursue goals that humans actually want, rather than optimising for proxy metrics.",
    },
    {
      question: "What is Goodhart's Law in the context of AI?",
      options: ["A theorem about neural network depth", "When a measure becomes a target, it ceases to be a good measure", "A rule about training data size", "A limit on model parameter count"],
      correct: 1,
      explanation: "If you reward an AI for a proxy metric (like engagement or test score), it will optimise for that metric rather than the underlying goal.",
    },
    {
      question: "What is 'reward hacking'?",
      options: ["Breaking into AI training servers", "When a model achieves high reward through unintended means that don't satisfy the true objective", "A type of adversarial attack", "A debugging technique for RL systems"],
      correct: 1,
      explanation: "A reward-maximising agent may find loopholes in the reward function — achieving high scores while violating the spirit of the objective.",
    },
  ],
  diffusion: [
    {
      question: "How do diffusion models generate images?",
      options: ["By retrieving images from a database", "By learning to reverse a noise-adding process, starting from pure noise", "By compositing stock photos", "By running a GAN adversarially"],
      correct: 1,
      explanation: "Diffusion models learn to denoise — trained on the process of adding noise, they learn to reverse it, producing coherent images from random noise.",
    },
    {
      question: "What is 'classifier-free guidance' in diffusion?",
      options: ["A way to train without labels", "A technique to steer image generation toward a text prompt with adjustable strength", "A safety filter", "An optimiser for faster sampling"],
      correct: 1,
      explanation: "Guidance blends conditioned and unconditioned generation; higher guidance strength produces outputs that more closely match the prompt, at some cost to diversity.",
    },
    {
      question: "What is the main limitation of diffusion models with text rendering?",
      options: ["They only work in black and white", "They frequently distort, misspell, or hallucinate text inside generated images", "They cannot understand language prompts", "They require more GPU than other models"],
      correct: 1,
      explanation: "Text in images is visually complex and rare in training data; diffusion models treat it as texture, leading to garbled or invented characters.",
    },
  ],
  mcp: [
    {
      question: "What is the Model Context Protocol?",
      options: ["A new transformer architecture", "A standard interface for connecting AI models to external tools and data sources", "A dataset format for RLHF", "A compression standard for embeddings"],
      correct: 1,
      explanation: "MCP defines a common protocol so AI models can securely communicate with tools, databases, APIs, and services without custom integration code.",
    },
    {
      question: "What problem does MCP solve?",
      options: ["Model hallucination", "The N×M integration problem — every AI needing custom connectors for every tool", "Slow inference speed", "Large context window requirements"],
      correct: 1,
      explanation: "Without MCP, connecting N models to M tools requires N×M custom integrations. MCP creates a single standard both sides implement once.",
    },
    {
      question: "What are MCP 'resources'?",
      options: ["GPU compute allocations", "Data sources the AI can read (files, databases, APIs)", "Training datasets", "Memory allocated for attention"],
      correct: 1,
      explanation: "MCP resources are structured data endpoints — files, database rows, API responses — that the model can request and incorporate into its context.",
    },
  ],
  evals: [
    {
      question: "What does Goodhart's Law mean for AI evals?",
      options: ["Larger training sets produce better evals", "When an eval metric becomes the target, the model optimises for the metric rather than the real goal", "Evals should only measure one thing at a time", "Human eval is always more accurate than automated eval"],
      correct: 1,
      explanation: "When you train a model to maximise an eval score, it finds the shortest path to that score — which often bypasses the quality you actually care about.",
    },
    {
      question: "What is a key limitation of LLM-as-judge evaluation?",
      options: ["It's too slow to use at scale", "The judge model has its own biases — preferring longer, more confident responses regardless of quality", "It can only evaluate code tasks", "It requires ground-truth labels for every example"],
      correct: 1,
      explanation: "LLM judges show positional bias, length bias, and can be manipulated by flattery in the response — you're measuring the judge's priors as much as actual quality.",
    },
    {
      question: "Why is rater disagreement in human eval informative rather than just noise?",
      options: ["It tells you which annotator made mistakes", "It reveals where the task is genuinely ambiguous or where quality criteria are underspecified", "It means the eval dataset is too small", "Human raters always eventually converge if given enough time"],
      correct: 1,
      explanation: "When expert raters systematically disagree, that disagreement encodes real information about the task — it's a signal that the quality criteria need sharpening.",
    },
  ],
  "reasoning-models": [
    {
      question: "Why does chain-of-thought improve accuracy on hard problems?",
      options: ["It uses a larger model internally", "Generating intermediate reasoning steps provides a scratchpad that reduces the cognitive load of each individual inference step", "It retrieves answers from a database", "It makes the model slower, which reduces errors"],
      correct: 1,
      explanation: "Each reasoning token extends the model's 'working memory'. More thinking tokens means more computation before committing to an answer — reducing leaps that fail.",
    },
    {
      question: "What does 'inference-time compute scaling' mean?",
      options: ["Using more GPUs to serve the model", "Allowing the model to think for longer at inference time rather than relying solely on larger training compute", "Compressing the model to run on edge devices", "Scaling the number of tokens in the training set"],
      correct: 1,
      explanation: "Instead of needing a bigger model, you give the model more time to reason. Harder problems get longer chains; simple ones get shorter ones.",
    },
    {
      question: "What is the key limitation of reasoning traces that's often overlooked?",
      options: ["They're too long to read", "The reasoning trace is generated by the same probabilistic process as the answer — it's plausible-sounding, not necessarily accurate", "They only work for maths problems", "They require special hardware"],
      correct: 1,
      explanation: "A reasoning model can generate a fluent, confident-sounding chain of thought for a wrong answer. The trace is evidence of what the model predicts sounds like good reasoning, not a window into its actual computation.",
    },
  ],
  grounding: [
    {
      question: "What is the primary purpose of grounding in AI systems?",
      options: ["Making the model run faster", "Connecting model outputs to verifiable, external sources of truth", "Reducing the size of the context window", "Making responses more conversational"],
      correct: 1,
      explanation: "Grounding tethers the model's claims to something auditable — a retrieved document, an API result, a database row — so errors can be traced to their source.",
    },
    {
      question: "What is 'ground truth contamination'?",
      options: ["Training data with errors", "When a model accurately cites a source but draws conclusions the source doesn't actually support", "When retrieval returns the wrong documents", "When two grounding sources contradict each other"],
      correct: 1,
      explanation: "A model can cite a real source faithfully while misrepresenting what it says — the citation looks legitimate but the inference is hallucinated.",
    },
    {
      question: "Why is tool-grounding stronger than retrieval-grounding?",
      options: ["Tools are faster than retrieval", "Tool calls are logged, auditable, and the model acts as a transparent interface rather than an authority", "Tools eliminate all hallucination", "Retrieval is more expensive"],
      correct: 1,
      explanation: "With tool grounding, you can inspect the exact API call and response. The model is routing between the user and a verified source — you can check its work independently.",
    },
  ],
  "computer-use": [
    {
      question: "What is the key difference between computer use and conversational AI?",
      options: ["Computer use requires larger models", "Computer use actions change real-world state — they may be irreversible, unlike text responses", "Computer use is faster", "Computer use only works on desktops"],
      correct: 1,
      explanation: "A text response can be ignored. A form submitted, email sent, or file deleted by a computer-use agent cannot be easily undone. The stakes are fundamentally different.",
    },
    {
      question: "What makes prompt injection particularly dangerous in computer-use systems?",
      options: ["The model uses more tokens", "Injected instructions execute against real accounts and files, not just text", "Computer-use models are less intelligent", "Injection is blocked by the operating system"],
      correct: 1,
      explanation: "If a web page tricks a computer-use agent into following embedded instructions, those instructions execute with the user's actual permissions — email, files, payments.",
    },
    {
      question: "What is 'minimal permission scope' in computer-use safety?",
      options: ["Limiting the model to low-resource tasks", "Only granting the agent access to the tools it actually needs for the specific task", "Requiring the user to confirm every keystroke", "Sandboxing the model from the internet"],
      correct: 1,
      explanation: "An agent booking a restaurant doesn't need file system access. Restricting permissions to the task's actual requirements limits the blast radius of errors or attacks.",
    },
  ],
};

const MASTERED_KEY = "aight_learn_mastered";

export default function KnowledgeCheck({ slug }: { slug: string }) {
  const questions = QUESTIONS[slug];
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions?.length ?? 0).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [alreadyMastered, setAlreadyMastered] = useState(false);

  useEffect(() => {
    try {
      const m: string[] = JSON.parse(localStorage.getItem(MASTERED_KEY) ?? "[]");
      if (m.includes(slug)) setAlreadyMastered(true);
    } catch {}
  }, [slug]);

  if (!questions) return null;

  const score = submitted ? answers.filter((a, i) => a === questions[i].correct).length : null;
  const mastered = score === questions.length;

  if (submitted && mastered && !alreadyMastered) {
    try {
      const m: string[] = JSON.parse(localStorage.getItem(MASTERED_KEY) ?? "[]");
      if (!m.includes(slug)) {
        m.push(slug);
        localStorage.setItem(MASTERED_KEY, JSON.stringify(m));
      }
    } catch {}
  }

  function pick(qIdx: number, optIdx: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }

  return (
    <div style={{
      background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", padding: "28px 32px", margin: "48px 0",
    }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: 4,
      }}>
        Knowledge Check
      </p>
      <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
        {alreadyMastered ? "You've mastered this concept." : "3 questions. Answer all to see how well it landed."}
      </p>

      {alreadyMastered && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-primary)", marginBottom: 16 }}>
          ✓ Concept mastered
        </p>
      )}

      {score !== null && (
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10, marginBottom: 24,
          padding: "14px 16px", borderRadius: "var(--radius-md)",
          background: mastered ? "rgba(170,255,77,0.06)" : "rgba(244,171,31,0.06)",
          border: `1px solid ${mastered ? "rgba(170,255,77,0.3)" : "rgba(244,171,31,0.3)"}`,
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: mastered ? "var(--accent-primary)" : "var(--accent-warm)", lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
            / {questions.length}
          </span>
          <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 13, color: "var(--text-secondary)", marginLeft: 8 }}>
            {mastered ? "Concept mastered ✓" : "Review the explanations below"}
          </span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isCorrect = submitted && chosen === q.correct;
          const isWrong = submitted && chosen !== null && chosen !== q.correct;

          return (
            <div key={qi}>
              <p style={{
                fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 500,
                color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.5,
              }}>
                {qi + 1}. {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrectOpt = oi === q.correct;
                  let borderColor = "var(--border-subtle)";
                  let bg = "rgba(255,250,240,0.02)";
                  let color = "var(--text-primary)";
                  if (submitted) {
                    if (isCorrectOpt) { borderColor = "rgba(170,255,77,0.4)"; bg = "rgba(170,255,77,0.06)"; color = "var(--accent-primary)"; }
                    else if (isChosen && !isCorrectOpt) { borderColor = "rgba(224,112,112,0.4)"; bg = "rgba(224,112,112,0.06)"; color = "var(--error)"; }
                  } else if (isChosen) {
                    borderColor = "rgba(170,255,77,0.4)"; bg = "rgba(170,255,77,0.06)"; color = "var(--accent-primary)";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      style={{
                        textAlign: "left", width: "100%",
                        fontFamily: "var(--font-ui)", fontSize: 13, color,
                        padding: "10px 14px", borderRadius: "var(--radius-md)",
                        border: `1px solid ${borderColor}`, background: bg,
                        cursor: submitted ? "default" : "pointer",
                        transition: "all 150ms ease", lineHeight: 1.5,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p style={{
                  fontFamily: "var(--font-ui)", fontSize: 12,
                  color: isCorrect ? "var(--accent-primary)" : isWrong ? "var(--error)" : "var(--text-muted)",
                  margin: "8px 0 0", lineHeight: 1.6,
                }}>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={answers.some((a) => a === null)}
          style={{
            marginTop: 24,
            fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500,
            padding: "8px 20px", borderRadius: "var(--radius-md)",
            background: answers.every((a) => a !== null) ? "var(--accent-primary)" : "rgba(170,255,77,0.3)",
            color: answers.every((a) => a !== null) ? "var(--text-inverse)" : "rgba(0,0,0,0.4)",
            border: "none", cursor: answers.every((a) => a !== null) ? "pointer" : "not-allowed",
          }}
        >
          Check answers →
        </button>
      )}
    </div>
  );
}
