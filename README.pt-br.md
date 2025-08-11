<h1 align="center">📦 Otimizador de Imagens no Navegador (WASM + C++)</h1>

<p align="center">
  <a href="README.pt-br.md">🇧🇷 Português</a> | <a href="README.md">🇺🇸 English</a>
</p>

<p align="center">
  Projeto pessoal que permite otimizar imagens no navegador usando <strong>WebAssembly</strong> com <strong>C++</strong>, buscando performance e privacidade, sem depender de servidores externos.
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/alineamano/wasm-optimize-images" alt="Licença MIT">
  <img src="https://img.shields.io/badge/WebAssembly-C++-purple" alt="WebAssembly C++">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-yellow" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/TailwindCSS-CSS-blue" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Coverage-64%25-yellow" alt="Coverage">
</p>


## 📷 Screenshots

<p align="center">
  <img src="./assets/app-screenshot.png" alt="Screenshot da aplicação" width="600">
  <br>
  <em>Interface simples para upload e compressão de imagens</em>
</p>


## 📖 Sobre o Projeto
<!-- Projeto pessoal criado para otimizar imagens diretamente no navegador usando WebAssembly compilado de C++ para alta performance. Todo o processamento é feito localmente no navegador, sem enviar arquivos para servidores, garantindo privacidade e segurança. -->

Projeto pessoal desenvolvido do zero para otimizar imagens diretamente no navegador usando WebAssembly compilado de C++ para alta performance. 

O usuário envia a imagem apenas para processamento local, sem que o arquivo seja transmitido a servidores externos, garantindo privacidade e segurança. 

Além de atender a uma necessidade real, o projeto também serviu como estudo prático de integração entre C++, WASM e frontend moderno.


## 💡 Motivação Pessoal
<!-- O projeto nasceu de uma necessidade pessoal: eu precisava comprimir imagens para atualizar minha foto de perfil do GitHub, que tem limite de tamanho (~1MB).  
Ao invés de usar sites desconhecidos, que poderiam comprometer minha privacidade, resolvi criar minha própria ferramenta de compressão.

Inicialmente cogitei usar Python ou Node.js para essa tarefa, mas aproveitei para estudar WebAssembly e experimentar C++ — apesar de já ter experiência somente com C.  
O resultado é um aplicativo rápido, seguro, que roda 100% no navegador, sem backend. -->

O projeto nasceu de uma necessidade real: comprimir imagens para atualizar minha foto de perfil no GitHub, que tem limite de tamanho (cerca de 1 MB).

Ao invés de usar serviços online desconhecidos, que poderiam comprometer minha privacidade, decidi criar minha própria solução.

Inicialmente pensei em usar Python ou Node.js, mas aproveitei a oportunidade para aprender WebAssembly e explorar C++, mesmo tendo experiência apenas com C.

O resultado é um aplicativo que processa imagens diretamente no navegador, com boa performance graças ao C++ compilado para WASM, e segurança por não enviar arquivos para servidores externos.


## ✨ Funcionalidades
- Upload de imagens direto no navegador
- Compressão rápida com WebAssembly + C++
- Controle de qualidade de compressão (0 a 100)
- Interface simples e responsiva usando TailwindCSS
- Suporte multilíngue (🇧🇷 [PT-BR] Português e 🇺🇸 [EN] Inglês)
- Benchmarks internos comparando WASM vs JS puro
- Geração automática de relatórios em Markdown com métricas:
  - Tempo médio e mediano de compressão
  - Tamanho final do arquivo


## 📊 Benchmarks

O app executa benchmarks automáticos que comparam a performance da compressão de imagens usando duas abordagens:

- WebAssembly (C++) 🟣  
- JavaScript puro 🟡

Os relatórios gerados em Markdown mostram:

- Tempo médio e mediano de compressão  
- Tamanho final do arquivo comprimido  

| Métrica      | 🟣 WASM Média (ms) | 🟣 WASM Mediana (ms) | 🟡 JS Média (ms) | 🟡 JS Mediana (ms) |
|--------------|-------------------|---------------------|-----------------|-------------------|
| Tempo        | 68.50             | 70.60               | 50.36           | 51.30             |
| Tamanho (KB) | 163.3             | -                   | 139.7           | -                 |

> ⚠️ **Nota:**  
> Os benchmarks são executados automaticamente durante testes E2E, usando imagens pré-definidas na pasta `assets`.  
> O script está em `tests/e2e/benchmark.spec.js`.  
> Portanto, os resultados refletem um cenário controlado e podem variar dependendo do tipo e tamanho das imagens, além do dispositivo usado.

### 🔍 Análise dos Resultados

Como essa foi minha primeira experiência utilizando WebAssembly e C++, busquei entender possíveis motivos para o JavaScript puro apresentar desempenho superior nos resultados. Após pesquisa e estudos, identifiquei alguns possíveis pontos:

- **Overhead de comunicação:** A comunicação entre JavaScript e WebAssembly envolve chamadas de funções que podem usar alocação dinâmica de memória (`malloc`) e liberação (`free`), o que gera overhead significativo em execuções frequentes.
- **Tamanho e tipo da tarefa:** O custo dessa troca de dados pode ser maior do que o benefício da execução nativa do código C++ compilado, principalmente para tarefas pequenas ou repetitivas.
- **Otimizações do motor JS:** Motores modernos de JavaScript (como V8, SpiderMonkey) possuem otimizações avançadas que podem tornar o código JS puro muito eficiente em cenários específicos.
- **Implementação do algoritmo:** O código C++ pode não estar totalmente otimizado para essa integração, sendo possível melhorar o desempenho com ajustes no gerenciamento de memória e na estrutura do código.

Essa experiência reforça que o uso de WebAssembly deve ser cuidadosamente avaliado conforme o caso de uso, e que a performance pode variar conforme a implementação e o contexto da aplicação.


## 🚀 Demo Online
🔗 **Acesse aqui:** [Otimizador de Imagens (WASM + C++)](https://alineamano.github.io/wasm-optimize-images/)  

<p>
  <em>* Analytics via <a href="https://umami.is" target="_blank">Umami</a> self-hosted no Vercel</em>
</p>


## 🛠 Tecnologias

- **WebAssembly (C++)** — motor principal da compressão (alta performance é chave)  
- **JavaScript Vanilla** — integração, UI e benchmarks (core frontend)  
- **HTML5** — estrutura e prototipagem (fundamental do front)  
- **TailwindCSS** — estilização rápida e responsiva (UI/UX)  
- **Vite** — build, ambiente dev e testes (infraestrutura moderna)  
- **Vitest** — testes unitários e integração (qualidade de código)  
- **Playwright** — testes end-to-end (E2E) para validação da aplicação  


## 📦 Instalação e Uso

```bash
# Clone o repositório
git clone https://github.com/alinemano/wasm-optimize-images.git

# Entre na pasta do projeto
cd wasm-optimize-images

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```


## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).  
© 2025 alineamano
