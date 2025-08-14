import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";
import { showNotification } from "../utils/showNotification.js";
import { t } from "../utils/translate.js";

import { getCurrentBlobUrl } from "./modal.js";

/**
 * Triggers the download of a file from the given blob URL.
 *
 * @param {string} blobUrl - The Blob URL to download.
 * @param {string} filename - The filename to use for the downloaded file.
 */
export function triggerDownload(blobUrl, filename) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Handles the download button click event.
 */
export function handleDownloadClick() {
  const blobUrl = getCurrentBlobUrl();

  if (!blobUrl) {
    if (import.meta.env.PROD && window.gtag) {
      gtag("event", "download_clicked_error", {
        error: t("error.no_image_to_download"),
      });
    }

    showNotification(t("error.no_image_to_download"), "error");
    return;
  }

  if (import.meta.env.PROD && window.gtag) {
    gtag("event", "download_clicked", {
      blob_url: blobUrl,
    });
  }

  triggerDownload(blobUrl, "compressed_image.jpg");
}

/**
 * Sets up the event handler for downloading the compressed image.
 */
export function setupDownloadHandler() {
  const downloadBtn = $(IDs.downloadBtn);

  downloadBtn.addEventListener("click", handleDownloadClick);
}
