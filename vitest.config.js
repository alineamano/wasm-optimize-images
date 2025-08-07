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
    },
  },
});
