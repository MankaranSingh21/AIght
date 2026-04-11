"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type ToolResult = {
  slug: string;
  name: string;
  emoji: string;
  category: string | null;
  tags: string[];
};

const QUICK_LINKS = [
  { label: "All Tools",     href: "/tools",   emoji: "✦" },
  { label: "My Canvases",   href: "/roadmaps", emoji: "🗺️" },
];

export default function CommandMenu() {
  const [open, setOpen]   = useState(false);
  const [tools, setTools] = useState<ToolResult[]>([]);
  const router = useRouter();

  // Fetch tools once on mount
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("tools")
      .select("slug, name, emoji, category, tags")
      .order("name")
      .then(({ data }) => setTools(data ?? []));
  }, []);

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Custom event from Navbar trigger button
  useEffect(() => {
    function onOpen() { setOpen(true); }
    document.addEventListener("open-command-menu", onOpen);
    return () => document.removeEventListener("open-command-menu", onOpen);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-espresso/25 backdrop-blur-sm" />

      {/* Palette card */}
      <Command
        className="relative z-10 w-full max-w-xl bg-parchment rounded-3xl border border-moss-300 shadow-card-hover overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-moss-100">
          <Search className="w-4 h-4 text-moss-500 flex-shrink-0" />
          <Command.Input
            autoFocus
            placeholder="Search tools by name, category, or tag…"
            className="
              flex-1 bg-transparent font-body text-sm text-espresso
              placeholder:text-forest/40 outline-none
            "
          />
          <kbd className="
            font-body text-2xs text-forest/40 border border-moss-200
            rounded-md px-1.5 py-0.5 leading-none
          ">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto py-2 scrollbar-hide">
          <Command.Empty className="py-10 text-center font-body text-sm text-forest/50">
            No tools found. ✦
          </Command.Empty>

          {/* Quick links — always visible, hidden when user types */}
          <Command.Group
            heading="Quick Links"
            className="[&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-forest/40 [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
          >
            {QUICK_LINKS.map((link) => (
              <Command.Item
                key={link.href}
                value={link.label}
                onSelect={() => navigate(link.href)}
                className="
                  flex items-center gap-3 px-5 py-3 cursor-pointer
                  data-[selected=true]:bg-moss-50
                  transition-colors duration-100
                "
              >
                <span className="w-8 h-8 rounded-xl bg-moss-100 flex items-center justify-center text-base flex-shrink-0">
                  {link.emoji}
                </span>
                <span className="font-body text-sm text-espresso flex-1">
                  {link.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-forest/30" />
              </Command.Item>
            ))}
          </Command.Group>

          {/* Tools */}
          <Command.Group
            heading="Tools"
            className="[&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-forest/40 [&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:py-2"
          >
            {tools.map((tool) => (
              <Command.Item
                key={tool.slug}
                value={`${tool.name} ${tool.category ?? ""} ${tool.tags.join(" ")}`}
                onSelect={() => navigate(`/tool/${tool.slug}`)}
                className="
                  flex items-center gap-3 px-5 py-3 cursor-pointer
                  data-[selected=true]:bg-moss-50
                  transition-colors duration-100
                "
              >
                <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-base flex-shrink-0">
                  {tool.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-espresso truncate">
                    {tool.name}
                  </p>
                  {tool.category && (
                    <p className="font-body text-2xs text-forest/50 uppercase tracking-wider">
                      {tool.category}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-forest/30 flex-shrink-0" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer hint */}
        <div className="border-t border-moss-100 px-5 py-2.5 flex items-center gap-4">
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">↑↓</kbd>
            navigate
          </span>
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">↵</kbd>
            open
          </span>
          <span className="font-body text-2xs text-forest/40 flex items-center gap-1.5">
            <kbd className="border border-moss-200 rounded px-1 py-0.5 text-2xs">esc</kbd>
            close
          </span>
        </div>
      </Command>
    </div>
  );
}
