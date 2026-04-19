import { createClient } from "@/utils/supabase/server";
import AdminToolList from "@/components/AdminToolList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No active auth system — show nothing until auth is re-added
  if (!user) {
    return (
      <main className="min-h-screen bg-page flex items-center justify-center">
        <p className="font-sans text-sm text-muted">Nothing to see here. ✦</p>
      </main>
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return (
      <main className="min-h-screen bg-page flex items-center justify-center">
        <p className="font-sans text-sm text-muted">Nothing to see here. ✦</p>
      </main>
    );
  }

  const { data } = await supabase
    .from("tools")
    .select("id, name, slug, category, emoji, video_url, learning_guide")
    .order("created_at", { ascending: true });

  const tools = data ?? [];

  return (
    <main className="min-h-screen bg-page">
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">

        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            admin · restricted
          </p>
          <h1 className="font-sans text-4xl font-semibold text-primary">
            Tool Content Manager
          </h1>
          <p className="font-sans text-sm text-secondary">
            {tools.length} tools · click Edit to update a tool&apos;s video and guide.
          </p>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            video set
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-raised inline-block" />
            no video
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warm inline-block" />
            guide set
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-raised inline-block" />
            no guide
          </span>
        </div>

        <AdminToolList tools={tools} />
      </div>
    </main>
  );
}
