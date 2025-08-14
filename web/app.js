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

const GA4_ID = "G-PK0MQW8S1D";

const compressBtn = $(IDs.compressBtn);
const languageSelector = $(IDs.languageSelector);

/**
 * Dynamically loads the GA4 analytics script in production environment.
 *
 * - Checks if the environment is production.
 * - Creates a deferred <script> element with Google Analytics URL and website ID.
 * - Appends the script to the document head to enable analytics tracking.
 */
function loadGA4() {
  if (import.meta.env.PROD) {
    const GAScript = document.createElement("script");
    GAScript.async = true;
    GAScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(GAScript);
  }

  const inlineGAScript = document.createElement("script");
  inlineGAScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${GA4_ID}');
  `;

  document.head.appendChild(inlineGAScript);
}

/**
 * Main application entry point.
 * Initializes event handlers and sets up the image compression workflow.
 */
async function main() {
  loadGA4();

  await loadLanguage("pt");
  setupLanguageSelector();

  setupImageInputHandlers();
  setupQualitySlider();
  setupCloseModalHandler();
  setupDownloadHandler();

  if (!import.meta.env.PROD) {
    const module = await import("./benchmark/runner.js");
    window.runBenchmarkAndLog = module.runBenchmarkAndLog;
  }

  compressBtn.addEventListener("click", async () => {
    languageSelector.classList.add("hidden");

    const file = getSelectedFile();
    const selectedQuality = getSelectedQuality();

    if (import.meta.env.PROD && window.gtag) {
      gtag("event", "compress_btn_clicked", {
        file_name: file?.name,
        file_size: file?.size,
        selected_quality: selectedQuality,
      });
    }

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

      if (!import.meta.env.PROD) {
        window.rawImagePixelsData = rawImagePixelsData;
        window.imageWidth = imageWidth;
        window.imageHeight = imageHeight;
        window.channels = channels;
        window.selectedQuality = selectedQuality;
        window.originalFileSize = file.size;
      }

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
