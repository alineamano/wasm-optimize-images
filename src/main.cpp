#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include "stb_image.h"
#include "stb_image_write.h"

#include <cstdlib>
#include <cstring>
#include <vector>
#include <iostream>


extern "C" {
  /**
  * Função callback usada pela stb_image_write para armazenar dados JPEG em memória.
  *
  * Parâmetros:
  * - context: ponteiro para o buffer de saída (std::vector<unsigned char>) onde os dados serão acumulados
  * - data: ponteiro para os bytes gerados neste pedaço da imagem JPEG
  * - size: quantidade de bytes em 'data' a serem copiados para o buffer
  *
  * Retorno:
  * - Void (sem retorno), mas acumula os dados JPEG no buffer apontado por 'context'
  */

  void writeToBuffer(void* context, void* data, int size) {
    std::vector<unsigned char>* buffer = static_cast<std::vector<unsigned char>*>(context);
    unsigned char* bytes = static_cast<unsigned char*>(data);
    // buffer->insert(), adiciona no final do vetor todos os bytes que vão do ponteiro bytes até bytes + size (não inclusivo), ou seja, copia exatamente size bytes para o final do vetor
    buffer->insert(buffer->end(), bytes, bytes + size);
  }

  /**
  * Função que comprime uma imagem em memória para formato JPG.
  *
  * Parâmetros:
  * - rawImageData: ponteiro para os bytes da imagem (RGBA ou RGB)
  * - width: largura da imagem
  * - height: altura da imagem
  * - channels: número de canais (geralmente 3 ou 4)
  * - desiredQuality: qualidade JPEG (1 a 100)
  * - outputSize: ponteiro onde será armazenado o tamanho do JPG gerado
  *
  * Retorno:
  * - Ponteiro para os dados JPG gerados (alocados com malloc)
  * - Deve ser liberado com `freeCompressedImage()` no JS após o uso
  */
  unsigned char* compressImageToJpg(
    unsigned char* rawImageData, 
    int width, 
    int height, 
    int channels, 
    int desiredQuality, 
    int* outputSize
  ) {
    if (!rawImageData || width <= 0 || height <= 0 || channels < 3 || !outputSize) {
      return nullptr;
    }

    // Cria vetores dinamicos vazios para armazenar os bytes da imagem JPG gerada. Esse buffer vai receber os dados conforme a imagem for comprimida.
    std::vector<unsigned char> jpegBuffer;
    std::vector<unsigned char> rgbImageData;

    const int desiredChannels = 3;

    unsigned char* pixelData = rawImageData;

    // Converte RGBA para RGB se necessário - JPEG não suporta canal alfa (transparência)
    if (channels == 4) {
      rgbImageData.resize(width * height * desiredChannels);

      for (int srcIndex = 0, destIndex = 0; srcIndex < width * height * 4; srcIndex += 4, destIndex+=3) {
        rgbImageData[destIndex + 0] = rawImageData[srcIndex + 0]; // R
        rgbImageData[destIndex + 1] = rawImageData[srcIndex + 1]; // G
        rgbImageData[destIndex + 2] = rawImageData[srcIndex + 2]; // B
      }
      // .data() retorna um ponteiro para o primeiro elemento do vetor, ou seja, um unsigned char* 
      pixelData = rgbImageData.data()
    }

    // Gera um JPEG em memória e chama uma função callback para enviar os dados gerados pedaço a pedaço
    bool success = stbi_write_jpg_to_func(
      writeToBuffer,       // função callback que será chamada toda vez que gerar um bloco de bytes
      &jpegBuffer,         // ponteiro que será passado para o callback, serve como contexto para que o callback saiba onde guardar os dados
      width,
      height,
      desiredChannels,     // para JPEG deve ser 3 (RGB)
      pixelData,           // ponteiro para os dados da imagem original
      desiredQuality       // qualidade JPEG de 1 a 100
    );

    if (!success) {
      std::cerr << "Falha ao comprimir imagem." << std::endl;
      *outputSize = 0;      // Indica que a compressão falhou, tamanho zero
      return nullptr;
    }

    // Se sucesso, copia os dados do vetor para buffer C (malloc)
    unsigned char* compressedData = (unsigned char*) malloc(jpegBuffer.size());

    if (!compressedData) {
      std::cerr << "Falha ao alocar memória para imagem comprimida." << std::endl;
      *outputSize = 0;      // Falha na alocação
      return nullptr;
    }

    // Copia os bytes do std::vector para o buffer mallocado
    memcpy(compressedData, jpegBuffer.data(), jpegBuffer.size());
    
    // Armazena o tamanho no local apontado por outputSize
    *outputSize = static_cast<int>(jpegBuffer.size());

    return compressedData;
  }


  /**
  * Libera o buffer da imagem gerado por `compressImageToJpg`
  */
  void freeCompressedImage(unsigned char* data) {
    free(data);
  }
}
