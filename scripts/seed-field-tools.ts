/**
 * seed-field-tools.ts
 *
 * Adds field-specific AI tools (from content/paths/fields.json) to the Supabase tools table.
 * These tools are referenced in field guides but previously had no tool detail pages.
 *
 * Run: npx tsx scripts/seed-field-tools.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FIELD_TOOLS = [
  // ── Biology ───────────────────────────────────────────────────────────
  {
    slug: "alphafold", name: "AlphaFold", category: "RESEARCH",
    vibe_description: "DeepMind's protein structure prediction system. Predicts the 3D shape of proteins from amino acid sequences with near-experimental accuracy.",
    url: "https://alphafold.ebi.ac.uk", is_free: true, status: "stable",
    tags: ["biology", "protein", "research", "open-source"], is_open_source: true,
    risk_level: "Low", emoji: "🧬", accent: "#00FFD1",
    utility_score: 90, privacy_score: 75, speed_score: 72, cost_score: 95, transparency_score: 88,
    pricing_detail: { free_tier: "Fully free via EBI web interface", cliff: "None", paid_monthly: "Free", last_verified: "2025-01" },
  },
  {
    slug: "atomwise", name: "Atomwise", category: "RESEARCH",
    vibe_description: "Uses deep learning neural networks to screen millions of compounds against drug targets, accelerating early-stage drug discovery.",
    url: "https://www.atomwise.com", is_free: false, status: "stable",
    tags: ["biology", "drug-discovery", "deep-learning", "research"], is_open_source: false,
    risk_level: "Low", emoji: "⚗️", accent: "#A373D7",
    utility_score: 82, privacy_score: 68, speed_score: 75, cost_score: 45, transparency_score: 65,
    pricing_detail: { free_tier: "Partnership/academic agreements", cliff: "Enterprise only", paid_monthly: "Custom", last_verified: "2025-01" },
  },

  // ── Music / Audio ─────────────────────────────────────────────────────
  {
    slug: "suno", name: "Suno", category: "AUDIO",
    vibe_description: "Text-to-music AI that generates full songs — vocals, instruments, lyrics — from a short prompt in seconds.",
    url: "https://suno.com", is_free: true, status: "rising",
    tags: ["music", "audio", "generation", "creative"], is_open_source: false,
    risk_level: "Low", emoji: "🎵", accent: "#F4AB1F",
    utility_score: 88, privacy_score: 60, speed_score: 80, cost_score: 70, transparency_score: 55,
    pricing_detail: { free_tier: "10 generations/day", cliff: "Commercial use requires paid plan", paid_monthly: "~$10/mo (Pro)", last_verified: "2025-01" },
  },
  {
    slug: "aiva", name: "AIVA", category: "AUDIO",
    vibe_description: "AI music composer trained on classical and film music. Generates original compositions for games, films, and media.",
    url: "https://www.aiva.ai", is_free: true, status: "stable",
    tags: ["music", "composition", "film", "creative"], is_open_source: false,
    risk_level: "Low", emoji: "🎼", accent: "#A373D7",
    utility_score: 80, privacy_score: 68, speed_score: 76, cost_score: 68, transparency_score: 70,
    pricing_detail: { free_tier: "3 downloads/month, watermarked", cliff: "Commercial rights require Standard ($33/mo)", paid_monthly: "$11–$33/mo", last_verified: "2025-01" },
  },
  {
    slug: "landr", name: "LANDR", category: "AUDIO",
    vibe_description: "AI-powered audio mastering and music distribution platform used by millions of independent artists.",
    url: "https://www.landr.com", is_free: false, status: "stable",
    tags: ["music", "mastering", "distribution", "audio"], is_open_source: false,
    risk_level: "Low", emoji: "🎧", accent: "#00FFD1",
    utility_score: 78, privacy_score: 65, speed_score: 80, cost_score: 65, transparency_score: 68,
    pricing_detail: { free_tier: "One preview master free", cliff: "Download and distribution require subscription", paid_monthly: "$11–$39/mo", last_verified: "2025-01" },
  },

  // ── Film / Video ──────────────────────────────────────────────────────
  {
    slug: "runway-ml", name: "Runway ML", category: "VIDEO GEN",
    vibe_description: "Professional-grade AI video generation and editing. Gen-3 Alpha produces cinematic footage from text or image prompts.",
    url: "https://runwayml.com", is_free: true, status: "rising",
    tags: ["video", "film", "generation", "creative"], is_open_source: false,
    risk_level: "Low", emoji: "🎬", accent: "#A373D7",
    utility_score: 88, privacy_score: 62, speed_score: 70, cost_score: 55, transparency_score: 65,
    pricing_detail: { free_tier: "125 credits/month (~25s of video)", cliff: "Credits deplete fast; 4K requires Enterprise", paid_monthly: "$15–$95/mo", last_verified: "2025-01" },
  },
  {
    slug: "descript", name: "Descript", category: "PRODUCTIVITY",
    vibe_description: "Edit audio and video by editing a transcript. Overdub clones your voice; AI removes filler words and silences automatically.",
    url: "https://www.descript.com", is_free: true, status: "stable",
    tags: ["video", "audio", "editing", "podcast"], is_open_source: false,
    risk_level: "Low", emoji: "✂️", accent: "#AAFF4D",
    utility_score: 85, privacy_score: 65, speed_score: 82, cost_score: 72, transparency_score: 72,
    pricing_detail: { free_tier: "1 hour transcription/month, watermarked export", cliff: "Overdub and 4K require paid plan", paid_monthly: "$24–$40/mo per user", last_verified: "2025-01" },
  },

  // ── Journalism / Media ────────────────────────────────────────────────
  {
    slug: "otter-ai", name: "Otter.ai", category: "PRODUCTIVITY",
    vibe_description: "Real-time AI transcription and meeting notes. Captures, summarises, and lets you search audio from interviews, calls, and lectures.",
    url: "https://otter.ai", is_free: true, status: "stable",
    tags: ["transcription", "journalism", "meetings", "productivity"], is_open_source: false,
    risk_level: "Low", emoji: "📝", accent: "#00FFD1",
    utility_score: 84, privacy_score: 55, speed_score: 88, cost_score: 75, transparency_score: 70,
    pricing_detail: { free_tier: "300 minutes/month, limited AI features", cliff: "Team features behind Pro ($17/mo)", paid_monthly: "$17–$40/mo", last_verified: "2025-01" },
  },

  // ── Law ───────────────────────────────────────────────────────────────
  {
    slug: "harvey-ai", name: "Harvey AI", category: "PRODUCTIVITY",
    vibe_description: "AI legal assistant trained on law. Drafts contracts, conducts due diligence, and researches case law for law firms and in-house teams.",
    url: "https://www.harvey.ai", is_free: false, status: "stable",
    tags: ["law", "legal", "contracts", "research"], is_open_source: false,
    risk_level: "Low", emoji: "⚖️", accent: "#F4AB1F",
    utility_score: 86, privacy_score: 70, speed_score: 80, cost_score: 48, transparency_score: 72,
    pricing_detail: { free_tier: "None (enterprise-only)", cliff: "N/A", paid_monthly: "Custom enterprise pricing", last_verified: "2025-01" },
  },

  // ── Finance ───────────────────────────────────────────────────────────
  {
    slug: "alphasense", name: "AlphaSense", category: "RESEARCH",
    vibe_description: "AI-powered market intelligence platform. Searches earnings calls, filings, research, and news to surface financial signals.",
    url: "https://www.alpha-sense.com", is_free: false, status: "stable",
    tags: ["finance", "research", "market-intelligence", "enterprise"], is_open_source: false,
    risk_level: "Low", emoji: "📊", accent: "#00FFD1",
    utility_score: 88, privacy_score: 65, speed_score: 84, cost_score: 42, transparency_score: 68,
    pricing_detail: { free_tier: "None", cliff: "N/A", paid_monthly: "Enterprise ($3,000+/yr)", last_verified: "2025-01" },
  },

  // ── Medicine / Healthcare ─────────────────────────────────────────────
  {
    slug: "openevidence", name: "OpenEvidence", category: "RESEARCH",
    vibe_description: "AI clinical decision support trained on 50M+ medical papers. Answers clinical questions with cited, peer-reviewed sources.",
    url: "https://openevidence.com", is_free: true, status: "rising",
    tags: ["medicine", "healthcare", "clinical", "research"], is_open_source: false,
    risk_level: "Low", emoji: "🏥", accent: "#AAFF4D",
    utility_score: 84, privacy_score: 68, speed_score: 80, cost_score: 82, transparency_score: 75,
    pricing_detail: { free_tier: "Free for licensed clinicians", cliff: "Team/hospital plans for advanced features", paid_monthly: "Free (clinician-verified)", last_verified: "2025-01" },
  },

  // ── Education ─────────────────────────────────────────────────────────
  {
    slug: "khanmigo", name: "Khanmigo", category: "PRODUCTIVITY",
    vibe_description: "Khan Academy's AI tutor that guides students through problems with Socratic questioning instead of giving direct answers.",
    url: "https://www.khanacademy.org/khan-labs", is_free: false, status: "stable",
    tags: ["education", "tutoring", "k-12", "learning"], is_open_source: false,
    risk_level: "Low", emoji: "🎓", accent: "#AAFF4D",
    utility_score: 82, privacy_score: 75, speed_score: 78, cost_score: 88, transparency_score: 80,
    pricing_detail: { free_tier: "Free for students in US (donor-funded)", cliff: "Districts pay separately", paid_monthly: "~$4/mo for families", last_verified: "2025-01" },
  },
  {
    slug: "eduaide-ai", name: "Eduaide.ai", category: "PRODUCTIVITY",
    vibe_description: "AI co-teacher that generates lesson plans, assessments, rubrics, and differentiated materials from a single topic input.",
    url: "https://www.eduaide.ai", is_free: true, status: "stable",
    tags: ["education", "lesson-plans", "teachers", "curriculum"], is_open_source: false,
    risk_level: "Low", emoji: "📚", accent: "#F4AB1F",
    utility_score: 80, privacy_score: 68, speed_score: 78, cost_score: 78, transparency_score: 72,
    pricing_detail: { free_tier: "Limited generations/month", cliff: "Unlimited plan from $9/mo", paid_monthly: "$9–$20/mo", last_verified: "2025-01" },
  },

  // ── Design / Marketing ────────────────────────────────────────────────
  {
    slug: "adobe-firefly", name: "Adobe Firefly", category: "IMAGE GEN",
    vibe_description: "Adobe's commercially safe AI image generator. Trained only on licensed Adobe Stock — no copyright risk for commercial use.",
    url: "https://firefly.adobe.com", is_free: true, status: "stable",
    tags: ["design", "image-gen", "creative", "commercial-safe"], is_open_source: false,
    risk_level: "Low", emoji: "🦋", accent: "#A373D7",
    utility_score: 84, privacy_score: 62, speed_score: 84, cost_score: 72, transparency_score: 70,
    pricing_detail: { free_tier: "25 generative credits/month with free account", cliff: "Credits exhausted quickly; included in CC subscription", paid_monthly: "Via Creative Cloud ($55/mo)", last_verified: "2025-01" },
  },
  {
    slug: "jasper", name: "Jasper", category: "PRODUCTIVITY",
    vibe_description: "AI writing platform for marketing teams. Generates on-brand copy, ads, emails, and long-form content with brand voice training.",
    url: "https://www.jasper.ai", is_free: false, status: "stable",
    tags: ["marketing", "copywriting", "content", "brand-voice"], is_open_source: false,
    risk_level: "Low", emoji: "✍️", accent: "#F4AB1F",
    utility_score: 80, privacy_score: 60, speed_score: 82, cost_score: 55, transparency_score: 65,
    pricing_detail: { free_tier: "7-day free trial", cliff: "No free tier", paid_monthly: "$49–$125+/mo", last_verified: "2025-01" },
  },

  // ── Sales ────────────────────────────────────────────────────────────
  {
    slug: "apollo-io", name: "Apollo.io", category: "PRODUCTIVITY",
    vibe_description: "B2B sales intelligence platform with 275M+ contacts. AI writes personalised email sequences and surfaces the right buyers.",
    url: "https://www.apollo.io", is_free: true, status: "stable",
    tags: ["sales", "b2b", "prospecting", "outreach"], is_open_source: false,
    risk_level: "Low", emoji: "🚀", accent: "#00FFD1",
    utility_score: 84, privacy_score: 52, speed_score: 82, cost_score: 68, transparency_score: 60,
    pricing_detail: { free_tier: "50 exports/month, limited sequences", cliff: "Phone numbers require paid plan", paid_monthly: "$49–$149/mo per seat", last_verified: "2025-01" },
  },
  {
    slug: "gong", name: "Gong", category: "PRODUCTIVITY",
    vibe_description: "Revenue intelligence platform. Records, transcribes, and analyses every sales call to surface coaching insights and deal risks.",
    url: "https://www.gong.io", is_free: false, status: "stable",
    tags: ["sales", "revenue-intelligence", "call-recording", "enterprise"], is_open_source: false,
    risk_level: "Low", emoji: "📞", accent: "#AAFF4D",
    utility_score: 88, privacy_score: 58, speed_score: 82, cost_score: 45, transparency_score: 62,
    pricing_detail: { free_tier: "None", cliff: "N/A", paid_monthly: "~$200+/mo per seat (enterprise)", last_verified: "2025-01" },
  },
  {
    slug: "clay", name: "Clay", category: "PRODUCTIVITY",
    vibe_description: "Data enrichment and AI outreach platform. Pulls from 75+ data sources to build hyper-personalised prospect lists and emails.",
    url: "https://www.clay.com", is_free: true, status: "rising",
    tags: ["sales", "enrichment", "outreach", "automation"], is_open_source: false,
    risk_level: "Low", emoji: "🏺", accent: "#F4AB1F",
    utility_score: 84, privacy_score: 58, speed_score: 80, cost_score: 62, transparency_score: 68,
    pricing_detail: { free_tier: "100 credits/month", cliff: "Serious prospecting requires Pro+ ($149/mo)", paid_monthly: "$149–$800+/mo", last_verified: "2025-01" },
  },

  // ── Psychology / Mental Health ────────────────────────────────────────
  {
    slug: "woebot", name: "Woebot", category: "PRODUCTIVITY",
    vibe_description: "AI mental health chatbot using CBT techniques. Checks in daily, tracks mood, and teaches coping skills via conversational exercises.",
    url: "https://woebothealth.com", is_free: false, status: "stable",
    tags: ["mental-health", "cbt", "therapy", "wellbeing"], is_open_source: false,
    risk_level: "Low", emoji: "🧠", accent: "#00FFD1",
    utility_score: 75, privacy_score: 72, speed_score: 80, cost_score: 70, transparency_score: 75,
    pricing_detail: { free_tier: "Consumer app free (limited); clinical version via health plans", cliff: "Clinical deployment requires B2B agreement", paid_monthly: "Free consumer / B2B enterprise", last_verified: "2025-01" },
  },

  // ── Chemistry / Materials ─────────────────────────────────────────────
  {
    slug: "gnome-deepmind", name: "GNoME (DeepMind)", category: "RESEARCH",
    vibe_description: "DeepMind's Graph Networks for Materials Exploration. Discovered 2.2M new crystal structures — 736 already synthesised in the lab.",
    url: "https://deepmind.google/discover/blog/millions-of-new-materials-discovered-with-deep-learning/", is_free: true, status: "stable",
    tags: ["chemistry", "materials-science", "research", "open-source"], is_open_source: true,
    risk_level: "Low", emoji: "💎", accent: "#00FFD1",
    utility_score: 90, privacy_score: 80, speed_score: 70, cost_score: 90, transparency_score: 88,
    pricing_detail: { free_tier: "Research database publicly accessible", cliff: "None", paid_monthly: "Free (academic)", last_verified: "2025-01" },
  },
];

async function main() {
  console.log(`\n🌱 AIght Field Tools Seeder — ${FIELD_TOOLS.length} tools\n`);

  let ok = 0;
  let fail = 0;

  for (const tool of FIELD_TOOLS) {
    const { error } = await supabase
      .from("tools")
      .upsert(
        {
          ...tool,
          alternatives: [],
          weaknesses: [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );

    if (error) {
      console.error(`  ✗ ${tool.slug}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${tool.slug.padEnd(26)} ${tool.category}`);
      ok++;
    }
  }

  console.log(`\n✅  Done — ${ok} upserted, ${fail} failed.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
