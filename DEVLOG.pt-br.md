# Diário de Desenvolvimento – Projeto WASM Optimize Images

## 1. Motivação

Este projeto surgiu da necessidade de alterar o tamanho da minha foto de perfil para o Github.  

As imagens que eu tinha eram maiores do que o permitido e, em vez de usar um site aleatório (e não confiável), decidi criar minha própria solução.

**Objetivos:**

- Criar um projeto simples, garantindo performance, boas práticas e aprendizado de novas tecnologias.
- Explorar tecnologias que eu nunca tinha usado: WebAssembly com C++, Playwright, entre outras.
- Praticar integração com TailwindCSS, testes automatizados, CI/CD e deploy no GitHub Pages.


## 2. Stack e Tecnologias

- **C++ + Emscripten** → para gerar WebAssembly e processar imagens.
- **JavaScript/HTML/CSS** → interface e lógica de manipulação de arquivos no navegador.
- **TailwindCSS** → estilização responsiva e rápida.
- **Vitest** → testes unitários e de integração.
- **Playwright** → testes E2E.
- **Vite** → build e servidor de desenvolvimento.
- **GitHub Actions** → CI/CD.
- **GitHub Pages** → deploy.
- **Umami** → analytics (self-hosted).
- **Supabase + Vercel** → backend para o Umami.
- **GA4** → troca o analytics de Umami para GA4.


## 3. Processo de Desenvolvimento

### 3.1 Estrutura inicial

Comecei criando a estrutura básica do projeto ([structure.txt](structure.txt)) e ajustando conforme avançava.  
Inicialmente, o plano era usar Python ou Node.js, mas optei por WebAssembly com C++ para aprendizado.


### 3.2 Primeiros passos no C++

- Código criado com ajuda de IA, adaptando meu conhecimento prévio de C.
- Depois de criar o código em C++ (`old_code.cpp`) e ver funcionando, fiz os ajustes para WebAssembly.
- Ajustes para funcionar no navegador:
  - Remoção de `argv[]` e `std::cout`.
  - Uso de `extern "C"` para interface entre JS e C++.
  - Substituição de `std::cerr` por `printf`.


### 3.3 Setup do Emscripten

Instalação no Linux:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```


### 3.4 Decisão de arquitetura

- **JS** → leitura, decodificação e preparação de pixels (RGBA).
- **C++/WASM** → compressão JPEG.
- Separação de responsabilidades para aproveitar o melhor de cada ambiente.


### 3.5 Integração com WebAssembly

Criado `compile.sh` e `emscripten_settings.txt`.

Flags ajustadas até chegar na configuração funcional:
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


### 3.6 Ajustes no Frontend

- Separação de funções JS por responsabilidade (`app.js`, `interfaceHandlers.js`).
- Implementação de drag & drop com correção do capture phase.
- Exibição de tamanhos original e comprimido, com alerta se a imagem comprimida for maior.


### 3.7 Testes

- Vitest para unitários e integração.
- Playwright para E2E (primeira vez usando).
- Ajustes no código para exportar funções e permitir testes.
- Migração para Vite para corrigir problemas de servidor local.


### 3.8 Deploy e CI/CD

- Configuração do GitHub Actions para build e deploy.
- Ajustes de permissões, branch (`gh-pages`) e variáveis de ambiente.


### 3.9 Analytics com Umami

- Umami self-hosted no Vercel e Supabase.
- Geração de chaves com `openssl rand -base64 32`.
- Ajustes para funcionamento no Vercel.
- Tagueamento condicional apenas em produção.


### 3.10 Benchmark

- Comparação entre compressão com **JS puro** e **WASM/C++**.
- **Resultado**: JS mais rápido em alguns casos devido a otimizações internas do navegador.
- Uso de `performance.now()` para medir média, mediana e desvio padrão.


## 4. Desafios e Aprendizados

- Integração JS ↔ WASM exige cuidado com ponteiros, memória e cópias de dados.
- Benchmark mostrou que nem sempre WASM é mais rápido e que o contexto importa.
- Testes E2E revelaram falhas de usabilidade e comportamento cross-browser.
- CI/CD e deploy automático agilizam o ciclo de desenvolvimento.
- Acessibilidade, segurança e internacionalização agregam valor real ao projeto.


## 5. Resultado Final

- 🔗 [Aplicação no GitHub Pages](https://alineamano.github.io/wasm-optimize-images/)
- 🔗 [Repositório no GitHub](https://github.com/alineamano/wasm-optimize-images)
