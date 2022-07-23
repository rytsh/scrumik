import * as path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    svelte({ preprocess: preprocess({ name: "scss" }) }),
    createHtmlPlugin({
      minify: process.env.NODE_ENV == "production",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV == "production" ? false : true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: true,
        ws: true,
        followRedirects: true,
      },
    },
    port: process.env.PORT ?? 3000,
  },
});
