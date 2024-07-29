import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
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
