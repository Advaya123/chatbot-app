//tailwind.config.js
export default {
  darkMode: "class",   // enables dark mode with .dark class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botBlue: "#2563eb",
        botGray: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
