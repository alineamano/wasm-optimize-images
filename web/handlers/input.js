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
function refreshFileInputState() {
  const hasFile = fileInput.files.length > 0;

  compressBtn.disabled = !hasFile;

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
  return fileInput.files.length > 0 ? fileInput.files[0] : null;
}

/**
 * Sets the given file as the selected file in the input element
 * and updates the UI accordingly.
 *
 * @param {File} file - The file to set as selected.
 */
function setSelectedFile(file) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  refreshFileInputState();
}

/**
 * Clears the currently selected file from the input and updates the UI.
 */
export function clearSelectedFile() {
  fileInput.value = "";
  refreshFileInputState();
}

/**
 * Applies visual styles to the drop area to indicate drag-over state.
 */
function applyDragVisual() {
  inputDropArea.style.borderColor = "#3a86ff";
  inputDropArea.style.background = "#f3f4f6";
}

/**
 * Removes visual drag-over styles from the drop area.
 */
function removeDragVisual() {
  inputDropArea.style.borderColor = "#d1d5dc";
  inputDropArea.style.background = "";
}

/**
 * Prevents default behavior and stops propagation for drag and drop events.
 *
 * @param {Event} event - The event to prevent.
 */
function preventDefaults(event) {
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
  inputDropArea.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) setSelectedFile(fileInput.files[0]);
  });

  removeFileBtn.addEventListener("click", function (event) {
    preventDefaults(event);
    clearSelectedFile();
  });

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
      setSelectedFile(files[0]);
      removeDragVisual();
    },
    true
  );
}
