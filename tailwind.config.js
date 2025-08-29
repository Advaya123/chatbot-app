// // tailwind.config.cjs
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}", // scan all your React files
//   ],
//   theme: {
//     extend: {
//       colors: {
//         botBlue: "#2563eb",   // example custom color
//         botGray: "#f3f4f6",   // for background bubbles
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/typography")],
// };


// // tailwind.config.js
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
