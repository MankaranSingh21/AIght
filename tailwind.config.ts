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
        // Backgrounds
        page:   "var(--bg-base)",      // bg-page
        panel:  "var(--bg-surface)",   // bg-panel
        raised: "var(--bg-elevated)",  // bg-raised
        float:  "var(--bg-overlay)",   // bg-float

        // Accent greens
        accent: {
          DEFAULT: "var(--accent-primary)",
          dim:     "var(--accent-primary-dim)",
          glow:    "var(--accent-primary-glow)",
        },

        // Accent warm/amber
        warm: {
          DEFAULT: "var(--accent-warm)",
          dim:     "var(--accent-warm-dim)",
        },

        // Content / text
        primary:   "var(--text-primary)",   // text-primary, bg-primary
        secondary: "var(--text-secondary)", // text-secondary
        muted:     "var(--text-muted)",     // text-muted
        inverse:   "var(--text-inverse)",   // text-inverse

        // Border colors (use with border-{name} utilities)
        subtle:   "var(--border-subtle)",
        emphasis: "var(--border-emphasis)",

        // Status
        success: "var(--success)",
        warning: "var(--warning)",
        danger:  "var(--error)",
      },

      fontFamily: {
        // These override Tailwind's default sans/serif/mono
        sans:  ["Space Grotesk", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
        mono:  ["JetBrains Mono", "'Fira Code'", "monospace"],
      },

      fontSize: {
        // Override only the sizes that differ from Tailwind defaults
        // xs (0.75rem), sm (0.875rem), base (1rem), lg (1.125rem),
        // xl (1.25rem), 2xl (1.5rem) all match — no override needed
        "3xl": ["2rem",    { lineHeight: "2.5rem" }],    // design: 2rem (Tailwind default: 1.875rem)
        "4xl": ["2.75rem", { lineHeight: "3.25rem" }],   // design: 2.75rem (Tailwind default: 2.25rem)
        "5xl": ["3.75rem", { lineHeight: "4.25rem" }],   // design: 3.75rem (Tailwind default: 3rem)
      },

      borderRadius: {
        // Override to match design system spec
        sm:  "4px",    // --radius-sm
        md:  "8px",    // --radius-md
        lg:  "12px",   // --radius-lg
        xl:  "16px",   // --radius-xl
        // full: 9999px already matches Tailwind default
      },

      maxWidth: {
        content:   "1200px", // --max-width-content
        editorial: "740px",  // --max-width-editorial
        narrow:    "480px",  // --max-width-narrow
      },

      keyframes: {
        // Scroll reveal for Learn/Signal pages only
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
