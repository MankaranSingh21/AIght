import Link from "next/link";
import { createServiceClient } from "@/utils/supabase/service";

type Props = { slug: string };

export default async function ToolMention({ slug }: Props) {
  const supabase = createServiceClient();
  const { data: tool } = await supabase
    .from("tools")
    .select("slug, name, vibe_description, category")
    .eq("slug", slug)
    .single();

  if (!tool) return null;

  return (
    <Link
      href={`/tool/${tool.slug}`}
      style={{ textDecoration: "none", display: "block", margin: "28px 0" }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderLeft: "3px solid var(--accent-primary)",
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          transition: "border-color 150ms ease, background 150ms ease",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}>
              {tool.name}
            </span>
            <span className="tag" style={{ fontSize: 10 }}>
              {tool.category}
            </span>
          </div>
          {tool.vibe_description && (
            <p style={{
              fontFamily: "var(--font-editorial)",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: 1.55,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {tool.vibe_description}
            </p>
          )}
        </div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--accent-primary)",
          flexShrink: 0,
        }}>
          →
        </span>
      </div>
    </Link>
  );
}
