wasm-optimize-images/
├── src/
│   ├── main.cpp
│   ├── old_code.cpp
│   ├── stb_image.h
│   └── stb_image_write.h
│
├── web/
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
├── dist/
│   ├── compress.wasm
│   └── compress.js
│
├── tests/
│   ├── download.test.js
│   ├── input.test.js
│   ├── modal.test.js
│   ├── showNotification.test.js            
│   ├── slider.test.js
│   └── translate.test.js
│   └── e2e/                     
│       └── image-flow.spec.js   
│
├── scripts/
│   ├── compile.sh
│   └── emscripten_settings.txt
│
├── assets/
│   ├── cataratas_compressed_image_55.jpg
│   ├── cataratas.png
│   ├── warrior_compressed_image_85.jpg
│   ├── warrior_compressed_image.jpg
│   └── warrior.png
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── README.md
├── README.pt-br.md
├── DEVELOPMENT.md
├── DEVELOPMENT.pt-br.md
├── LICENSE
├── package-lock.json
├── package.json
├── playwright.config.js
├── vite.config.js
├── vitest.config.js
└── structure.md