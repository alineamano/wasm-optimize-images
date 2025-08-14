import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";

const slider = $(IDs.slider);
const sliderValue = $(IDs.sliderValue);

/**
 * Initializes the quality slider by updating the displayed value
 * in real time as the user moves the slider.
 */
export function setupQualitySlider() {
  slider.addEventListener("input", (event) => {
    const quality = event.target.value;
    sliderValue.textContent = quality;

    if (import.meta.env.PROD && window.gtag) {
      gtag("event", "quality_changed", {
        quality,
      });
    }
  });
}

/**
 * Returns the currently selected quality value from the slider.
 *
 * @returns {number} The selected quality as an integer.
 */
export function getSelectedQuality() {
  return parseInt(slider.value, 10);
}
