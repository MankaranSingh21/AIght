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
        page:     "var(--bg-base)",
        panel:    "var(--bg-surface)",
        raised:   "var(--bg-elevated)",
        elevated: "var(--bg-elevated)",
        float:    "var(--bg-overlay)",

        // Accent — neon lime primary
        accent: {
          DEFAULT: "var(--accent-primary)",
          dim:     "var(--accent-primary-dim)",
          glow:    "var(--accent-primary-glow)",
        },
        // Teal secondary
        teal: {
          DEFAULT: "var(--accent-secondary)",
          glow:    "var(--accent-secondary-glow)",
        },
        // Warm amber
        warm: {
          DEFAULT: "var(--accent-warm)",
          dim:     "var(--accent-warm-dim)",
        },
        lavender: "var(--color-lavender)",

        // Text
        primary:   "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted:     "var(--text-muted)",
        inverse:   "var(--text-inverse)",

        // Borders
        subtle:   "var(--border-subtle)",
        emphasis: "var(--border-emphasis)",

        // Status
        success: "var(--success)",
        warning: "var(--warning)",
        danger:  "var(--error)",
      },

      fontFamily: {
        // CSS vars injected by next/font in layout.tsx
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-ui)", "system-ui", "sans-serif"],
        serif:   ["var(--font-editorial)", "Georgia", "serif"],
        mono:    ["var(--font-mono)", "'Fira Code'", "monospace"],
      },

      fontSize: {
        "3xl": ["2rem",    { lineHeight: "2.5rem" }],
        "4xl": ["2.75rem", { lineHeight: "3.25rem" }],
        "5xl": ["3.75rem", { lineHeight: "4.25rem" }],
      },

      borderRadius: {
        sm:    "8px",
        md:    "8px",
        lg:    "12px",
        xl:    "16px",
        "2xl": "24px",
      },

      maxWidth: {
        content:   "1280px",
        editorial: "740px",
        narrow:    "480px",
      },

      keyframes: {
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
