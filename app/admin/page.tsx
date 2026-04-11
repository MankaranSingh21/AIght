import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminToolList from "@/components/AdminToolList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard — send unauthenticated visitors to login
  if (!user) redirect("/login");

  // Admin guard — bail early if not the owner
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return (
      <main className="min-h-screen bg-parchment flex items-center justify-center px-6">
        <p className="font-body text-sm text-forest/50">
          Nothing to see here. ✦
        </p>
      </main>
    );
  }

  const { data } = await supabase
    .from("tools")
    .select("id, name, slug, category, emoji, video_url, learning_guide")
    .order("created_at", { ascending: true });

  const tools = data ?? [];

  return (
    <main className="min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-moss-500">
            admin ✦ restricted
          </p>
          <h1 className="font-serif text-4xl font-bold text-espresso">
            Tool Content Manager
          </h1>
          <p className="font-body text-sm text-forest/60">
            {tools.length} tools · click Edit to expand a tool and update its video and guide.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 font-body text-xs text-forest/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-moss-500 inline-block" />
            video set
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-moss-200 inline-block" />
            no video
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            guide set
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-100 inline-block" />
            no guide
          </span>
        </div>

        <AdminToolList tools={tools} />
      </div>
    </main>
  );
}
