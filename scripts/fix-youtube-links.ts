import { createClient } from "@supabase/supabase-js";
import ytSearch from "yt-search";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: tools, error } = await supabase
    .from("tools")
    .select("slug, name");

  if (error || !tools) {
    console.error("❌  Failed to fetch tools:", error?.message);
    process.exit(1);
  }

  console.log(`Fetched ${tools.length} tools. Starting YouTube search...\n`);

  let updated = 0;
  let skipped = 0;

  for (const tool of tools) {
    const query = `${tool.name} tutorial 2026`;

    try {
      const results = await ytSearch(query);
      const topVideo = results.videos[0];

      if (!topVideo) {
        console.warn(`  ⚠  ${tool.slug}: no results found for "${query}"`);
        skipped++;
      } else {
        console.log(`  ✓  ${tool.slug} → "${topVideo.title}" (${topVideo.url})`);

        const { error: updateError } = await supabase
          .from("tools")
          .update({ video_url: topVideo.url })
          .eq("slug", tool.slug);

        if (updateError) {
          console.warn(`     ↳ DB update failed: ${updateError.message}`);
          skipped++;
        } else {
          updated++;
        }
      }
    } catch (err) {
      console.warn(`  ⚠  ${tool.slug}: search error — ${(err as Error).message}`);
      skipped++;
    }

    await sleep(2000);
  }

  console.log(`\nDone — ${updated} updated, ${skipped} skipped.`);
}

main();
