let currentBlobUrl = null;

export function setupImageInputHandlers() {
  const inputDropArea = document.getElementById("input-drop-area");
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("file-name");
  const removeFileBtn = document.getElementById("remove-file-name");
  const compressBtn = document.getElementById("compress-image-btn");

  function updateCompressButtonState() {
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

  inputDropArea.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
      removeFileBtn.classList.remove("hidden");
    }
    updateCompressButtonState();
  });

  removeFileBtn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    fileInput.value = "";
    fileName.textContent = "Nenhum arquivo selecionado";
    removeFileBtn.classList.add("hidden");
    updateCompressButtonState();
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    inputDropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  inputDropArea.addEventListener("dragover", (event) => {
    inputDropArea.style.borderColor = "#3a86ff";
    inputDropArea.style.background = "#f3f4f6";
    event.dataTransfer.dropEffect = "copy";
  });

  inputDropArea.addEventListener("dragleave", () => {
    inputDropArea.style.borderColor = "#d1d5dc";
    inputDropArea.style.background = "";
  });

  inputDropArea.addEventListener(
    "drop",
    (event) => {
      const files = event.dataTransfer.files;

      if (files.length > 0) {
        fileName.textContent = files[0].name;
        removeFileBtn.classList.remove("hidden");

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInput.files = dataTransfer.files;

        updateCompressButtonState();
      }

      inputDropArea.style.borderColor = "#d1d5dc";
      inputDropArea.style.background = "";
    },
    true
  );
}

export function setupQualitySlider() {
  const slider = document.getElementById("quality-slider");
  const sliderValue = document.getElementById("quality-value");

  slider.addEventListener("input", (event) => {
    sliderValue.textContent = event.target.value;
  });
}

export function getSelectedFile() {
  const fileInput = document.getElementById("file-input");
  return fileInput.files.length > 0 ? fileInput.files[0] : null;
}

export function getSelectedQuality() {
  const slider = document.getElementById("quality-slider");
  return parseInt(slider.value, 10);
}

export function setupCloseModalHandler() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const compressedImagePreview = document.getElementById(
    "compressed-image-preview"
  );
  const downloadBtn = document.getElementById("download-image-btn");

  modalCloseBtn.addEventListener("click", () => {
    console.log("CLOSE BTN");
    modalOverlay.classList.add("hidden");

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }

    compressedImagePreview.src = "";
    downloadBtn.disabled = true;
  });
}

export function showCompressedImage(blobUrl) {
  const modalOverlay = document.getElementById("modal-overlay");
  const compressedImagePreview = document.getElementById(
    "compressed-image-preview"
  );
  const downloadBtn = document.getElementById("download-image-btn");

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }

  currentBlobUrl = blobUrl;
  compressedImagePreview.src = blobUrl;
  modalOverlay.classList.remove("hidden");
  downloadBtn.disabled = false;
}

export function setupDownloadHandler() {
  const downloadBtn = document.getElementById("download-image-btn");

  downloadBtn.addEventListener("click", () => {
    if (!currentBlobUrl) return;

    const imageDownloadLink = document.createElement("a");
    imageDownloadLink.href = currentBlobUrl;
    imageDownloadLink.download = "imagem_comprimida.jpg";
    document.body.appendChild(imageDownloadLink);
    imageDownloadLink.click();
    document.body.removeChild(imageDownloadLink);
  });
}
