"use server";

import { createClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/lib/email-templates/welcome";

export async function subscribeNewsletter(
  email: string
): Promise<{ error?: string }> {
  const cleaned = email.trim().toLowerCase();

  if (!cleaned || !cleaned.includes("@") || !cleaned.includes(".")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: cleaned });

  if (error) {
    // Unique constraint violation — already subscribed. Treat as success
    // (don't re-send the welcome — they got it the first time).
    if (error.code === "23505") return {};
    return { error: "Something went wrong. Please try again." };
  }

  // Fire-and-forget welcome email. If RESEND_API_KEY isn't set or Resend
  // fails, the subscription is still recorded.
  sendWelcomeEmail(cleaned).catch(() => { /* logged inside */ });

  return {};
}
