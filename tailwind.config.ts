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
        dark: "#0a0a0a",
        darker: "#060606",
        card: "#111111",
        border: "#1a1a1a",
        orange: {
          DEFAULT: "#FF6B00",
          light: "#FF8C38",
          dark: "#CC5500",
          glow: "rgba(255,107,0,0.4)",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,107,0,0.4), 0 0 40px rgba(255,107,0,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255,107,0,0.8), 0 0 80px rgba(255,107,0,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)",
        "orange-gradient": "linear-gradient(135deg, #FF6B00 0%, #FF8C38 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
