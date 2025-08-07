import { test, expect } from "@playwright/test";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe("Image compression flow", () => {
  test("should update image, compress, ad show modal", async ({ page }) => {
    await page.goto("./index.html");

    const testImagePath = path.resolve(__dirname, "../../assets/cataratas.png");

    await page.waitForSelector('input[type="file"]', { state: "attached" });
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);

    const compressBtn = page.locator('[data-testid="compress-btn"]');

    await page.waitForTimeout(1000);

    await expect(compressBtn).toBeEnabled();

    await compressBtn.click();

    await page.waitForTimeout(1000);

    await expect(page.locator("#modal-overlay")).toBeVisible();

    const downloadBtn = page.locator('[data-testid="download-btn"]');
    await expect(downloadBtn).toBeEnabled();

    await page.click('[data-testid="modal-close-btn"]');
    await expect(page.locator("#modal-overlay")).toBeHidden();
  });
});
