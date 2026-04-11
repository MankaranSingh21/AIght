"use client";

import { Search } from "lucide-react";

export default function CommandMenuTrigger() {
  return (
    <button
      onClick={() =>
        document.dispatchEvent(new CustomEvent("open-command-menu"))
      }
      className="
        hidden sm:flex items-center gap-2.5
        px-3 py-1.5 rounded-xl
        border border-moss-200 hover:border-moss-400
        bg-parchment hover:bg-moss-50
        transition-colors duration-150
        font-body text-sm text-forest/60 hover:text-forest
      "
      aria-label="Open command menu"
    >
      <Search className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="hidden md:block">Search…</span>
      <kbd className="
        hidden md:inline font-body text-2xs text-forest/40
        border border-moss-200 rounded px-1.5 py-0.5 leading-none
      ">
        ⌘K
      </kbd>
    </button>
  );
}
