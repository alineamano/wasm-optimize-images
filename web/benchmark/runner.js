import { runBenchmark } from "./benchmark.js";
import { generateMarkdownReport } from "./markdownLogger.js";

/**
 * Runs the benchmark for both WASM and pure JS image compression,
 * logs the results to the console, and generates a markdown report.
 *
 * @async
 * @function runBenchmarkAndLog
 * @param {Uint8Array} rawImagePixelsData - Raw pixel data of the image.
 * @param {number} width - Width of the image in pixels.
 * @param {number} height - Height of the image in pixels.
 * @param {number} channels - Number of color channels (e.g., 3 for RGB, 4 for RGBA).
 * @param {number} quality - Compression quality (0-100).
 * @param {number} [runs=5] - Number of benchmark runs to calculate averages.
 * @returns {Promise<void>}
 */
export async function runBenchmarkAndLog(
  rawImagePixelsData,
  width,
  height,
  channels,
  quality,
  runs = 5
) {
  const results = await runBenchmark(
    new Uint8Array(rawImagePixelsData.buffer),
    width,
    height,
    channels,
    quality,
    runs
  );

  console.table({
    wasm_time_avg: results.wasm.time.avg?.toFixed(2) + " ms",
    wasm_time_median: results.wasm.time.median?.toFixed(2) + " ms",
    wasm_size_avg: (results.wasm.size.avg / 1024)?.toFixed(1) + " KB",
    js_time_avg: results.js.time.avg?.toFixed(2) + " ms",
    js_time_median: results.js.time.median?.toFixed(2) + " ms",
    js_size_avg: (results.js.size.avg / 1024)?.toFixed(1) + " KB",
  });

  const markdown = generateMarkdownReport(results, runs);

  return markdown;
}
