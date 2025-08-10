import { compressImage as compressImageWasm } from "../compressImage";
import { compressImagePureJs } from "./compressImagePureJs";

/**
 * Runs a benchmark comparing WASM and pure JavaScript image compression.
 * Executes multiple runs, alternating execution order to reduce warm-up bias,
 * and returns detailed statistics (average, median, std. dev, and all samples).
 *
 * @param {Uint8Array} imageData - Raw pixel data of the image (RGBA or RGB).
 * @param {number} width - Image width in pixels.
 * @param {number} height - Image height in pixels.
 * @param {number} channels - Number of color channels (3 = RGB, 4 = RGBA).
 * @param {number} quality - JPEG quality from 0 to 100.
 * @param {number} [runs=5] - Number of runs to average results.
 * @returns {Promise<{ wasm: { time: Stats, size: Stats }, js: { time: Stats, size: Stats } }>}
 *
 * @typedef {Object} Stats
 * @property {number} avg - Average value.
 * @property {number} median - Median value.
 * @property {number} std - Standard deviation.
 * @property {number[]} samples - All sample values.
 */
export async function runBenchmark(
  imageData,
  imageWidth,
  imageHeight,
  channels,
  selectedQuality,
  runs = 5
) {
  const wasmTimes = [];
  const wasmSizes = [];
  const jsTimes = [];
  const jsSizes = [];

  // Warm-up run
  // This primes WASM compilation, JIT optimization, and caching effects
  await compressImageWasm(
    imageData,
    imageWidth,
    imageHeight,
    channels,
    selectedQuality
  );
  await compressImagePureJs(
    imageData,
    imageWidth,
    imageHeight,
    selectedQuality
  );

  // Multiple runs with alternating order
  // Executes multiple benchmark runs, alternating execution order
  // between WASM and JS to reduce bias from warm-up and caching.
  for (let i = 0; i < runs; i++) {
    const order = i % 2 === 0 ? "wasm-first" : "js-first";

    if (order === "wasm-first") {
      // WASM compression
      const t0 = performance.now();
      const wasmBlob = await compressImageWasm(
        imageData,
        imageWidth,
        imageHeight,
        channels,
        selectedQuality
      );
      const t1 = performance.now();

      wasmTimes.push(t1 - t0);
      wasmSizes.push(wasmBlob.length);

      // JS compression
      const t2 = performance.now();
      const jsBlob = await compressImagePureJs(
        imageData,
        imageWidth,
        imageHeight,
        selectedQuality
      );
      const t3 = performance.now();

      jsTimes.push(t3 - t2);
      jsSizes.push(jsBlob.size);
    } else {
      // JS compression
      const t0 = performance.now();
      const jsBlob = await compressImagePureJs(
        imageData,
        imageWidth,
        imageHeight,
        selectedQuality
      );
      const t1 = performance.now();

      jsTimes.push(t1 - t0);
      jsSizes.push(jsBlob.size);

      // WASM compression
      const t2 = performance.now();
      const wasmBlob = await compressImageWasm(
        imageData,
        imageWidth,
        imageHeight,
        channels,
        selectedQuality
      );
      const t3 = performance.now();

      wasmTimes.push(t3 - t2);
      wasmSizes.push(wasmBlob.length);
    }
  }

  /**
   * Calculate statistics for an array of numeric samples.
   * @param {number[]} samples - The measured values.
   * @returns {Stats}
   */
  const calcStats = (samples) => {
    const average =
      samples.reduce((sum, value) => sum + value, 0) / samples.length;

    const sorted = [...samples].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 1
        ? sorted[(sorted.length - 1) / 2]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

    const stdDev = Math.sqrt(
      samples.reduce((acc, value) => acc + (value - average) ** 2, 0) /
        samples.length
    );

    return { avg: average, median, std: stdDev, samples };
  };

  return {
    wasm: { time: calcStats(wasmTimes), size: calcStats(wasmSizes) },
    js: { time: calcStats(jsTimes), size: calcStats(jsSizes) },
  };
}
