import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#FAFAF8",
          dark: "#F4F4F0",
        },
        copper: {
          DEFAULT: "#B8703F",
          hover: "#A15F32",
          light: "#EAD6C9",
          dark: "#7B4622",
        },
        sage: {
          DEFAULT: "#7A8B6F",
          hover: "#67775D",
          light: "#E3E8DF",
          dark: "#4A5643",
        },
        amber: {
          DEFAULT: "#C9A45C",
          hover: "#B38F46",
          light: "#F7F1DF",
        },
        terracotta: {
          DEFAULT: "#B5544A",
          hover: "#9E453C",
          light: "#F6DFDC",
        },
        ink: {
          primary: "#2B2B2B",
          secondary: "#6B6B68",
          muted: "#9C9C98",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        "glass-hover": "0 14px 40px rgba(0, 0, 0, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        "glass-lg": "0 20px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
      },
      animation: {
        "scan-line": "scanline 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        scanline: {
          "0%, 100%": { transform: "translateY(0%)", opacity: "0.2" },
          "50%": { transform: "translateY(100%)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
