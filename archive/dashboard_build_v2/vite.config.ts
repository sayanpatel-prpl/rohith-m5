import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@data": path.resolve(
        __dirname,
        "../consumer-durables-intelligence/data_sources/extracted",
      ),
      // echarts-for-react v3 has no package.json exports field, so Vite
      // cannot resolve subpath imports like /core and /lib/types.
      "echarts-for-react/core": path.resolve(
        __dirname,
        "node_modules/echarts-for-react/esm/core.js",
      ),
      "echarts-for-react/lib/types": path.resolve(
        __dirname,
        "node_modules/echarts-for-react/esm/types.js",
      ),
    },
  },
  build: {
    assetsInlineLimit: 100000000,
  },
});
