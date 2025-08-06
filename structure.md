wasm-optimize-images/
├── src/                         # Código-fonte C++ (inclui versão legacy e headers)
│   ├── main.cpp
│   ├── old_code.cpp             # Código antigo antes do WebAssembly
│   ├── stb_image.h
│   └── stb_image_write.h
│
├── web/                         # Interface web
│   ├── index.html
│   ├── app.js
│   ├── compressImage.js
│   ├── constants/
│   │   └── ids.js
│   ├── handlers/
│   │   ├── download.js
│   │   ├── input.js
│   │   ├── modal.js
│   │   └── slider.js
│   ├── utils/
│   │   ├── dom.js
│   │   ├── showNotification.js
│   │   └── translate.js
│   └── i18n/
│       ├── en.json
│       └── pt.json
│
├── dist/                        # Saída do build WebAssembly
│   ├── compress.wasm
│   └── compress.js
│
├── tests/                       # Testes unitários, integração e end-to-end
│   ├── download.test.js
│   ├── input.test.js
│   ├── modal.test.js
│   ├── showNotification.test.js            
│   ├── slider.test.js
│   └── translate.test.js   
│
├── scripts/                     # Scripts e configurações de build
│   ├── compile.sh
│   └── emscripten_settings.txt
│
├── assets/                      # Imagens de exemplo
│   ├── exemplo.png
│   └── resultado.jpg
│
├── .github/                     # Configurações do GitHub
│   └── workflows/
│       └── ci.yml               # CI/CD (testes, build)
│
├── .gitignore
├── README.md                    # README principal (inglês)
├── README.pt-br.md              # Versão em português
├── DEVELOPMENT.md               # Diário técnico (inglês)
├── DEVELOPMENT.pt-br.md         # Diário técnico (português)
├── LICENSE
└── structure.md                 # Visão da estrutura do projeto (separado se quiser)
