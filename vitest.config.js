import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    testMatch: ["**/*.test.js"],
    include: ["tests/*.test.js"],
    exclude: ["dist", "node_modules", "tests/e2e"],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "node_modules/**",
        "build/**",
        "dist/**",
        "coverage/**",
        "playwright.config.js",
        "vite.config.js",
        "vitest.config.js",
        "scripts/**",
        "web/benchmark",
        "tests/e2e",
      ],
    },
  },
});
