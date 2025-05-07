import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // Entry point
      },
    },
  },
  publicDir: "public", // Place static files (e.g., favicon.png) here
});
