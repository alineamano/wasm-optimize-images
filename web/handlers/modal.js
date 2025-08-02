import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";

const compressedImagePreview = $(IDs.compressedImagePreview);
const downloadBtn = $(IDs.downloadBtn);
const modalCloseBtn = $(IDs.modalCloseBtn);
const modalOverlay = $(IDs.modalOverlay);

let currentBlobUrl = null;

/**
 * Releases the current blob URL to free memory.
 */
function revokeCurrentBlobUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

/**
 * Hides the modal and clears the compressed image preview.
 */
function closeModal() {
  revokeCurrentBlobUrl();
  modalOverlay.classList.add("hidden");
  compressedImagePreview.src = "";
  downloadBtn.disabled = true;
}

/**
 * Sets up the event listener to close the modal when the close button is clicked.
 */
export function setupCloseModalHandler() {
  modalCloseBtn.addEventListener("click", closeModal);
}

/**
 * Displays the compressed image in the modal and enables the download button.
 *
 * @param {string} blobUrl - The Blob URL of the compressed image.
 */
export function showCompressedImage(blobUrl) {
  revokeCurrentBlobUrl();
  currentBlobUrl = blobUrl;

  compressedImagePreview.src = blobUrl;
  modalOverlay.classList.remove("hidden");
  downloadBtn.disabled = false;
}

/**
 * Returns the current Blob URL of the compressed image.
 *
 * @returns {string|null} The Blob URL or null if not set.
 */
export function getCurrentBlobUrl() {
  return currentBlobUrl;
}
