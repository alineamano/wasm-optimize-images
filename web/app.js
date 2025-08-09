import { IDs } from "./constants/ids.js";
import { $ } from "./utils/dom.js";

import { compressImage } from "./compressImage.js";
import { setupDownloadHandler } from "./handlers/download.js";
import { getSelectedFile, setupImageInputHandlers } from "./handlers/input.js";
import {
  setupCloseModalHandler,
  showCompressedImage,
} from "./handlers/modal.js";
import { getSelectedQuality, setupQualitySlider } from "./handlers/slider.js";
import { showNotification } from "./utils/showNotification.js";
import { loadLanguage, setupLanguageSelector, t } from "./utils/translate.js";

const compressBtn = $(IDs.compressBtn);
const languageSelector = $(IDs.languageSelector);

function loadUmami() {
  if (import.meta.env.PROD) {
    const umamiScript = document.createElement("script");
    umamiScript.defer = true;
    umamiScript.src = import.meta.env.VITE_UMAMI_URL;
    umamiScript.setAttribute("data-website-id", import.meta.env.VITE_UMAMI_ID);
    document.head.appendChild(umamiScript);
  }
}

/**
 * Main application entry point.
 * Initializes event handlers and sets up the image compression workflow.
 */
async function main() {
  loadUmami();

  await loadLanguage("pt");
  setupLanguageSelector();

  setupImageInputHandlers();
  setupQualitySlider();
  setupCloseModalHandler();
  setupDownloadHandler();

  compressBtn.addEventListener("click", async () => {
    languageSelector.classList.add("hidden");

    const file = getSelectedFile();
    const selectedQuality = getSelectedQuality();

    window.umami?.track("compress_btn_clicked", {
      file,
      select_quality: selectedQuality,
    });

    if (!file) {
      showNotification(t("error.no_file"));
      return;
    }

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
      showNotification(t("error.compression_failed"), "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
