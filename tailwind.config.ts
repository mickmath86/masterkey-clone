import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'Inter'", "'Helvetica Neue'", "Arial", "sans-serif"],
      },
      colors: {
        mk: {
          green: "#00c758",
          blue: "#00a5ef",
          dark: "#030712",
          cream: "#FAF9F6",
          teal: "#1A4D4D",
          "teal-light": "#4DB6AC",
          mint: "#E8F5F3",
          lavender: "#EEEEF5",
        },
      },
      borderRadius: {
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
