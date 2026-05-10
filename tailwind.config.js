/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        cute: ["'Nunito'", "sans-serif"],
      },
      colors: {
        diamond: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        blush: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
        },
        cream: "#fffbf5",
        gold: "#f59e0b",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(125, 211, 252, 0.4)" },
          "100%": { boxShadow: "0 0 60px rgba(125, 211, 252, 0.9), 0 0 100px rgba(56, 189, 248, 0.4)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
