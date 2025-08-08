import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  base: "./",
  publicDir: "../dist",
  server: {
    port: 3000,
  },
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "i18n/*",
          dest: "i18n",
        },
      ],
    }),
  ],
});
