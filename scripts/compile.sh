#!/bin/bash

emcc src/main.cpp -o dist/compress.js \
  -O3 \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_compressImageToJpg", "_freeCompressedImage",  "_malloc", "_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue", "HEAPU8", "HEAP32"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORT_NAME='createModule' \
  -I src/