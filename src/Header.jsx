// import React from "react";

// export default function Header({ darkMode, setDarkMode }) {
//   return (
//     <header className="flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
//       {/* Left: Logo + Title */}
//       <div className="flex items-center gap-3">
//         <img
//           src="/chatbot-icon.png"
//           alt="Bot"
//           className="w-10 h-10 rounded-full bg-white p-1 shadow"
//         />
//         <div>
//           <h1 className="text-xl font-bold">Developer Chatbot</h1>
//           <p className="text-sm text-indigo-200 dark:text-gray-400">
//             Ask anything about our JS API
//           </p>
//         </div>
//       </div>

//       {/* Right: Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className="px-4 py-2 rounded-lg font-medium bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow hover:scale-105 transition"
//       >
//         {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//       </button>
//     </header>
//   );
// }




import React from "react";

export default function Header({ darkMode, setDarkMode, onClearChat }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/chatbot-icon.png"
          alt="Bot"
          className="w-10 h-10 rounded-full bg-white p-1 shadow"
        />
        <div>
          <h1 className="text-xl font-bold">Developer Chatbot</h1>
          <p className="text-sm text-indigo-200 dark:text-gray-400">
            Ask anything about our JS API
          </p>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onClearChat}
          className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white shadow hover:scale-105 transition"
        >
          Clear Chat
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg font-medium bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow hover:scale-105 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </header>
  );
}
