let wasmInstance = null;

/**
 * Initializes the WASM module built with MODULARIZE=1 and EXPORT_NAME='createModule'.
 *
 * Loads the module dynamically and ensures core memory and methods are available.
 *
 * @returns {Promise<Object>} The initialized WebAssembly instance.
 * @throws {Error} If the module is missing essential memory/methods.
 */
export async function initWasm() {
  if (wasmInstance) return wasmInstance;

  const { default: createModule } = await import("../dist/compress.js");
  wasmInstance = await createModule();

  // Sanity check: Ensure essential memory API is available
  if (typeof wasmInstance._malloc !== "function" || !wasmInstance.HEAPU8) {
    throw new Error(
      "WASM module was not initialized correctly: missing _malloc or HEAPU8"
    );
  }

  return wasmInstance;
}

/**
 * Compresses raw image data to JPEG using the WASM module.
 *
 * @param {Uint8Array} rawImageData - The raw image data (RGB or RGBA).
 * @param {number} width - Image width in pixels.
 * @param {number} height - Image height in pixels.
 * @param {number} channels - Number of color channels (3 for RGB, 4 for RGBA).
 * @param {number} quality - JPEG compression quality (1 to 100).
 * @returns {Promise<Uint8Array>} The compressed JPEG data.
 * @throws {Error} If memory allocation or compression fails.
 */
export async function compressImage(
  rawImageData,
  width,
  height,
  channels,
  quality
) {
  const wasm = await initWasm();

  console.log("wasm", wasm);

  const imageDataLength = rawImageData.length;
  const imageDataPointer = wasm._malloc(imageDataLength);

  if (imageDataPointer === 0) {
    throw new Error("Failed to allocate memory for the image data.");
  }

  // Copy image data into WASM memory
  wasm.HEAPU8.set(rawImageData, imageDataPointer);

  // Allocate space for the output size (int32) - 1 int
  const outputSizePointer = wasm._malloc(4);

  // Call exported C++ function: returns pointer to compressed image buffer
  const compressedImagePointer = wasm._compressImageToJpg(
    imageDataPointer,
    width,
    height,
    channels,
    quality,
    outputSizePointer
  );

  // Read the size of the compressed image from WASM memory
  const compressedImageSize = wasm.HEAP32[outputSizePointer >> 2];

  if (compressedImagePointer === 0 || compressedImageSize === 0) {
    wasm._free(imageDataPointer);
    wasm._free(outputSizePointer);
    throw new Error("Falha na compressão da imagem");
  }

  // Copy compressed data from WASM memory
  const compressedData = new Uint8Array(
    wasm.HEAPU8.buffer,
    compressedImagePointer,
    compressedImageSize
  );
  const compressedDataCopy = new Uint8Array(compressedData);

  // Free allocated memory
  wasm._free(imageDataPointer);
  wasm._free(outputSizePointer);
  wasm._freeCompressedImage(compressedImagePointer);

  return compressedDataCopy;
}
