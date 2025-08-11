<h1 align="center">📦 Image Optimizer in the Browser (WASM + C++)</h1>

<p align="center">
  <a href="README.pt-br.md">🇧🇷 Português</a> | <a href="README.md">🇺🇸 English</a>
</p>

<p align="center">
  Personal project that enables image optimization directly in the browser using <strong>WebAssembly</strong> with <strong>C++</strong>, aiming for performance and privacy, without relying on external servers.
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/alineamano/wasm-optimize-images" alt="MIT License">
  <img src="https://img.shields.io/badge/WebAssembly-C++-purple" alt="WebAssembly C++">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-yellow" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/TailwindCSS-CSS-blue" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Coverage-64%25-yellow" alt="Coverage">
</p>



## 📷 Screenshots

<p align="center">
  <img src="./assets/app-screenshot.png" alt="App Screenshot" width="600">
  <br>
  <em>Simple interface for image upload and compression</em>
</p>


## 📖 About the Project

Personal project developed from scratch to optimize images directly in the browser using WebAssembly compiled from C++ for high performance.

The user uploads images for local processing only; files are never sent to external servers, ensuring privacy and security.

Besides fulfilling a real need, the project also served as a practical study on integrating C++, WASM, and modern frontend technologies.


## 💡 Personal Motivation

The project was born out of a real need: compress images to update my GitHub profile picture, which has a size limit (~1MB).

Instead of using unknown online services that could compromise my privacy, I decided to create my own solution.

Initially, I considered using Python or Node.js, but I took the opportunity to learn WebAssembly and explore C++, even though I only had experience with C.

The result is an app that processes images entirely in the browser, delivering good performance thanks to C++ compiled to WASM, and security by not sending files to external servers.


## ✨ Features

- Upload images directly in the browser
- Fast compression with WebAssembly + C++
- Compression quality control (0 to 100)
- Simple and responsive UI built with TailwindCSS
- Multilingual support (🇧🇷 [PT-BR] Portuguese and 🇺🇸 [EN] English)
- Internal benchmarks comparing WASM vs pure JS
- Automatic Markdown report generation with metrics:
  - Average and median compression time
  - Final compressed file size


## 📊 Benchmarks

The app runs automatic benchmarks comparing image compression performance using two approaches:

- WebAssembly (C++) 🟣  
- Pure JavaScript 🟡

Generated Markdown reports show:

- Average and median compression time  
- Final compressed file size  

| Metric      | 🟣 WASM Avg (ms) | 🟣 WASM Median (ms) | 🟡 JS Avg (ms) | 🟡 JS Median (ms) |
|-------------|------------------|--------------------|----------------|-------------------|
| Time        | 68.50            | 70.60              | 50.36          | 51.30             |
| Size (KB)   | 163.3            | -                  | 139.7          | -                 |

> ⚠️ **Note:**  
> Benchmarks run automatically during E2E tests using predefined images located in the `assets` folder.  
> The script is at `tests/e2e/benchmark.spec.js`.  
> Results reflect a controlled scenario and may vary depending on image type, size, and the device used.

### 🔍 Result Analysis

As this was my first experience using WebAssembly and C++, I sought to understand why pure JavaScript showed better performance in the results. After research and study, I identified some possible reasons:

- **Communication overhead:** JavaScript and WebAssembly interaction involves function calls that may use dynamic memory allocation (`malloc`) and freeing (`free`), causing significant overhead in frequent executions.
- **Task size and type:** The cost of this data exchange can outweigh the native execution benefit of compiled C++ code, especially for small or repetitive tasks.
- **JS engine optimizations:** Modern JavaScript engines (like V8, SpiderMonkey) have advanced optimizations that can make pure JS code very efficient in specific scenarios.
- **Algorithm implementation:** The C++ code might not be fully optimized for this integration and could be improved by tweaking memory management and code structure.

This experience reinforces that using WebAssembly should be carefully evaluated per use case, and performance can vary depending on implementation and application context.


## 🚀 Online Demo
🔗 **Access here:** [Image Optimizer (WASM + C++)](https://alineamano.github.io/wasm-optimize-images/)  

<p>
  <em>* Analytics powered by <a href="https://umami.is/" target="_blank">Umami</a>, self-hosted on Vercel</em>
</p>


## 🛠 Technologies

- **WebAssembly (C++)** — core compression engine (high performance is key)  
- **Vanilla JavaScript** — integration, UI, and benchmarks (core frontend)  
- **HTML5** — structure and prototyping (frontend fundamentals)  
- **TailwindCSS** — quick and responsive styling (UI/UX)  
- **Vite** — build system, dev environment, and testing (modern infrastructure)  
- **Vitest** — unit and integration testing (code quality)  
- **Playwright** — end-to-end (E2E) testing for app validation  


## 📦 Installation and Usage

```bash
# Clone the repository
git clone https://github.com/alinemano/wasm-optimize-images.git

# Enter the project folder
cd wasm-optimize-images

# Install dependencies
npm install

# Run in development mode
npm run dev
```


## 📄 Licença

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).  
© 2025 alineamano