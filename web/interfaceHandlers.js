export function setupImageInputHandlers() {
  const inputDropArea = document.getElementById("input-drop-area");
  const fileInput = document.getElementById("file-input");
  const fileName = document.getElementById("file-name");
  const removeFileBtn = document.getElementById("remove-file-name");

  inputDropArea.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
      removeFileBtn.classList.remove("hidden");
    }
  });

  removeFileBtn.addEventListener("click", function (event) {
    event.preventDefault();
    fileInput.value = "";
    fileName.textContent = "Nenhum arquivo selecionado";
    removeFileBtn.classList.add("hidden");
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
