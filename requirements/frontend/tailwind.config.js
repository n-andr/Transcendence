/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Comfortaa', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#5B6CFF",
        primaryForeground: "#FFFFFF",

        background: "#0F172A",
        surface: "#111827",

        textPrimary: "#E5E7EB",
        textMuted: "#9CA3AF",

        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
