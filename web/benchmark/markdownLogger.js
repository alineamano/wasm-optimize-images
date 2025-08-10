function padRight(str, length) {
  return str.toString().padEnd(length, " ");
}

function padLeft(str, length) {
  return str.toString().padStart(length, " ");
}

/**
 * Generates a markdown table with benchmark results for WASM and JS compression.
 *
 * @function generateMarkdownReport
 * @param {Object} results - Benchmark results containing time and size metrics.
 * @param {Object} results.wasm - WASM compression benchmark results.
 * @param {Object} results.js - JS compression benchmark results.
 * @param {number} runs - Number of runs used to compute averages.
 * @returns {string} Markdown-formatted benchmark report.
 */
export function generateMarkdownReport(results, runs) {
  const wasmTimeAvg = padLeft(results.wasm.time.avg.toFixed(2), 8);
  const wasmTimeMedian = padLeft(results.wasm.time.median.toFixed(2), 10);
  const jsTimeAvg = padLeft(results.js.time.avg.toFixed(2), 8);
  const jsTimeMedian = padLeft(results.js.time.median.toFixed(2), 10);

  const wasmSizeAvg = padLeft((results.wasm.size.avg / 1024).toFixed(1), 7);
  const jsSizeAvg = padLeft((results.js.size.avg / 1024).toFixed(1), 7);

  return `
# Benchmark Results (${runs} runs)

| Metric     | WASM Avg | WASM Median | JS Avg | JS Median |
|:---------- |---------:|------------:|-------:|----------:|
| Time (ms)  |${wasmTimeAvg} |${wasmTimeMedian} |${jsTimeAvg} |${jsTimeMedian} |
| Size (KB)  |${wasmSizeAvg} | -          |${jsSizeAvg} | -          |

*Generated automatically by benchmark*
`.trim();
}
