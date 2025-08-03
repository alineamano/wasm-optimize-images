import { compressImage } from "./compressImage.js";
import { setupDownloadHandler } from "./handlers/download.js";
import { getSelectedFile, setupImageInputHandlers } from "./handlers/input.js";
import {
  setupCloseModalHandler,
  showCompressedImage,
} from "./handlers/modal.js";
import { getSelectedQuality, setupQualitySlider } from "./handlers/slider.js";
import { loadLanguage, setupLanguageSelector } from "./i18n/translate.js";

/**
 * Main application entry point.
 * Initializes event handlers and sets up the image compression workflow.
 */
async function main() {
  await loadLanguage("pt");
  setupLanguageSelector();

  setupImageInputHandlers();
  setupQualitySlider();
  setupCloseModalHandler();
  setupDownloadHandler();

  const compressBtn = document.getElementById("compress-image-btn");

  compressBtn.addEventListener("click", async () => {
    const file = getSelectedFile();
    const selectedQuality = getSelectedQuality();

    if (!file) return;

    try {
      const imageBitmap = await createImageBitmap(file);
      const { width: imageWidth, height: imageHeight } = imageBitmap;

      const canvas = document.createElement("canvas");
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);

      const imagePixelData = ctx.getImageData(0, 0, imageWidth, imageHeight);
      const rawImagePixelsData = imagePixelData.data;
      const channels = rawImagePixelsData.length / (imageWidth * imageHeight);

      const compressedJpegImg = await compressImage(
        new Uint8Array(rawImagePixelsData.buffer),
        imageWidth,
        imageHeight,
        channels,
        selectedQuality
      );

      const blob = new Blob([compressedJpegImg], { type: "image/jpeg" });
      const blobUrl = URL.createObjectURL(blob);

      showCompressedImage(blobUrl, file.size, blob.size);
    } catch (error) {
      console.error("Error compressing the image: ", error);
      alert("An error occurred while compressing the image: ", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
