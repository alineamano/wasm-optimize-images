import {
  setupImageInputHandlers,
  setupQualitySlider,
  setupCloseModalHandler,
  setupDownloadHandler,
  showCompressedImage,
  getSelectedFile,
  getSelectedQuality,
} from "./interfaceHandlers.js";

import { compressImage } from "./compressImage.js";

function main() {
  setupImageInputHandlers();
  setupQualitySlider();
  setupCloseModalHandler();
  setupDownloadHandler();

  const compressBtn = document.getElementById("compress-image-btn");

  compressBtn.addEventListener("click", async () => {
    const file = getSelectedFile();
    const selectedQuality = getSelectedQuality();

    if (!file) return;

    console.log("file", file);

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

      showCompressedImage(blobUrl);
    } catch (error) {
      console.error("Erro ao comprimir a imagem: ", error);
      alert("Erro ao comprimir a imagem: ", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", main);
