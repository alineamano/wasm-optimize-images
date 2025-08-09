import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";

const inputDropArea = $(IDs.inputDropArea);
const fileInput = $(IDs.fileInput);
const fileName = $(IDs.fileName);
const removeFileBtn = $(IDs.removeFileBtn);
const compressBtn = $(IDs.compressBtn);

/**
 * Updates the UI based on the current state of the file input.
 * Enables or disables the compress button, updates the filename display,
 * and toggles the visibility of the remove file button.
 */
export function refreshFileInputState() {
  const hasFile = fileInput.files.length > 0;

  compressBtn.disabled = !hasFile;
  compressBtn.setAttribute(
    "aria-disabled",
    compressBtn.disabled ? "true" : "false"
  );

  if (!hasFile) {
    compressBtn.setAttribute("title", "Adicioneuma imagem para comprimir");
  } else {
    compressBtn.removeAttribute("title");
  }

  fileName.textContent = hasFile
    ? fileInput.files[0].name
    : "Nenhum arquivo selecionado";

  removeFileBtn.classList.toggle("hidden", !hasFile);
}

/**
 * Returns the currently selected file in the input.
 *
 * @returns {File|null} The selected file, or null if none is selected.
 */
export function getSelectedFile() {
  const fileInput = $(IDs.fileInput);

  return fileInput.files.length > 0 ? fileInput.files[0] : null;
}

/**
 * Sets the given file as the selected file in the input element
 * and updates the UI accordingly.
 *
 * @param {File} file - The file to set as selected.
 */
export function setSelectedFile(file) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  refreshFileInputState();
}

/**
 * Clears the currently selected file from the input and updates the UI.
 */
export function clearSelectedFile() {
  const fileInput = $(IDs.fileInput);

  fileInput.value = "";
  refreshFileInputState();
}

/**
 * Handle both click and keyboard activation (Enter or Space) for removing file.
 * @param {MouseEvent | KeyboardEvent} event
 */
export function handleRemoveFile(event) {
  if (event.type === "keydown" && !(event.key === "Enter" || event.key === " "))
    return;

  preventDefaults(event);
  clearSelectedFile();

  window.umami?.track("file_removed");

  inputDropArea.focus();
}

/**
 * Applies visual styles to the drop area to indicate drag-over state.
 */
export function applyDragVisual() {
  const inputDropArea = $(IDs.inputDropArea);

  inputDropArea.style.borderColor = "#3a86ff";
  inputDropArea.style.background = "#f3f4f6";
}

/**
 * Removes visual drag-over styles from the drop area.
 */
export function removeDragVisual() {
  const inputDropArea = $(IDs.inputDropArea);

  inputDropArea.style.borderColor = "#d1d5dc";
  inputDropArea.style.background = "";
}

/**
 * Prevents default behavior and stops propagation for drag and drop events.
 *
 * @param {Event} event - The event to prevent.
 */
export function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Sets up event listeners for the image input element, including:
 * - Click-to-select
 * - File selection via input
 * - File removal
 * - Drag-and-drop handling
 */
export function setupImageInputHandlers() {
  const inputDropArea = $(IDs.inputDropArea);
  const fileInput = $(IDs.fileInput);
  const removeFileBtn = $(IDs.removeFileBtn);

  inputDropArea.addEventListener("click", () => {
    window.umami?.track("input_droparea_clicked");
    fileInput.click();
  });

  inputDropArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification(t("error.unsupported_file"), "error");
      return;
    }

    window.umami?.track("file_selected");

    setSelectedFile(file);
  });

  removeFileBtn.addEventListener("click", handleRemoveFile);
  removeFileBtn.addEventListener("keydown", handleRemoveFile);

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    inputDropArea.addEventListener(eventName, preventDefaults);
  });

  inputDropArea.addEventListener("dragover", (event) => {
    event.dataTransfer.dropEffect = "copy";
    applyDragVisual();
  });

  inputDropArea.addEventListener("dragleave", () => {
    removeDragVisual();
  });

  inputDropArea.addEventListener(
    "drop",
    (event) => {
      const files = event.dataTransfer.files;

      if (!files || !files[0]) {
        showNotification(t("error.invalid_file"), "error");
        return;
      }

      setSelectedFile(files[0]);

      removeDragVisual();

      window.umami?.track("input_droparea_dropped");
    },
    true
  );
}
