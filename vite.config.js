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
