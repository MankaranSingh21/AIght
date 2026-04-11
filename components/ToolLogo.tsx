"use client";

import Image from "next/image";
import { useState } from "react";
import { getToolLogoUrl } from "@/utils/toolLogo";

type Props = {
  url?: string | null;
  emoji: string;
  /** Pixel size for both width and height of the logo image. */
  size?: number;
  className?: string;
};

/**
 * Renders a Clearbit logo for the tool's URL.
 * Falls back to the emoji if the URL is missing or the logo fails to load.
 */
export default function ToolLogo({ url, emoji, size = 48, className = "" }: Props) {
  const logoUrl = getToolLogoUrl(url);
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <span
        role="img"
        aria-label={emoji}
        style={{ fontSize: size * 0.75, lineHeight: 1 }}
        className={className}
      >
        {emoji}
      </span>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt=""
      width={size}
      height={size}
      className={`object-contain rounded-lg ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
