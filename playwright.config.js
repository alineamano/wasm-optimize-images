import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "*.spec.js",
  timeout: 30 * 1000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000/",
    headless: true,
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
