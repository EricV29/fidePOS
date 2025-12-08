import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 6969,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@img": path.resolve(__dirname, "./src/assets/images"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utility": path.resolve(__dirname, "./src/utility"),
      "@typesm": path.resolve(__dirname, "./src/types"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@columns": path.resolve(__dirname, "./src/components/columns"),
      "@modals": path.resolve(__dirname, "./src/components/modals"),
    },
  },
});
