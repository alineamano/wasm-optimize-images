import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  publicDir: "../dist",
  server: {
    port: 3000,
  },
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
});
