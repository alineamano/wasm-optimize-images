let wasmInstance = null;

/**
 * Inicializa o módulo WASM gerado com MODULARIZE=1 e EXPORT_NAME='createModule'
 */
export async function initWasm() {
  if (wasmInstance) return wasmInstance;

  const { default: createModule } = await import("../dist/compress.js");
  wasmInstance = await createModule();

  // Debug: confirmar que tem métodos essenciais
  if (typeof wasmInstance._malloc !== "function" || !wasmInstance.HEAPU8) {
    throw new Error(
      "Módulo WASM não inicializado corretamente: faltam _malloc ou HEAPU8"
    );
  }

  return wasmInstance;
}

/**
 * Comprime uma imagem raw para JPG usando o WASM
 * @param {Uint8Array} rawImageData - dados da imagem (RGBA ou RGB)
 * @param {number} width - largura da imagem
 * @param {number} height - altura da imagem
 * @param {number} channels - número de canais (3 ou 4)
 * @param {number} quality - qualidade JPEG (1-100)
 * @returns {Uint8Array} dados JPEG comprimidos
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
    throw new Error("Falha ao alocar memória para a imagem");
  }

  // Copia dados da imagem para memória do WASM
  wasm.HEAPU8.set(rawImageData, imageDataPointer);

  const outputSizePointer = wasm._malloc(4); // Aloca espaço para 1 int

  // Chama função C++ exportada: retorna ponteiro pro buffer comprimido
  const compressedImagePointer = wasm._compressImageToJpg(
    imageDataPointer,
    width,
    height,
    channels,
    quality,
    outputSizePointer
  );

  // Lê o tamanho do buffer comprimido da memória WASM
  const compressedImageSize = wasm.HEAP32[outputSizePointer >> 2];

  if (compressedImagePointer === 0 || compressedImageSize === 0) {
    wasm._free(imageDataPointer);
    wasm._free(outputSizePointer);
    throw new Error("Falha na compressão da imagem");
  }

  const compressedData = new Uint8Array(
    wasm.HEAPU8.buffer,
    compressedImagePointer,
    compressedImageSize
  );
  const compressedDataCopy = new Uint8Array(compressedData);

  wasm._free(imageDataPointer);
  wasm._free(outputSizePointer);
  wasm._freeCompressedImage(compressedImagePointer);

  return compressedDataCopy;
}
