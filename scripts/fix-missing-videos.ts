/**
 * Fix video URLs for tools missing them.
 * Run: npx tsx scripts/fix-missing-videos.ts
 */
import { createClient } from '@supabase/supabase-js';
import ytSearch from 'yt-search';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Curated search queries — tuned to return quality tutorial/overview videos
const QUERIES: Record<string, string[]> = {
  'gemini':             ['Google Gemini AI tutorial how to use 2024', 'Gemini AI complete guide'],
  'deepseek':           ['DeepSeek AI tutorial beginners 2024', 'DeepSeek how to use guide'],
  'elevenlabs':         ['ElevenLabs AI voice tutorial 2025', 'ElevenLabs text to speech tutorial'],
  'zapier':             ['Zapier automation tutorial beginners 2024', 'Zapier how to use tutorial'],
  'n8n':                ['n8n tutorial beginners 2024', 'n8n workflow automation guide'],
  'canva-magic-studio': ['Canva AI tutorial 2024', 'Canva Magic Studio tutorial'],
  'tome':               ['Tome app presentation tutorial 2024', 'Tome AI slides how to use'],
  'fathom':             ['Fathom meeting notes tutorial 2024', 'Fathom AI notetaker review'],
  'runway':             ['Runway ML tutorial 2024', 'Runway AI video generation how to use'],
};

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const slugs = Object.keys(QUERIES);
  console.log(`Finding YouTube videos for ${slugs.length} tools…\n`);

  for (const slug of slugs) {
    const queries = QUERIES[slug];
    let found = false;

    for (const query of queries) {
      try {
        const results = await ytSearch(query);
        const video = results.videos.find(v => v.url && v.title);
        if (!video?.url) {
          await sleep(300);
          continue;
        }

        const { error } = await supabase
          .from('tools')
          .update({ video_url: video.url })
          .eq('slug', slug);

        if (error) {
          console.error(`✗  ${slug}: ${error.message}`);
        } else {
          console.log(`✓  ${slug}: ${video.title.slice(0, 65)}`);
          found = true;
        }
        break;
      } catch (e) {
        await sleep(300);
      }
    }

    if (!found) console.warn(`⚠  ${slug}: no usable result found`);
    await sleep(400);
  }

  console.log('\nDone.');
}

main().catch(console.error);
