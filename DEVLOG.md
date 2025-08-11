# Development Diary – WASM Optimize Images Project

## 1. Motivation

This project arose from the need to resize my GitHub profile picture.

The images I had were larger than allowed, and instead of using a random (and unreliable) website, I decided to create my own solution.

**Goals:**

- Create a simple project, ensuring performance, best practices, and learning new technologies.
- Explore technologies I had never used before: WebAssembly with C++, Playwright, among others.
- Practice integration with TailwindCSS, automated testing, CI/CD, and deployment on GitHub Pages.


## 2. Stack and Technologies

- **C++ + Emscripten** → to generate WebAssembly and process images.
- **JavaScript/HTML/CSS** → interface and file handling logic in the browser.
- **TailwindCSS** → fast and responsive styling.
- **Vitest** → unit and integration testing.
- **Playwright** → E2E testing.
- **Vite** → build tool and development server.
- **GitHub Actions** → CI/CD.
- **GitHub Pages** → deployment.
- **Umami** → analytics (self-hosted).
- **Supabase + Vercel** → backend for Umami.


## 3. Development Process

### 3.1 Initial Structure

I started by creating the basic project structure ([structure.txt](structure.txt)) and adjusting it as I progressed.  
Initially, the plan was to use Python or Node.js, but I chose WebAssembly with C++ for learning purposes.


### 3.2 First Steps in C++

- Code created with AI assistance, adapting my previous knowledge of C.
- After creating the C++ code (`old_code.cpp`) and seeing it working, I made adjustments for WebAssembly.
- Adjustments to work in the browser:
  - Removal of `argv[]` and `std::cout`.
  - Use of `extern "C"` for the JS-C++ interface.
  - Replacement of `std::cerr` with `printf`.


### 3.3 Emscripten Setup

Installation on Linux:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```


### 3.4 Architecture Decision

- **JS** → reading, decoding, and preparing pixels (RGBA).
- **C++/WASM** → JPEG compression.
- Separation of responsibilities to leverage the strengths of each environment.


### 3.5 WebAssembly Integration

Created `compile.sh` and `emscripten_settings.txt`.

Flags adjusted until reaching a functional configuration:

```bash
-O3 \
-s WASM=1 \
-s EXPORTED_FUNCTIONS='["_compressImageToJpg", "_freeCompressedImage", "_malloc", "_free"]' \
-s EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue", "HEAPU8", "HEAP32"]' \
-s ALLOW_MEMORY_GROWTH=1 \
-s MODULARIZE=1 \
-s EXPORT_ES6=1 \
-s EXPORT_NAME='createModule' \
-I src/
```


### 3.6 Frontend Adjustments

- Separation of JS functions by responsibility (`app.js`, `interfaceHandlers.js`).
- Implementation of drag & drop with capture phase correction.
- Display of original and compressed sizes, with an alert if the compressed image is larger.


### 3.7 Testing

- Vitest for unit and integration tests.
- Playwright for E2E tests (first time using it).
- Code adjustments to export functions and allow testing.
- Migration to Vite to fix local server issues.


### 3.8 Deploy and CI/CD

- GitHub Actions configured for build and deployment.
- Permission adjustments, branch (`gh-pages`), and environment variables.


### 3.9 Analytics with Umami

- Self-hosted Umami on Vercel and Supabase.
- Key generation with `openssl rand -base64 32`.
- Adjustments for Vercel compatibility.
- Conditional tagging only in production.


### 3.10 Benchmark

- Comparison between compression with **pure JS** and **WASM/C++**.
- **Result:** JS was faster in some cases due to internal browser optimizations.
- Used `performance.now()` to measure average, median, and standard deviation.


## 4. Challenges and Learnings

- JS ↔ WASM integration requires careful handling of pointers, memory, and data copies.
- Benchmark showed WASM isn’t always faster; context matters.
- E2E tests revealed usability issues and cross-browser behavior differences.
- CI/CD and automatic deployment speed up the development cycle.
- Accessibility, security, and internationalization add real value to the project.


## 5. Final Result

- 🔗 [Application on GitHub Pages](https://alineamano.github.io/wasm-optimize-images/)
- 🔗 [Repository on GitHub](https://github.com/alineamano/wasm-optimize-images)
