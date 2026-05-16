#!/usr/bin/env node
/**
 * Phase G backfill — copies the seeded JSON content into the new tool columns
 * created by scripts/migration-007-tool-content-columns.sql.
 *
 * Run AFTER applying migration 007:
 *   1. Run scripts/migration-007-tool-content-columns.sql in Supabase SQL Editor
 *   2. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   3. node scripts/backfill-tool-content.mjs
 *
 * Idempotent — running twice is safe.
 * Reads three JSON files in content/ and updates public.tools row-by-row.
 *
 * After this lands, you can update lib/tool-mapping.ts + app/tool/[slug]/page.tsx
 * to read from the DB columns instead of importing the JSON files, and finally
 * delete content/aights-take.json, content/tool-replaces.json, content/tool-human-notes.json.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// Load env from .env.local without dotenv dep
function loadEnv() {
  try {
    const raw = readFileSync(join(REPO_ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // Fine if .env.local isn't there — env may already be set.
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

function readJson(rel) {
  return JSON.parse(readFileSync(join(REPO_ROOT, rel), "utf8"));
}

const takes    = readJson("content/aights-take.json");          // { slug: "verdict" }
const replaces = readJson("content/tool-replaces.json");        // { slug: [...] }
const notes    = readJson("content/tool-human-notes.json");     // { slug: { headline, body, essay } }

// Union of all seeded slugs
const slugs = new Set([
  ...Object.keys(takes),
  ...Object.keys(replaces),
  ...Object.keys(notes),
]);

console.log(`Backfilling ${slugs.size} tool slugs…`);

let ok = 0;
let skipped = 0;
let failed = 0;
const failures = [];

for (const slug of slugs) {
  const patch = {};
  if (takes[slug])    patch.aights_take = takes[slug];
  if (replaces[slug]) patch.replaces    = replaces[slug];
  if (notes[slug])    patch.human_note  = notes[slug];
  if (Object.keys(patch).length === 0) { skipped++; continue; }

  const { error, count } = await supabase
    .from("tools")
    .update(patch, { count: "exact" })
    .eq("slug", slug);

  if (error) {
    failed++;
    failures.push({ slug, error: error.message });
    console.error(`✗ ${slug}: ${error.message}`);
  } else if (count === 0) {
    skipped++;
    console.warn(`· ${slug}: no matching tool row (skipped)`);
  } else {
    ok++;
    console.log(`✓ ${slug}: ${Object.keys(patch).join(", ")}`);
  }
}

console.log("");
console.log(`Done. Updated: ${ok}  ·  Skipped (no row): ${skipped}  ·  Failed: ${failed}`);
if (failures.length > 0) {
  console.error("Failures:");
  for (const f of failures) console.error(`  - ${f.slug}: ${f.error}`);
  process.exit(1);
}
