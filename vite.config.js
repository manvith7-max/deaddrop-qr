// vite.config.js: tells Vite to understand React (JSX + fast refresh).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
