import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { seoPrerender } from "./seo-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: cached across deploys and kept off the entry path.
        manualChunks(id) {
          // Vite helper modules are imported by the entry; never let them join a lazy chunk.
          if (id.includes("vite/preload-helper") || id.includes("commonjsHelpers")) return "react";
          if (!id.includes("node_modules")) return;
          if (/[\\/](three|@react-three)[\\/]/.test(id)) return "three";
          if (/[\\/]framer-motion|motion-dom|motion-utils[\\/]/.test(id)) return "motion";
          if (/[\\/](react-markdown|remark-|micromark|mdast-|unified|hast-|unist-|vfile)/.test(id)) return "markdown";
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return "react";
        },
      },
    },
  },
});
