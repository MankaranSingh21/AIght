"use server";

import { createClient } from "@/utils/supabase/server";

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
    // Unique constraint violation — already subscribed. Treat as success.
    if (error.code === "23505") return {};
    return { error: "Something went wrong. Please try again." };
  }

  return {};
}
