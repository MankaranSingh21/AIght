import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  side?: "left" | "right";
};

// A small typographic aside that lives in the right gutter on wide screens
// and falls back to an inline amber callout on mobile. Positioning rules
// (float into the gutter; collision-free stacking) live in globals.css under
// `.margin-note`.
export default function MarginNote({ children, side = "right" }: Props) {
  return (
    <aside className="margin-note" data-side={side}>
      {children}
    </aside>
  );
}
