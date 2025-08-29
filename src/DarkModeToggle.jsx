// import { useState, useEffect } from "react";

// export default function DarkModeToggle() {
//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem("theme") === "dark"
//   );

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   return (
//     <button
//       onClick={() => setDarkMode(!darkMode)}
//       className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow"
//     >
//       {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//     </button>
//   );
// }
