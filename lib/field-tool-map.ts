/**
 * Maps each field guide slug to the Supabase tool slugs that should be
 * prioritised in quiz recommendations for that field.
 *
 * Slugs here must match actual rows in the `tools` table.
 */

export const FIELD_TOOL_MAP: Record<string, string[]> = {
  "biology":                       ["alphafold", "atomwise", "elicit"],
  "pharmacy-drug-discovery":       ["alphafold", "atomwise", "elicit"],
  "physics-engineering":           ["notebooklm", "cursor-3", "perplexity"],
  "medicine-healthcare":           ["openevidence", "notebooklm", "perplexity"],
  "law-legal":                     ["harvey-ai", "perplexity", "notebooklm"],
  "finance-economics":             ["alphasense", "perplexity", "notebooklm"],
  "education-teaching":            ["khanmigo", "eduaide-ai", "notebooklm"],
  "architecture-urban-design":     ["midjourney", "cursor-3", "notebooklm"],
  "creative-writing-literature":   ["sudowrite", "novelcrafter", "claude-4-6"],
  "graphic-design-visual-arts":    ["adobe-firefly", "ideogram-3-0", "recraft-v3"],
  "film-video-production":         ["runway-ml", "descript", "otter-ai"],
  "music-audio":                   ["suno", "aiva", "landr"],
  "journalism-media":              ["otter-ai", "perplexity", "notebooklm"],
  "psychology-mental-health":      ["woebot", "notebooklm", "perplexity"],
  "social-work-public-policy":     ["notebooklm", "perplexity", "claude-4-6"],
  "history-humanities":            ["notebooklm", "perplexity", "elicit"],
  "software-engineering":          ["cursor-3", "windsurf", "aider"],
  "marketing-advertising":         ["jasper", "adobe-firefly", "canva-magic"],
  "sales-business-development":    ["clay", "apollo-io", "gong"],
  "chemistry-materials-science":   ["gnome-deepmind", "elicit", "notebooklm"],
  "environmental-science-climate": ["perplexity", "notebooklm", "elicit"],
  "agriculture-food-science":      ["notebooklm", "perplexity", "elicit"],
};
