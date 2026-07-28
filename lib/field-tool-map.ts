/**
 * Maps each field guide slug to the Supabase tool slugs that should be
 * prioritised in quiz recommendations for that field.
 *
 * Slugs here must match actual rows in the `tools` table.
 */

export const FIELD_TOOL_MAP: Record<string, string[]> = {
  "biology":                       ["alphafold", "atomwise", "consensus"],
  "pharmacy-drug-discovery":       ["alphafold", "atomwise", "consensus"],
  "physics-engineering":           ["notebooklm", "cursor", "perplexity"],
  "medicine-healthcare":           ["openevidence", "notebooklm", "perplexity"],
  "law-legal":                     ["harvey-ai", "perplexity", "notebooklm"],
  "finance-economics":             ["alphasense", "perplexity", "notebooklm"],
  "education-teaching":            ["khanmigo", "eduaide-ai", "notebooklm"],
  "architecture-urban-design":     ["midjourney", "cursor", "notebooklm"],
  "creative-writing-literature":   ["sudowrite", "novelcrafter", "claude"],
  "graphic-design-visual-arts":    ["adobe-firefly", "ideogram-3-0", "recraft-v3"],
  "film-video-production":         ["runway-ml", "descript", "otter-ai"],
  "music-audio":                   ["suno", "aiva", "landr"],
  "journalism-media":              ["otter-ai", "perplexity", "notebooklm"],
  "psychology-mental-health":      ["woebot", "notebooklm", "perplexity"],
  "social-work-public-policy":     ["notebooklm", "perplexity", "claude"],
  "history-humanities":            ["notebooklm", "perplexity", "consensus"],
  "software-engineering":          ["cursor", "windsurf", "aider"],
  "marketing-advertising":         ["jasper", "adobe-firefly", "canva-magic-studio"],
  "sales-business-development":    ["clay", "apollo-io", "gong"],
  "chemistry-materials-science":   ["gnome-deepmind", "consensus", "notebooklm"],
  "environmental-science-climate": ["perplexity", "notebooklm", "consensus"],
  "agriculture-food-science":      ["notebooklm", "perplexity", "consensus"],
};
