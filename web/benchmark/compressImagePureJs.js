/**
 * Compress image using pure JavaScript and Canvas API.
 * @param {Uint8Array} imageData
 * @param {number} width
 * @param {number} height
 * @param {number} quality 0-100
 * @returns {Promise<Blob>}
 */
export async function compressImagePureJs(
  imageData,
  imageWidth,
  imageHeight,
  selectedQuality
) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    const ctx = canvas.getContext("2d");
    const imgData = new ImageData(
      new Uint8ClampedArray(imageData),
      imageWidth,
      imageHeight
    );

    ctx.putImageData(imgData, 0, 0);

    canvas.toBlob((blob) => resolve(blob), "image/jpeg", selectedQuality / 100);
  });
}
