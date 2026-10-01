import type { Config } from "tailwindcss";

/**
 * Botanical / Organic Serif design tokens.
 *
 * Philosophy: a warm, hand-touched, editorial surface. Alabaster paper,
 * forest-ink typography, sage/terracotta accents, generous radii, and
 * diffused (never harsh) shadows. A paper-grain overlay lives on the body.
 *
 * Token families:
 *  - `canvas` / `ink`      → warm alabaster paper + forest-ink text
 *  - `primary`             → forest-green scale (800 = #2D3A31, the CTA colour)
 *  - `sage` / `clay` / `stone` / `terracotta` / `ochre` → supporting palette
 *  - `shadow-soft*`        → diffused elevation (rgba of deep forest)
 *  - `rounded-card` / `-arch` / `-image` → 24px cards, arch + soft radii
 *  - `font-display`        → Playfair Display (serif), Bengali fallback
 *  - `font-sans`           → Source Sans 3 body, Bengali fallback
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm Alabaster / Rice Paper — never stark white.
        canvas: "#F9F8F4",
        // Deep Forest Green ink.
        ink: {
          DEFAULT: "#2D3A31", // ~11:1 on canvas (AAA)
          muted: "#6B7268", // ~4.8:1 on canvas (AA)
        },
        // Forest-green scale. The CTA / primary button uses 800 (#2D3A31).
        primary: {
          50: "#F3F6F3",
          100: "#E4EBE4",
          200: "#C9D6C8",
          300: "#A9BCA7",
          400: "#84997F",
          500: "#667B60",
          600: "#4E5F48",
          700: "#3D4B38",
          800: "#2D3A31", // Deep Forest Green
          900: "#232D26",
          950: "#161D18",
        },
        // Sage — accents, borders, secondary buttons. 700+ is text-safe.
        sage: {
          DEFAULT: "#8C9A84",
          300: "#B5C0AE",
          600: "#6E7C66",
          700: "#5F6B58", // ~5.4:1 on canvas (AA — for text/focus)
          800: "#4C5546",
        },
        // Soft Clay — card / input fills.
        clay: {
          DEFAULT: "#DCCFC2",
          light: "#F2F0EB",
        },
        // Stone — the one delicate 1px border colour.
        stone: "#E6E2DA",
        // Terracotta — warm "pop" accents and danger states.
        terracotta: {
          DEFAULT: "#C27B66",
          700: "#A85F4A", // ~4.6:1 on canvas (AA)
          800: "#8A4C3A",
        },
        // Ochre — muted warning tone.
        ochre: {
          DEFAULT: "#B08A5A",
          800: "#8A6B45",
        },
        accent: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        bangla: {
          green: "#006A4E",
          red: "#F42A41",
        },
      },
      fontFamily: {
        // Body: Source Sans 3 for Latin; Bengali falls back to Hind Siliguri.
        sans: ["var(--font-body)", "var(--font-bangla)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        bangla: ["var(--font-bangla)", "sans-serif"],
        // Display: Playfair Display for Latin; Bengali falls back to Hind Siliguri.
        display: ["var(--font-display)", "var(--font-bangla)", "serif"],
      },
      borderRadius: {
        card: "24px", // standard card
        image: "40px", // soft-cornered imagery
        arch: "200px 200px 0 0", // iconic Roman-arch imagery
      },
      boxShadow: {
        // Diffused, forest-tinted. Never harsh dark drops.
        soft: "0 4px 6px -1px rgba(45,58,49,0.05)",
        "soft-md": "0 10px 15px -3px rgba(45,58,49,0.05)",
        "soft-lg": "0 20px 40px -10px rgba(45,58,49,0.05)",
        "soft-xl": "0 25px 50px -12px rgba(45,58,49,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out both",
        "fade-up": "fadeUp 0.7s ease-out both",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        // Gentle, plant-like motion. Slow and suspended.
        sway: "sway 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
