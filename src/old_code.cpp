#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include "stb_image.h"
#include "stb_image_write.h"

#include <iostream>
#include <sys/stat.h>
#include <cctype>

// st_size	off_t	Tamanho do arquivo em bytes
size_t getFileSizeInBytes(const char* filePath) {
  struct stat fileInfo;
  int result = stat(filePath, &fileInfo); // Return 0 for sucess get info at fileInfo and -1 for fail
  return result == 0 ? fileInfo.st_size : 0;
}

const char* extractFileExtension(const char* fileName) {
  const char* extensionWithLastDot = strrchr(fileName, '.');
  if (extensionWithLastDot == nullptr || extensionWithLastDot == fileName) return "";
  return extensionWithLastDot + 1;
}

void convertToLowerCase(const char* input, char* output, int maxLength) {
  for (int i = 0; i < maxLength - 1; i++) {
    if (input[i] == '\0') {
      output[i] = '\0';
      return;
    }
    output[i] = (char)tolower(input[i]);
  }

  output[maxLength - 1] = '\0';
}

bool isOptiPngAvailable() {
    return system("optipng --version > /dev/null 2>&1") == 0;
}


bool saveImageWithCorrectFormat(const char* outputFilePath, int width, int height, int channels, unsigned char* imagePixelData, int desiredQuality) {
  const char* outputExtension = extractFileExtension(outputFilePath);

  char outputExtensionLower[10];
  convertToLowerCase(outputExtension, outputExtensionLower, 10);

  if (strcmp(outputExtensionLower, "jpg") == 0 || strcmp(outputExtensionLower, "jpeg") == 0) {
    return stbi_write_jpg(outputFilePath, width, height, 3, imagePixelData, desiredQuality) != 0;
  } else if (strcmp(outputExtensionLower, "png") == 0) {
    bool result = stbi_write_png(outputFilePath, width, height, channels, imagePixelData, width * channels) != 0;

    if (result && isOptiPngAvailable()) {
      std::string command = "optipng -o7 ";
      command += outputFilePath;
      int optipngResult = system(command.c_str());
      (void)optipngResult;
    } else if (!isOptiPngAvailable()) {
      std::cerr << "Warning: optipng not found, PNG not optimized.\n";
    }

    return result;
  } else {
    std::cerr << "Unsupported output image format: " << outputExtensionLower << std::endl;
    return false;
  }
}

int main(int argc, char* argv[]) {
  if (argc < 4) {
    std::cout << "Hello World!\n";
    std::cout << "Usage: ./compress <input_image_jpeg_or_png> <output_image> <desired_quality_1_100>\n";
    return 1;
  }

  const char* inputImagePath = argv[1];
  const char* outputImagePath = argv[2];
  int desiredQuality = atoi(argv[3]);

  int inputImageWidth, inputImageHeight, inputImageChannels;
  int desiredChannels = 0; // Mantém o número de canais da imagem original

  size_t imageOriginalSize;

  unsigned char* imageData = stbi_load(inputImagePath, &inputImageWidth, &inputImageHeight, &inputImageChannels, desiredChannels);

  if (!imageData) {
    std::cerr << "Failed to load image: " << inputImagePath << std::endl;
    return 1;
  }

  std::cout << "Image loaded!" << std::endl;
  std::cout << "Image Width: " << inputImageWidth << std::endl;
  std::cout << "Image Height: " << inputImageHeight << std::endl;
  std::cout << "Image Channels: " << inputImageChannels << std::endl;

  if (!saveImageWithCorrectFormat(outputImagePath, inputImageWidth, inputImageHeight, inputImageChannels, imageData, desiredQuality)) {
    std::cerr << "Failed to save compressed image\n";
    stbi_image_free(imageData);
    return 1;
  }

  stbi_image_free(imageData);

  size_t originalSize = getFileSizeInBytes(inputImagePath);
  size_t compressedSize = getFileSizeInBytes(outputImagePath);

  std::cout << "Original image extension: " << extractFileExtension(inputImagePath) << std::endl;
  std::cout << "Original image size: " << originalSize / 1024 << " KB\n";
  std::cout << "Compressed image size: " << compressedSize / 1024 << " KB\n";
}