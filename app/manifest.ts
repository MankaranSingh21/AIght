import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIght — the signal beneath the noise",
    short_name: "AIght",
    description: "A ruthlessly curated AI tool directory. No hype, just honest signal.",
    start_url: "/",
    display: "standalone",
    background_color: "#100E0B",
    theme_color: "#AAFF4D",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
