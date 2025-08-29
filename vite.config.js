// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default {
//   server: {
//     proxy: {
//       "/api": "http://localhost:4000", 
//     },
//   },
// };


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: './postcss.config.js',
//   },
//   server: {
//     proxy: {
//       "/api": "http://localhost:4000",
//     },
//   },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(), // 👈 loads Tailwind automatically
    react(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
