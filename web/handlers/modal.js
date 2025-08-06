import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";
import { clearSelectedFile } from "./input.js";

const compressedImagePreview = $(IDs.compressedImagePreview);
const compressedSizeHtml = $(IDs.compressedSize);
const downloadBtn = $(IDs.downloadBtn);
const languageSelector = $(IDs.languageSelector);
const modalOverlay = $(IDs.modalOverlay);
const originalSizeHtml = $(IDs.originalSize);
const sizeObservation = $(IDs.sizeObservation);

let currentBlobUrl = null;

/**
 * Releases the current blob URL to free memory.
 */
export function revokeCurrentBlobUrl() {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
}

/**
 * Hides the modal and clears the compressed image preview.
 */
export function closeModal() {
  revokeCurrentBlobUrl();

  clearSelectedFile();

  modalOverlay.classList.add("hidden");
  sizeObservation.classList.add("hidden");
  languageSelector.classList.remove("hidden");
  compressedImagePreview.src = "";

  originalSizeHtml.textContent = "";
  compressedSizeHtml.textContent = "";

  downloadBtn.disabled = true;
  downloadBtn.setAttribute("aria-disabled", "true");
}

/**
 * Sets up the modal close button to hide the modal and reset image preview and size info.
 */
export function setupCloseModalHandler() {
  const modalCloseBtn = $(IDs.modalCloseBtn);

  modalCloseBtn.addEventListener("click", closeModal);
}

/**
 * Formats a byte size to KB/MB with 2 decimals
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Displays the compressed image and file size info in the modal.
 *
 * @param {string} blobUrl - The Blob URL of the compressed image.
 * @param {number} originalSize - Original file size in bytes.
 * @param {number} compressedSize - Compressed file size in bytes.
 */
export function showCompressedImage(blobUrl, originalSize, compressedSize) {
  revokeCurrentBlobUrl();
  currentBlobUrl = blobUrl;

  compressedImagePreview.src = blobUrl;
  modalOverlay.classList.remove("hidden");
  downloadBtn.disabled = false;
  downloadBtn.setAttribute("aria-disabled", "false");

  originalSizeHtml.textContent = formatBytes(originalSize);
  compressedSizeHtml.textContent = formatBytes(compressedSize);

  if (originalSize < compressedSize) {
    sizeObservation.classList.remove("hidden");
  }
}

/**
 * Returns the current Blob URL of the compressed image.
 *
 * @returns {string|null} The Blob URL or null if not set.
 */
export function getCurrentBlobUrl() {
  return currentBlobUrl;
}
