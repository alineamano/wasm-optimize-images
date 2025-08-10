import { test, expect } from "@playwright/test";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runCompressionBenchmark(page, imageName, saveFileName) {
  await page.goto("index.html");
  await page.waitForFunction(() => !!window.runBenchmarkAndLog);

  const testImagePath = path.resolve(__dirname, `../../assets/${imageName}`);
  await page.waitForSelector('input[type="file"]', { state: "attached" });
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(testImagePath);

  const compressBtn = page.locator('[data-testid="compress-btn"]');
  await page.waitForTimeout(1000);
  await compressBtn.click();

  await page.waitForFunction(
    () =>
      window.rawImagePixelsData !== undefined &&
      typeof window.imageWidth === "number" &&
      window.imageWidth > 0 &&
      typeof window.imageHeight === "number" &&
      window.imageHeight > 0,
    { timeout: 5000 }
  );

  const markdownContent = await page.evaluate(async () => {
    if (!window.rawImagePixelsData) {
      throw new Error("rawImagePixelsData is not defined");
    }

    return await window.runBenchmarkAndLog(
      window.rawImagePixelsData,
      window.imageWidth,
      window.imageHeight,
      window.channels,
      75,
      5
    );
  });

  await page.waitForTimeout(1000);

  const outputPath = path.resolve(
    __dirname,
    `../../web/benchmark/results/${saveFileName}`
  );
  fs.writeFileSync(outputPath, markdownContent);

  console.log(`✅ Benchmark saved to: ${outputPath}`);

  expect(markdownContent).toContain("# Benchmark Results");
}

test.describe("Benchmark test: WASM vs JS compression and save results", () => {
  test("should run for cataratas", async ({ page }) => {
    await runCompressionBenchmark(
      page,
      "cataratas.png",
      "benchmark-results-cataratas.md"
    );
  });

  test("should run for cataratas compressed 85", async ({ page }) => {
    await runCompressionBenchmark(
      page,
      "cataratas_compressed_image_55.jpg",
      "benchmark-results-cataratas-55.md"
    );
  });

  test("should run for landscape", async ({ page }) => {
    await runCompressionBenchmark(
      page,
      "landscape-unsplash.jpg",
      "benchmark-results-landscape-unsplash.md"
    );
  });

  test("should run for warrior", async ({ page }) => {
    await runCompressionBenchmark(
      page,
      "warrior.png",
      "benchmark-results-warrior.md"
    );
  });

  test("should run for warrior compressed 85", async ({ page }) => {
    await runCompressionBenchmark(
      page,
      "warrior_compressed_image_85.jpg",
      "benchmark-results-warrior-85.md"
    );
  });
});
