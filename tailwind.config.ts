import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base — earthy, never stark
        parchment: "#F5EFE0",     // off-white base
        espresso: "#2C1A0E",      // deep dark (replaces #000)
        forest: "#1C3A2E",        // deep forest green

        // Primary palette
        moss: {
          50:  "#F0F5EC",
          100: "#D9EAD0",
          200: "#B4D4A3",
          300: "#8ABF76",
          400: "#61A649",
          500: "#3D8A2B",   // main moss green
          600: "#2D6B1F",
          700: "#1F4F15",
          800: "#12340C",
          900: "#081A05",
        },
        amber: {
          50:  "#FFF8EC",
          100: "#FDECC8",
          200: "#FAD88F",
          300: "#F7C255",
          400: "#F4AB1F",   // warm amber accent
          500: "#D98D08",
          600: "#A96B04",
          700: "#7A4D02",
          800: "#4C3001",
          900: "#241600",
        },
        lavender: {
          50:  "#F5F0FA",
          100: "#E8DCF5",
          200: "#D1B9EB",
          300: "#BA96E1",
          400: "#A373D7",   // soft lavender
          500: "#8B50CD",
          600: "#6B38A3",
          700: "#4D2578",
          800: "#30154D",
          900: "#150822",
        },

        // Neon accents — used sparingly for key interactions
        neon: {
          lime:   "#AAFF4D",
          teal:   "#00FFD1",
          amber:  "#FFB300",
        },
      },
      fontFamily: {
        // Elegant serif for headers
        serif:  ["var(--font-playfair)", "Georgia", "serif"],
        // Warm readable body
        body:   ["var(--font-lora)", "Palatino", "serif"],
        // Playful display / accents
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",  { lineHeight: "1.125rem" }],
        sm:    ["0.875rem", { lineHeight: "1.375rem" }],
        base:  ["1rem",     { lineHeight: "1.625rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],
        "5xl": ["3rem",     { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem",  { lineHeight: "4.25rem" }],
        "7xl": ["4.5rem",   { lineHeight: "5rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "moss":    "0 4px 24px 0 rgba(61, 138, 43, 0.18)",
        "amber":   "0 4px 24px 0 rgba(244, 171, 31, 0.22)",
        "glow-neon": "0 0 20px 2px rgba(170, 255, 77, 0.35)",
        "card":    "0 2px 16px 0 rgba(44, 26, 14, 0.10)",
        "card-hover": "0 8px 32px 0 rgba(44, 26, 14, 0.18)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.012)" },
        },
        "float-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe:   "breathe 4s ease-in-out infinite",
        "float-up": "float-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
