import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite + React + Tailwind CSS v4. MSW (see src/mocks) answers every /api request in development.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
});
