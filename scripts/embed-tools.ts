/**
 * scripts/embed-tools.ts
 *
 * One-shot offline embedding pass. Reads every non-deprecated tool from
 * Supabase, concatenates name + category + vibe_description + tags +
 * aights_take into a single descriptor, sends to OpenAI's
 * text-embedding-3-small (1536d, ~$0.02 / 1M tokens), and writes the
 * resulting vector into `tools.embedding`.
 *
 * This is intentionally a script — not a runtime route — because
 * `.claude/CLAUDE.md` forbids external AI calls in the product itself.
 * The vectors generated here are used at runtime via pgvector cosine
 * lookups (`match_tools_for_slug` SQL function in migration 011) for
 * the "Tools like this" surface — pure SQL, no AI at request time.
 *
 * Usage:
 *   # 1) Apply migration 011 first via Supabase SQL Editor.
 *   # 2) Set OPENAI_API_KEY in .env.local (Vercel env not used by scripts).
 *   # 3) Dry-run (no writes, shows which tools would be embedded):
 *   npx tsx --env-file=.env.local scripts/embed-tools.ts
 *
 *   # 4) Apply (writes embeddings to Supabase):
 *   npx tsx --env-file=.env.local scripts/embed-tools.ts --apply
 *
 *   # 5) Re-embed only a specific slug (useful after editing aights_take):
 *   npx tsx --env-file=.env.local scripts/embed-tools.ts --apply --only=claude
 *
 * Cost estimate: ~60 tools × ~120 tokens each ≈ 7200 tokens ≈ $0.0001 total.
 */

import { createClient } from "@supabase/supabase-js";

const EMBED_MODEL = "text-embedding-3-small";
const EMBED_DIM = 1536;

type ToolRow = {
  slug: string;
  name: string;
  category: string | null;
  vibe_description: string | null;
  tags: string[] | null;
  aights_take: string | null;
  status: string | null;
};

function descriptor(t: ToolRow): string {
  const parts = [
    `Tool name: ${t.name}`,
    t.category ? `Category: ${t.category}` : "",
    t.vibe_description ? `Description: ${t.vibe_description}` : "",
    t.tags?.length ? `Tags: ${t.tags.join(", ")}` : "",
    t.aights_take ? `AIght's take: ${t.aights_take}` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

async function embed(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  const vec = json.data?.[0]?.embedding;
  if (!vec || vec.length !== EMBED_DIM) {
    throw new Error(`Unexpected embedding shape (len=${vec?.length})`);
  }
  return vec;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg?.split("=")[1];

  console.log(`\n🟢 embed-tools pipeline (${apply ? "APPLY" : "DRY-RUN"}${only ? ` · only=${only}` : ""})\n`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  if (apply && !process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY (required for --apply).");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  let query = supabase
    .from("tools")
    .select("slug,name,category,vibe_description,tags,aights_take,status")
    .neq("status", "deprecated");
  if (only) query = query.eq("slug", only);

  const { data: rows, error } = await query;
  if (error) {
    console.error("❌ Supabase fetch failed:", error.message);
    process.exit(1);
  }
  const tools = (rows ?? []) as ToolRow[];
  if (tools.length === 0) {
    console.log("Nothing to embed.");
    return;
  }

  console.log(`Preparing ${tools.length} tools:\n`);
  for (const t of tools) {
    const desc = descriptor(t);
    const preview = desc.replace(/\n/g, " ").slice(0, 72);
    console.log(`  • ${t.slug.padEnd(20)} ${preview}${desc.length > 72 ? "…" : ""}`);
  }

  if (!apply) {
    console.log(`\n(dry-run) Pass --apply with OPENAI_API_KEY set to write embeddings to Supabase.\n`);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY!;
  let updated = 0;
  const failures: string[] = [];

  for (const t of tools) {
    try {
      const vec = await embed(descriptor(t), apiKey);
      const { error: upErr } = await supabase
        .from("tools")
        .update({ embedding: vec as unknown as string })
        .eq("slug", t.slug);
      if (upErr) {
        failures.push(`${t.slug}: ${upErr.message}`);
        continue;
      }
      updated++;
      console.log(`  ✓ ${t.slug}`);
      // Be polite to the embeddings endpoint.
      await new Promise((r) => setTimeout(r, 80));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      failures.push(`${t.slug}: ${msg}`);
      console.error(`  ✗ ${t.slug} — ${msg}`);
    }
  }

  console.log(`\nDone. Updated: ${updated}. Failed: ${failures.length}.`);
  if (failures.length) {
    failures.forEach((f) => console.error(`  ${f}`));
    process.exit(1);
  }
}

main();
