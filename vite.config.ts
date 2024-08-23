import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(resolve(__dirname, "./manifest.json")),
          dest: "",
          transform: (c) => {
            const a = JSON.parse(c);
            delete a.$schema;
            return JSON.stringify(a, undefined, "    ");
          },
        },
      ],
    }),
  ],
  base: "",
  build: {
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, "src/devtools/index.html"),
        panel: resolve(__dirname, "src/panel/index.html"),
        popup: resolve(__dirname, "src/popup/index.html"),
      },
    },
  },
});
