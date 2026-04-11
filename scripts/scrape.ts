/**
 * AIght — Scraping Pipeline
 * Usage: npm run scrape
 *
 * Requires in .env.local:
 *   FIRECRAWL_API_KEY
 *   GEMINI_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import "dotenv/config";
import FirecrawlApp from "@mendable/firecrawl-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// ── Env validation ────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    console.error(`✗  Missing env var: ${key}`);
    process.exit(1);
  }
  return val;
}

const FIRECRAWL_KEY   = requireEnv("FIRECRAWL_API_KEY");
const GEMINI_KEY      = requireEnv("GEMINI_API_KEY");
const SUPABASE_URL    = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SVC    = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

// ── Accent helper (assigned from category, not LLM) ──────────────────────

const ACCENT_MAP: Record<string, "moss" | "amber" | "lavender"> = {
  "AI CHAT":    "moss",
  "RESEARCH":   "moss",
  "IMAGE GEN":  "lavender",
  "VIDEO GEN":  "lavender",
  "AUDIO":      "lavender",
  "DEV TOOLS":  "amber",
  "PRODUCTIVITY": "amber",
  "EDUCATION":  "amber",
};

function accent(category: string): "moss" | "amber" | "lavender" {
  return ACCENT_MAP[category.toUpperCase().trim()] ?? "moss";
}

// ── Gemini response type ──────────────────────────────────────────────────

type CuratedTool = {
  name: string;
  slug: string;
  url: string;
  vibe_description: string;
  category: string;
  is_free: boolean;
  emoji: string;
  tags: string[];
};

// ── 1. Scrape ─────────────────────────────────────────────────────────────

async function scrape(): Promise<string> {
  console.log("⟳  Scraping Hugging Face Spaces…");

  const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_KEY });

  const result = await firecrawl.scrape(
    "https://huggingface.co/spaces?sort=trending",
    { formats: ["markdown"] }
  );

  if (!result.markdown) {
    throw new Error("Firecrawl returned no markdown content");
  }

  // Trim to a reasonable size — Gemini Flash has a large context but we don't
  // need to send the entire page (nav, footers, repeated chrome).
  const trimmed = result.markdown.slice(0, 12_000);
  console.log(`✓  Scraped ${trimmed.length} chars`);
  return trimmed;
}

// ── 2. Curate with Gemini ─────────────────────────────────────────────────

async function curate(rawText: string): Promise<CuratedTool[]> {
  console.log("⟳  Curating with Gemini…");

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are the curator for AIght, a solarpunk hopecore AI learning platform.

Review these raw scraped tools from Hugging Face Spaces.
Filter out enterprise infrastructure junk, CLI-only developer plumbing, and anything that requires a PhD to understand.
Keep tools that fit the "for builders", "for broke students", "for writers", or "for the curious" vibes.
Pick the top 5 most interesting and approachable ones.

For each tool you keep, rewrite its description into a single punchy vibe_description:
- First-person voice, slightly dramatic, genuinely warm
- No "10x your output", "leverage AI", "seamless", or any corporate hustle jargon
- Max 20 words. Make it feel like a friend recommending it.

Assign a fitting single emoji and 3–5 lowercase tags.

Category must be exactly one of: AI CHAT, IMAGE GEN, VIDEO GEN, AUDIO, DEV TOOLS, PRODUCTIVITY, RESEARCH, EDUCATION, OTHER.

Return ONLY a valid JSON array — no markdown, no explanation:
[{
  "name": string,
  "slug": string (url-safe lowercase, hyphens only),
  "url": string (full https URL),
  "vibe_description": string,
  "category": string,
  "is_free": boolean,
  "emoji": string (single emoji),
  "tags": string[]
}]

Raw scraped content:
---
${rawText}
---
`.trim();

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  let tools: CuratedTool[];
  try {
    tools = JSON.parse(text) as CuratedTool[];
  } catch {
    console.error("Gemini returned non-JSON:\n", text.slice(0, 500));
    throw new Error("Failed to parse Gemini JSON response");
  }

  console.log(`✓  Gemini returned ${tools.length} curated tools`);
  return tools;
}

// ── 3. Insert into Supabase ───────────────────────────────────────────────

async function persist(tools: CuratedTool[]): Promise<void> {
  console.log("⟳  Inserting into Supabase…");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SVC);

  const rows = tools.map((t) => ({
    name:             t.name,
    slug:             t.slug,
    url:              t.url,
    vibe_description: t.vibe_description,
    category:         t.category,
    is_free:          t.is_free,
    emoji:            t.emoji,
    tags:             t.tags,
    accent:           accent(t.category),
  }));

  const { data, error } = await supabase
    .from("tools")
    .upsert(rows, { onConflict: "slug" })
    .select("name, slug");

  if (error) {
    throw new Error(`Supabase insert failed: ${JSON.stringify(error)}`);
  }

  console.log("✓  Upserted:");
  data?.forEach((t) => console.log(`   • ${t.name}  (${t.slug})`));
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌿  AIght scrape pipeline starting…\n");
  try {
    const raw   = await scrape();
    const tools = await curate(raw);
    await persist(tools);
    console.log("\n✦  Done.\n");
  } catch (err) {
    console.error("\n✗  Pipeline failed:", err);
    process.exit(1);
  }
}

main();
