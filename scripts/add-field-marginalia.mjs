#!/usr/bin/env node
// One-shot enrichment for content/paths/fields.json.
// Adds `marginalia` and `citations` arrays per field — hand-authored, in the
// AIght voice (warm, dry, occasionally funny). Idempotent: re-running replaces
// the keys cleanly.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "content", "paths", "fields.json");

const ENRICH = {
  biology: {
    marginalia: [
      { anchor: "transformations", side: "right", text: "AlphaFold's 200M predicted structures is the largest single data drop in molecular biology's history. The wet-lab catch-up is still happening." },
      { anchor: "roles", side: "right", text: "The pattern: junior wet-lab roles compress. Computational roles expand. Hybrid roles are the next decade's growth." },
      { anchor: "action", side: "right", text: "Start with one published dataset and AlphaFold's web UI. You can run a meaningful hypothesis check in an afternoon, no infrastructure required." },
    ],
    citations: [
      { label: "AlphaFold 2", source: "Jumper et al., Highly accurate protein structure prediction with AlphaFold (2021)", href: "https://www.nature.com/articles/s41586-021-03819-2" },
      { label: "AlphaFold 3", source: "Abramson et al., Accurate structure prediction of biomolecular interactions with AlphaFold 3 (2024)", href: "https://www.nature.com/articles/s41586-024-07487-w" },
    ],
  },
  "physics-engineering": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "A surrogate model isn't a replacement for a real simulation — it's a way to skip 90% of them and only run the ones that matter." },
      { anchor: "roles", side: "right", text: "CAD draftsmen aren't being replaced by AI. They're being replaced by AI-equipped designers who used to be CAD draftsmen." },
      { anchor: "action", side: "right", text: "If you're validating an AI surrogate, hold out a non-trivial benchmark from training. Lots of papers don't, and lots of surrogates lie." },
    ],
    citations: [
      { source: "Raissi et al., Physics-informed neural networks (2019)", href: "https://www.sciencedirect.com/science/article/pii/S0021999118307125" },
      { source: "Karniadakis et al., Physics-informed machine learning (2021)", href: "https://www.nature.com/articles/s42254-021-00314-5" },
    ],
  },
  "medicine-healthcare": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Ambient scribes save clinicians ~2 hours of charting per day. That number alone is reshaping which hospitals can compete for new hires." },
      { anchor: "roles", side: "right", text: "Radiology was supposed to be the first replaced. It became the first augmented. Reading volume went up, not down." },
      { anchor: "action", side: "right", text: "If you're a clinician, query OpenEvidence at the point of care once a week for a month. The change in your confidence is more interesting than the change in your speed." },
    ],
    citations: [
      { source: "Rajpurkar et al., AI in health and medicine — Nature Medicine review (2022)", href: "https://www.nature.com/articles/s41591-021-01614-0" },
      { source: "Microsoft Dragon Copilot — Product overview", href: "https://www.microsoft.com/en-us/health-solutions/clinical-workflow/dragon-copilot" },
    ],
  },
  "law-legal": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Two hours of associate work just became eight minutes. The billable-hour model doesn't have a graceful version of this." },
      { anchor: "roles", side: "right", text: "Paralegal work compresses fast. Partner work compresses slowly. Junior associates are sitting in the awkward middle." },
      { anchor: "action", side: "right", text: "Use Harvey or a Westlaw AI feature on a *closed* matter you know cold. Calibrate your trust before you reach for it on live work." },
    ],
    citations: [
      { source: "Choi et al., GPT-4 Passes the Bar Exam (2023)", href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4389233" },
      { source: "Allen & Overy x Harvey — case study (2023)", href: "https://www.allenovery.com/en-gb/global/news-and-insights/news/ao-announces-exclusive-launch-partnership-with-harvey" },
    ],
  },
  "finance-economics": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "The buy side has had ML quants for a decade. What's new is that the sell side and the back office now do too — and the audit trail still has to hold up in court." },
      { anchor: "roles", side: "right", text: "If your job is summarising 10-Ks and earnings calls, the wind is at your back as long as you can verify the model's read." },
      { anchor: "action", side: "right", text: "Run a side-by-side: a model summary of an earnings call vs. your own notes. Where they diverge tells you what you're still bringing to the table." },
    ],
    citations: [
      { source: "BloombergGPT: A Large Language Model for Finance (2023)", href: "https://arxiv.org/abs/2303.17564" },
      { source: "Bank for International Settlements, Generative AI and finance (2024)", href: "https://www.bis.org/fsi/fsibriefs23.htm" },
    ],
  },
  "education-teaching": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "AI tutors don't replace teachers. They replace the *gap* — what students used to get only when they were lucky enough to have access to one-on-one help." },
      { anchor: "roles", side: "right", text: "Grading at scale was the first thing to get automated badly. The second thing is the first thing to get automated well." },
      { anchor: "action", side: "right", text: "Khanmigo or a similar tutor for a single struggling student, for two weeks. Watch what changes. The interesting data lives in those before-and-after conversations." },
    ],
    citations: [
      { source: "Khan Academy, Khanmigo — Pilot results (2024)", href: "https://www.khanacademy.org/khan-labs" },
      { source: "Kasneci et al., ChatGPT for good? On opportunities and challenges of LLMs for education (2023)", href: "https://www.sciencedirect.com/science/article/pii/S1041608023000195" },
    ],
  },
  "architecture-urban-design": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Generative massing tools turn the first three weeks of a project into a single afternoon. The hard part — getting it permitted — is still on you." },
      { anchor: "roles", side: "right", text: "Junior renderers are the most exposed. Architects who can prompt a model and then critique its output are the safest." },
      { anchor: "action", side: "right", text: "Re-run an old proposal through a current generative tool. The novel options it surfaces are usually weird, occasionally brilliant, always cheap." },
    ],
    citations: [
      { source: "Autodesk Forma — Product overview", href: "https://www.autodesk.com/products/forma" },
      { source: "Sidewalk Labs, Generative design for urban planning (2020)", href: "https://www.sidewalktoronto.ca/" },
    ],
  },
  "creative-writing-literature": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Models are unusually good at competent prose and unusually bad at the specific voice you've worked years to develop. Use them for drafting; protect the voice." },
      { anchor: "roles", side: "right", text: "Genre and content writing compress fastest. Literary fiction compresses slowest, but the audience for it is fragile enough that compression elsewhere still hurts." },
      { anchor: "action", side: "right", text: "Co-write one short piece with a model. Read it the next day. The places you wince are where your craft still matters most." },
    ],
    citations: [
      { source: "Sloan, Robin — Writing with the machine (essay, 2018)", href: "https://www.robinsloan.com/notes/writing-with-the-machine/" },
      { source: "Authors Guild, AI and Authorship — Industry position (2023)", href: "https://authorsguild.org/advocacy/artificial-intelligence/" },
    ],
  },
  "graphic-design-visual-arts": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Logo and asset commodity work — the bottom 30% of paid design — has been quietly hollowing out for two years. The top 30% is doing fine." },
      { anchor: "roles", side: "right", text: "The skill that protects you isn't \"I can use Midjourney.\" It's \"I can tell you why this version is better than the other 200.\"" },
      { anchor: "action", side: "right", text: "Spend a week using a generative tool *only* for moodboards and iteration. The thinking changes more than the output does." },
    ],
    citations: [
      { source: "Stable Diffusion — Rombach et al., High-Resolution Image Synthesis with Latent Diffusion (2022)", href: "https://arxiv.org/abs/2112.10752" },
      { source: "AIGA, Designers and AI — Industry survey (2024)", href: "https://www.aiga.org/" },
    ],
  },
  "film-video-production": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Pre-vis used to be a craft job. It's becoming a prompt job, and the people who do both well are who studios call first." },
      { anchor: "roles", side: "right", text: "VFX assistants and roto artists are the most squeezed. Editors who can integrate AI rough cuts into a real workflow have more leverage than they did a year ago." },
      { anchor: "action", side: "right", text: "Try a 30-second AI-generated b-roll insert in a real edit. The questions it raises about your pipeline are more valuable than the clip itself." },
    ],
    citations: [
      { source: "Runway — Gen-3 Alpha technical report (2024)", href: "https://runwayml.com/research/" },
      { source: "OpenAI, Sora — System card (2024)", href: "https://openai.com/index/sora-system-card/" },
    ],
  },
  "music-audio": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "AI mastering closed a gap that used to separate a $5k bedroom studio from a $500k mix room. Half the closure is real. The other half you can hear." },
      { anchor: "roles", side: "right", text: "Stock music libraries are the most exposed. Live engineers, producers with a sound — much less so." },
      { anchor: "action", side: "right", text: "Run one of your own tracks through Suno or Udio as a comp. The interesting question is which decisions you'd actually keep." },
    ],
    citations: [
      { source: "Suno — Bark and Chirp models, technical overview", href: "https://suno.com/about" },
      { source: "Google, MusicLM: Generating Music from Text (2023)", href: "https://arxiv.org/abs/2301.11325" },
    ],
  },
  "journalism-media": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Newsrooms that adopted AI in 2023 said \"for efficiency.\" In 2026 they say \"for survival.\" Same tools, different framing." },
      { anchor: "roles", side: "right", text: "Aggregator and rewrite jobs vanish fast. Investigative and on-the-ground reporting becomes more valuable per byline, not less." },
      { anchor: "action", side: "right", text: "Use a model to summarise a beat you cover well. Disagree with three things it got right. Those are the ones worth a follow-up call." },
    ],
    citations: [
      { source: "Reuters Institute, Journalism, media and technology trends 2025", href: "https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2025" },
      { source: "Associated Press, AP's standards for AI use (2023)", href: "https://www.ap.org/about/news-values-and-principles/telling-the-story/artificial-intelligence" },
    ],
  },
  "psychology-mental-health": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "A model trained on therapy transcripts is impressive on transcripts. The hard part — the things that don't show up in transcripts — is exactly what therapy is for." },
      { anchor: "roles", side: "right", text: "Triage and screening compress. Long-term therapeutic relationships don't, and won't, for reasons that aren't technical." },
      { anchor: "action", side: "right", text: "If you're a clinician, audit a Woebot-style flow as if you were the client. The things that work and the things that grate are both diagnostic." },
    ],
    citations: [
      { source: "Heinz et al., Randomized trial of a therapeutic chatbot for depression (2025)", href: "https://ai.nejm.org/doi/full/10.1056/AIoa2400802" },
      { source: "APA, Artificial intelligence in psychology — Policy brief (2024)", href: "https://www.apa.org/practice/artificial-intelligence" },
    ],
  },
  "chemistry-materials-science": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "GNoME's 2.2 million candidate crystal structures is roughly *every materials discovery of the previous century, every week*. That's the magnitude." },
      { anchor: "roles", side: "right", text: "Synthesis chemists in the lab become the bottleneck. Computational chemists become the throughput." },
      { anchor: "action", side: "right", text: "Pull one of GNoME's predicted materials and try to actually make it. The story of where the prediction breaks is the story of where you still matter." },
    ],
    citations: [
      { source: "Merchant et al., Scaling deep learning for materials discovery (GNoME, Nature 2023)", href: "https://www.nature.com/articles/s41586-023-06735-9" },
      { source: "Szymanski et al., An autonomous laboratory for the accelerated synthesis of novel materials (2023)", href: "https://www.nature.com/articles/s41586-023-06734-w" },
    ],
  },
  "environmental-science-climate": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Climate models on AI surrogates run 1000× faster than physics-based ones. The catch: validation against the real climate is — by definition — slow." },
      { anchor: "roles", side: "right", text: "Field ecology stays human. Remote-sensing analysis becomes AI-first. The two halves of the field are pulling apart fast." },
      { anchor: "action", side: "right", text: "Try ClimateAi or a similar surrogate on a region you know well. Where its predictions miss the local quirks is where domain knowledge still wins." },
    ],
    citations: [
      { source: "Lam et al., GraphCast: Learning skillful medium-range global weather forecasting (2023)", href: "https://www.science.org/doi/10.1126/science.adi2336" },
      { source: "Kurth et al., FourCastNet: A global high-resolution weather model (2023)", href: "https://arxiv.org/abs/2202.11214" },
    ],
  },
  "marketing-advertising": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Personalised creative at scale used to be a budget problem. Now it's an inventory and review problem — every variation needs a human spot-check somewhere." },
      { anchor: "roles", side: "right", text: "Copywriters who can prompt and edit are more productive than ever. Copywriters who only write the first draft are competing with the model." },
      { anchor: "action", side: "right", text: "Run an A/B between your best human-written ad and three AI variants. The lift is usually small. The cost-per-variant is the actual story." },
    ],
    citations: [
      { source: "Jasper AI — Marketing benchmarks (2024)", href: "https://www.jasper.ai/" },
      { source: "Salesforce Einstein GPT — Marketing AI overview", href: "https://www.salesforce.com/products/einstein/overview/" },
    ],
  },
  "social-work-public-policy": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Caseload triage is the first place AI helps and the first place it hurts — a model that flags risk poorly is worse than no model at all." },
      { anchor: "roles", side: "right", text: "Direct-service work stays human. Policy analysis and grant writing compress significantly." },
      { anchor: "action", side: "right", text: "If you work in public policy, ask a model to summarise a bill you helped write. The places it gets wrong are usually where your judgment was load-bearing." },
    ],
    citations: [
      { source: "AI Now Institute, Algorithmic accountability in public services (2023)", href: "https://ainowinstitute.org/" },
      { source: "Brookings, AI in government — Policy review (2024)", href: "https://www.brookings.edu/articles/how-artificial-intelligence-is-transforming-government/" },
    ],
  },
  "pharmacy-drug-discovery": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "AI-designed drugs reaching Phase II is no longer noteworthy. AI-designed drugs reaching Phase III with the original target intact — that's still rare." },
      { anchor: "roles", side: "right", text: "Computational chemists are the bottleneck-removers. Wet-lab validation is the bottleneck. The ratio has not yet inverted." },
      { anchor: "action", side: "right", text: "Try Atomwise's free academic tier against a target you already know. The model's top-10 list is interesting; the bottom-10 is more interesting." },
    ],
    citations: [
      { source: "Insilico Medicine — First AI-discovered drug enters Phase II (2024)", href: "https://insilico.com/news" },
      { source: "Stokes et al., A Deep Learning Approach to Antibiotic Discovery (Cell, 2020)", href: "https://www.cell.com/cell/fulltext/S0092-8674(20)30102-1" },
    ],
  },
  "agriculture-food-science": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Computer vision on tractor cabs is the quiet success story of agricultural AI — saves real money on chemicals, almost nobody outside ag has noticed." },
      { anchor: "roles", side: "right", text: "Crop consultants who can read AI-driven satellite analyses have replaced consultants who can't. The transition was fast." },
      { anchor: "action", side: "right", text: "Get a free trial of Climate FieldView or a competitor and run it on a known-good plot. The disagreements are where the value is hiding." },
    ],
    citations: [
      { source: "John Deere, See & Spray — Computer-vision herbicide system", href: "https://www.deere.com/en/sprayers/see-spray-ultimate/" },
      { source: "Liakos et al., Machine Learning in Agriculture: A Review (2018)", href: "https://www.mdpi.com/1424-8220/18/8/2674" },
    ],
  },
  "history-humanities": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Optical character recognition for handwritten 18th-century documents went from impossible to fine in about four years. Whole archives just opened up." },
      { anchor: "roles", side: "right", text: "Digital humanities used to be a niche speciality. It's becoming the baseline." },
      { anchor: "action", side: "right", text: "Run a digitised archive you've worked with through Transkribus or a current vision model. The errors it makes are themselves historically interesting." },
    ],
    citations: [
      { source: "Transkribus — Handwritten Text Recognition platform", href: "https://readcoop.eu/transkribus/" },
      { source: "Stanford NLP, Computational humanities — Resources", href: "https://nlp.stanford.edu/projects/digitalhumanities.shtml" },
    ],
  },
  "software-engineering": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "Copilot completes about 30% of code by lines in some codebases. The other 70% is where the real disagreements live." },
      { anchor: "roles", side: "right", text: "Boilerplate-heavy roles (CRUD APIs, glue code) compress fastest. Systems design, debugging, and review compress slowest." },
      { anchor: "action", side: "right", text: "Spend a week with Cursor or Aider on a codebase you know. The places where you slow down to argue with the model are where you're learning the most." },
    ],
    citations: [
      { source: "Chen et al., Evaluating Large Language Models Trained on Code (Codex paper, 2021)", href: "https://arxiv.org/abs/2107.03374" },
      { source: "GitHub, Quantifying GitHub Copilot's impact on developer productivity (2022)", href: "https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/" },
    ],
  },
  "sales-business-development": {
    marginalia: [
      { anchor: "transformations", side: "right", text: "AI call-summary tools have quietly become better managers than most managers. Hold the take, but check the data." },
      { anchor: "roles", side: "right", text: "SDR work — outreach, qualifying, top-of-funnel — is the most exposed role in any modern sales org. Closing is the safest." },
      { anchor: "action", side: "right", text: "Run a week of your discovery calls through Gong's AI summaries. Compare the recommendations to your own gut. Where you agree, that's pattern. Where you don't, that's interesting." },
    ],
    citations: [
      { source: "Gong — Revenue intelligence platform overview", href: "https://www.gong.io/" },
      { source: "Harvard Business Review, How AI is reshaping the sales force (2024)", href: "https://hbr.org/2024/01/how-ai-is-reshaping-sales" },
    ],
  },
};

const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
const out = raw.map((entry) => {
  const e = ENRICH[entry.slug];
  if (!e) {
    console.warn(`No marginalia/citations defined for slug: ${entry.slug}`);
    return entry;
  }
  return { ...entry, marginalia: e.marginalia, citations: e.citations };
});

fs.writeFileSync(FILE, JSON.stringify(out, null, 2) + "\n", "utf-8");
console.log(`Enriched ${Object.keys(ENRICH).length} of ${raw.length} fields with marginalia + citations.`);
