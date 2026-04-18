import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import NavAuthSection from "./NavAuthSection";
import CommandMenuTrigger from "./CommandMenuTrigger";

export default async function Navbar() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Not configured — show unauthenticated nav
  }

  return (
    <nav className="h-14 sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-moss-200">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-display text-2xl font-bold text-espresso leading-none">
            AIght
          </span>
          <span className="font-body text-2xs text-moss-500 uppercase tracking-widest hidden sm:block">
            ✦ tools
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/tools"
            className="font-body text-sm text-forest/70 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-moss-50 transition-all duration-150"
          >
            Directory
          </Link>
          <Link
            href="/pricing"
            className="font-body text-sm text-forest/70 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-moss-50 transition-all duration-150"
          >
            Pricing
          </Link>
          {user && (
            <Link
              href="/roadmaps"
              className="font-body text-sm text-forest/70 hover:text-forest px-3 py-1.5 rounded-lg hover:bg-moss-50 transition-all duration-150"
            >
              My Canvases
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CommandMenuTrigger />
          <NavAuthSection user={user} />
        </div>
      </div>
    </nav>
  );
}
