/**
 * Seed pricing_detail and alternatives for key tools.
 * Run: npx tsx scripts/seed-pricing-alternatives.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Seed = {
  slug: string;
  pricing_detail?: {
    free_tier: string;
    cliff: string;
    paid_monthly: string;
    last_verified: string;
  };
  alternatives?: { slug: string; reason: string }[];
};

const seeds: Seed[] = [
  {
    slug: "claude",
    pricing_detail: {
      free_tier: "Claude.ai free plan gives access to Claude 3.5 Sonnet with a daily message cap. No credit card required to start.",
      cliff: "The cap hits mid-conversation during intensive tasks — typically after 20–30 messages in a heavy session. You'll see a cooldown timer.",
      paid_monthly: "Claude Pro at $20/month gives 5× more usage, access to extended thinking, and priority during peak times.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "chatgpt", reason: "If Claude's usage limits are blocking you mid-task, ChatGPT Plus has comparable quality with a different rate limit structure." },
      { slug: "deepseek", reason: "For coding and reasoning tasks on a budget, DeepSeek matches frontier quality at a fraction of the API cost." },
    ],
  },
  {
    slug: "chatgpt",
    pricing_detail: {
      free_tier: "GPT-4o is available on the free tier with rate limits. Image generation, web browsing, and data analysis are included.",
      cliff: "The free rate limit is aggressive — a few hours of sustained use drops you to GPT-4o mini. The downgrade is noticeable for complex tasks.",
      paid_monthly: "ChatGPT Plus at $20/month restores GPT-4o access with higher limits. Teams plan at $25/user/month for shared workspaces.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "claude", reason: "For long-form writing and documents where context depth matters more than tool integrations, Claude handles sustained conversation better." },
      { slug: "deepseek", reason: "For structured reasoning and math — DeepSeek's R1 model holds up well against GPT-4o on those benchmarks at open-source pricing." },
    ],
  },
  {
    slug: "cursor",
    pricing_detail: {
      free_tier: "Cursor Hobby gives 2,000 completions and 50 slow premium model requests per month. Enough to evaluate it seriously.",
      cliff: "50 fast premium requests disappears in 2–3 days of real coding. After that you're on slower model access for the rest of the month.",
      paid_monthly: "Cursor Pro at $20/month for 500 fast premium requests and unlimited slow completions. The jump is noticeable immediately.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "windsurf", reason: "If Cursor's context window frustrates you on large monorepos, Windsurf's Cascade handles multi-file edits more cleanly." },
    ],
  },
  {
    slug: "windsurf",
    pricing_detail: {
      free_tier: "Windsurf free tier includes access to Cascade with limited credits per month. Enough for light daily use.",
      cliff: "Credits deplete quickly on complex multi-file refactors. Cascade's deep context is exactly what burns credits fastest.",
      paid_monthly: "Windsurf Pro at $15/month for higher credit limits and priority access to the latest Cascade models.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "cursor", reason: "If you prefer VS Code's exact UI with AI layered on top rather than a purpose-built editor, Cursor is the closer match." },
    ],
  },
  {
    slug: "perplexity",
    pricing_detail: {
      free_tier: "Unlimited standard searches on the free plan. Standard model quality, no file uploads, no API access.",
      cliff: "Pro searches — which give deeper web synthesis and access to better models — are capped at 3 per day on free. File upload requires Pro.",
      paid_monthly: "Perplexity Pro at $20/month. Unlimited Pro searches, file uploads, image generation, and API access.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "notebooklm", reason: "If you're researching from your own documents rather than the open web, NotebookLM is purpose-built for that and it's free." },
      { slug: "chatgpt", reason: "For tasks that need browsing plus longer-form synthesis or code execution in the same session, ChatGPT's toolset is more integrated." },
    ],
  },
  {
    slug: "elevenlabs",
    pricing_detail: {
      free_tier: "10,000 characters per month — roughly 10–15 minutes of audio. Watermarked on some plans.",
      cliff: "10,000 characters is one decent podcast segment. A full episode runs 30,000+ characters. The free tier is a demo, not a workflow.",
      paid_monthly: "Starter at $5/month for 30,000 characters. Creator at $22/month for 100,000. Commercial licensing requires at least the Creator plan.",
      last_verified: "April 2025",
    },
    alternatives: [],
  },
  {
    slug: "n8n",
    pricing_detail: {
      free_tier: "n8n is open-source — self-hosted is genuinely free with no execution limits. Cloud hosting has a 14-day free trial.",
      cliff: "Self-hosting requires a server and some DevOps patience. If you can't run a Node.js app, the free path isn't frictionless.",
      paid_monthly: "n8n Cloud Starter at $20/month for 2,500 executions and 5 active workflows. Grows with usage.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "zapier", reason: "If you want zero server setup and don't need advanced branching logic, Zapier's managed hosting removes all the infrastructure friction." },
    ],
  },
  {
    slug: "zapier",
    pricing_detail: {
      free_tier: "100 tasks per month on 5 Zaps. Single-step Zaps only — no multi-step automation on the free tier.",
      cliff: "Multi-step Zaps — the useful kind — require a paid plan. 100 tasks evaporates fast if you're doing anything with volume.",
      paid_monthly: "Starter at $19.99/month for 750 tasks and multi-step Zaps. Professional at $49/month for 2,000 tasks and premium apps.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "n8n", reason: "If you're hitting Zapier's pricing ceiling or need complex conditional logic, n8n's self-hosted option removes per-task pricing entirely." },
    ],
  },
  {
    slug: "fathom",
    pricing_detail: {
      free_tier: "Unlimited recordings, transcripts, and basic summaries. 5 AI-generated meeting summaries per month on the free plan.",
      cliff: "5 summaries per month is the real constraint — anyone on more than a couple of calls a week will hit it in the first week.",
      paid_monthly: "Fathom Premium at $15/month for unlimited AI summaries. Immediate ROI if you're on calls every day.",
      last_verified: "April 2025",
    },
    alternatives: [],
  },
  {
    slug: "notebooklm",
    pricing_detail: {
      free_tier: "NotebookLM is free. Upload up to 50 sources per notebook, 500,000 words per source. No usage cap as of April 2025.",
      cliff: "The main friction isn't pricing — it's the manual upload step. There's no live web integration; you bring your own documents.",
      paid_monthly: "NotebookLM Plus is available as part of Google One AI Premium at $19.99/month. Adds higher limits and priority access.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "perplexity", reason: "For research that starts with open-web questions rather than your own documents, Perplexity handles live source synthesis better." },
    ],
  },
  {
    slug: "lovable",
    pricing_detail: {
      free_tier: "5 messages per day on the free plan. Enough to explore the product, not enough to build anything substantial.",
      cliff: "5 messages is a single small feature. Any real project exhausts the free tier within an hour.",
      paid_monthly: "Lovable Pro at $25/month for 100 messages. Agency plans available for higher volume.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "bolt-new", reason: "If Lovable's message-based pricing model frustrates you on iterative projects, Bolt's token-based model gives more granular control." },
    ],
  },
  {
    slug: "bolt-new",
    pricing_detail: {
      free_tier: "150,000 tokens per day on the free plan. Resets daily — enough for real iterative building.",
      cliff: "Complex apps with lots of back-and-forth iteration can burn through 150k tokens in a few hours of active development.",
      paid_monthly: "Bolt Pro at $20/month for higher daily token limits and faster generation. Team plans available.",
      last_verified: "April 2025",
    },
    alternatives: [
      { slug: "lovable", reason: "If you prefer a more visual, design-first approach to app generation, Lovable's output tends to be more polished on the UI side." },
    ],
  },
];

async function main() {
  let ok = 0;
  let fail = 0;

  for (const seed of seeds) {
    const update: Record<string, unknown> = {};
    if (seed.pricing_detail !== undefined) update.pricing_detail = seed.pricing_detail;
    if (seed.alternatives !== undefined) update.alternatives = seed.alternatives;

    const { error } = await supabase
      .from("tools")
      .update(update)
      .eq("slug", seed.slug);

    if (error) {
      console.error(`✗ ${seed.slug}:`, error.message);
      fail++;
    } else {
      console.log(`✓ ${seed.slug}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} updated, ${fail} failed`);
}

main();
