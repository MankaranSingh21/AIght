"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";

export async function updateToolContent(
  toolId: string,
  videoUrl: string,
  learningGuide: string
) {
  // ── Auth check (user-scoped client) ────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return { error: "Not authorised." };
  }

  // ── Write (service-role client — bypasses RLS on tools table) ─────────────
  const service = createServiceClient();

  const { error } = await service
    .from("tools")
    .update({
      video_url: videoUrl.trim() || null,
      learning_guide: learningGuide.trim() || null,
    })
    .eq("id", toolId);

  if (error) {
    console.error("Supabase update failed:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
