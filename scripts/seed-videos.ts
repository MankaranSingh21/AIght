/**
 * seed-videos.ts — populates video_url for tools that are missing one.
 * Run: npx tsx scripts/seed-videos.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VIDEOS: { slug: string; video_url: string }[] = [
  { slug: "suno",          video_url: "https://www.youtube.com/watch?v=sRWbGDBuAkc" },
  { slug: "landr",         video_url: "https://www.youtube.com/watch?v=4cx-m6lCCxc" },
  { slug: "aiva",          video_url: "https://www.youtube.com/watch?v=HmSGKhW26TI" },
  { slug: "adobe-firefly", video_url: "https://www.youtube.com/watch?v=S6-TZYS5YXY" },
  { slug: "apollo-io",     video_url: "https://www.youtube.com/watch?v=Bnr5Xqzr-Ec" },
  { slug: "jasper",        video_url: "https://www.youtube.com/watch?v=M2xyfVIHmqQ" },
  { slug: "gong",          video_url: "https://www.youtube.com/watch?v=g4KIS6_TZXc" },
  { slug: "clay",          video_url: "https://www.youtube.com/watch?v=bIN4FjcQdTA" },
  { slug: "descript",      video_url: "https://www.youtube.com/watch?v=ldEgLYinLsM" },
  { slug: "harvey-ai",     video_url: "https://www.youtube.com/watch?v=ydIT4EdLK54" },
  { slug: "eduaide-ai",    video_url: "https://www.youtube.com/watch?v=NmDRrXNqqOI" },
  { slug: "otter-ai",      video_url: "https://www.youtube.com/watch?v=fIOvCAf8AKQ" },
  { slug: "khanmigo",      video_url: "https://www.youtube.com/watch?v=rnIgnS8Susg" },
  { slug: "gnome-deepmind",video_url: "https://www.youtube.com/watch?v=c0fNbXSmVwo" },
  { slug: "alphafold",     video_url: "https://www.youtube.com/watch?v=gg7WjuFs8F4" },
  { slug: "alphasense",    video_url: "https://www.youtube.com/watch?v=UTboXO7D8Zo" },
  { slug: "runway-ml",     video_url: "https://www.youtube.com/watch?v=lAIx0b-UUTo" },
];

async function main() {
  console.log(`\n🎬 AIght Video Seeder — ${VIDEOS.length} tools\n`);
  let ok = 0, fail = 0;

  for (const { slug, video_url } of VIDEOS) {
    const { error } = await supabase
      .from("tools")
      .update({ video_url })
      .eq("slug", slug);

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${slug}`);
      ok++;
    }
  }
  console.log(`\n✅  Done — ${ok} updated, ${fail} failed.`);
}

main();
