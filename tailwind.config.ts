import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";

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
        "primary": "#1B3F2B",
        "primary-container": "#1b3f2b",
        "on-primary": "#ffffff",
        "on-primary-container": "#84ab90",
        "primary-fixed": "#c3eccf",
        "on-primary-fixed": "#002111",
        "on-primary-fixed-variant": "#2a4e39",
        "secondary": "#5b6300",
        "secondary-container": "#dfec60",
        "secondary-fixed": "#dfec60",
        "on-secondary-container": "#616a00",
        "on-secondary-fixed": "#1a1d00",
        "on-secondary-fixed-variant": "#444b00",
        "tertiary": "#212323",
        "tertiary-container": "#363838",
        "on-tertiary-container": "#a0a1a1",
        "surface": "#f8faf6",
        "surface-container": "#edeeeb",
        "surface-container-low": "#f2f4f1",
        "surface-container-highest": "#e1e3e0",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e7e9e5",
        "surface-variant": "#e1e3e0",
        "on-surface": "#191c1a",
        "on-surface-variant": "#414843",
        "on-background": "#191c1a",
        "outline": "#727972",
        "outline-variant": "#c1c8c1",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "inverse-surface": "#2e312f",
        "inverse-on-surface": "#f0f1ee",
        "inverse-primary": "#a8d0b4",
        "surface-tint": "#426650",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [containerQueries, forms],
};
export default config;
