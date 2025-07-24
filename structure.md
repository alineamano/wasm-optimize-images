wasm-optimize-images/
├── src/ # Código C++ + headers
│ ├── main.cpp
│ ├── stb_image.h
│ └── stb_image_write.h
│
├── web/ # Interface web (HTML + JS)
│ ├── index.html
│ └── app.js
│ └── interfaceHandlers.js
│ └── compressImage.js
│
├── dist/ # Arquivos gerados (WASM, JS wrapper)
│ ├── compress.wasm
│ └── compress.js
│
├── assets/ # Imagens exemplo ou testes
│ ├── exemplo.png
│ └── resultado.jpg
│
├── scripts/ # Scripts e configs de build
│ ├── compile.sh
│ └── emscripten_settings.txt
│
├── README.md
└── LICENSE
└── structure.md
