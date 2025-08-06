import { describe, expect, it, vi } from "vitest";
import { IDs } from "../web/constants/ids.js";

const importSliderModule = () => import("../web/handlers/slider.js");

describe("Slider Handler", () => {
  beforeEach(() => {
    vi.resetModules();

    document.body.innerHTML = `
      <input id="${IDs.slider}" type="range" value="50" min="0" max="100" />
      <span id="${IDs.sliderValue}">50</span>
    `;
  });

  describe("getSelectedQuality() function", () => {
    it("should return the current slider value as an integer", async () => {
      const { getSelectedQuality } = await importSliderModule();

      const slider = document.getElementById(IDs.slider);
      slider.value = "80";

      expect(getSelectedQuality()).toBe(80);
    });
  });

  describe("setupQualitySlider() function", () => {
    it("should update the slide value text content on input event", async () => {
      const { setupQualitySlider } = await importSliderModule();

      const slider = document.getElementById(IDs.slider);
      const sliderValue = document.getElementById(IDs.sliderValue);

      setupQualitySlider();

      slider.value = "75";
      slider.dispatchEvent(new Event("input"));

      expect(sliderValue.textContent).toBe("75");
    });
  });
});
