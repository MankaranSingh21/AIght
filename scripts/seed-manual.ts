import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase with the Service Role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("🌿 AIght Manual Seed Pipeline starting...");

  try {
    // 1. Locate and read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'curated_tools.json');
    console.log(`⟳ Reading file from: ${filePath}`);
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const tools = JSON.parse(fileContent);

    console.log(`✓ Found ${tools.length} tools to process.`);

    // 2. Map the tools to ensure they have the exact fields Supabase expects
    // Adding default emojis and accents based on category, just like the scraping script would
    const formattedTools = tools.map((tool: any) => {
      let accent = 'moss';
      if (tool.category === 'IMAGE GEN' || tool.category === 'VIDEO GEN') accent = 'lavender';
      if (tool.category === 'DEV TOOLS') accent = 'amber';
      if (tool.category === 'PRODUCTIVITY' || tool.category === 'RESEARCH') accent = 'sand';

      return {
        name: tool.name,
        slug: tool.slug,
        url: tool.url,
        vibe_description: tool.vibe_description,
        category: tool.category,
        is_free: tool.is_free,
        emoji: '✨', // Default cozy emoji
        accent: accent
      };
    });

    console.log("⟳ Upserting into Supabase...");

    // 3. Upsert into the database (matching on 'slug' to avoid duplicates)
    const { error } = await supabase
      .from('tools')
      .upsert(formattedTools, { onConflict: 'slug' });

    if (error) {
      throw error;
    }

    console.log("✅ Pipeline complete! Your tools are live.");

  } catch (error) {
    console.error("❌ Pipeline failed:", error);
  }
}

main();