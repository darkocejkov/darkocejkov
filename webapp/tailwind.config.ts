import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    colors: {
      dark: "#011627",
      cyan: "#41EAD4",
      red: "#F71735",
      white: "#FDFFFC",
      orange: "#FF9F1C",
    },
  },
  plugins: [],
} satisfies Config;
