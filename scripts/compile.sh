#!/bin/bash

emcc src/main.cpp -o dist/compress.js \
  -O3 \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_compressImageToJpg", "_freeCompressedImage"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap", "getValue", "setValue"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='createModule' \
  -I src/
