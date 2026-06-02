import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/renderer/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        darker: "#060606",
        card: "#111111",
        sidebar: "#0d0d0d",
        border: "#1a1a1a",
        orange: {
          DEFAULT: "#FF6B00",
          light: "#FF8C38",
          dark: "#CC5500",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255,107,0,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(255,107,0,0.7)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
