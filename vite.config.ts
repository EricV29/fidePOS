import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "bundle-stats.html",
    }),
  ],
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
      "@forms": path.resolve(__dirname, "./src/components/forms"),
      "@context": path.resolve(__dirname, "./src/context"),
    },
  },
});
