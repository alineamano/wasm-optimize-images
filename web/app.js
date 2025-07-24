import {
  setupImageInputHandlers,
  setupQualitySlider,
} from "./interfaceHandlers.js";

function main() {
  setupImageInputHandlers();
  setupQualitySlider();
}

document.addEventListener("DOMContentLoaded", main);
