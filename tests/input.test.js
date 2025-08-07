import { describe, expect, it, vi } from "vitest";
import { IDs } from "../web/constants/ids.js";

const importInputModule = () => import("../web/handlers/input.js");

function createFakeFile(name = "image_test.jpg", type = "image/jpeg") {
  return new File(["dummy content"], name, { type });
}

function createFakeFileList(...files) {
  return {
    length: files.length,
    item: (i) => files[i],
    ...files,
  };
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
}

describe("Input Handler", () => {
  beforeEach(() => {
    vi.resetModules();

    document.body.innerHTML = `
      <div id="${IDs.inputDropArea}"></div>
      <input id="${IDs.fileInput}" type="file" />
      <span id="${IDs.fileName}"></span>
      <button id="${IDs.removeFileBtn}"></button>
      <button id="${IDs.compressBtn}"></button>
    `;
  });

  describe("getSelectedFile() function", () => {
    it("should return null when no file is selected", async () => {
      const { getSelectedFile } = await importInputModule();

      expect(getSelectedFile()).toBeNull();
    });

    it("should return selected file", async () => {
      const { getSelectedFile } = await importInputModule();

      const fileInput = document.getElementById(IDs.fileInput);

      const file = createFakeFile();
      Object.defineProperty(fileInput, "files", {
        value: createFakeFileList(file),
        writable: true,
      });

      expect(getSelectedFile()).toBe(file);
    });
  });

  describe("clearSelectedFile() function", () => {
    it("should clear file input value", async () => {
      const { clearSelectedFile } = await importInputModule();

      const fileInput = document.getElementById(IDs.fileInput);

      const file = createFakeFile();
      Object.defineProperty(fileInput, "files", {
        value: createFakeFileList(file),
        writable: true,
      });

      clearSelectedFile();

      expect(fileInput.value).toBe("");
    });
  });

  describe("setupImageInputHandlers() function", () => {
    it("should click file input when drop area is clicked", async () => {
      const { setupImageInputHandlers } = await importInputModule();

      const fileInput = document.getElementById(IDs.fileInput);
      const inputDropArea = document.getElementById(IDs.inputDropArea);

      const fileInputClickSpy = vi.spyOn(fileInput, "click");

      setupImageInputHandlers();

      inputDropArea.click();

      expect(fileInputClickSpy).toHaveBeenCalled();
    });

    it("should trigger file input click on Enter key press", async () => {
      const { setupImageInputHandlers } = await importInputModule();

      const fileInput = document.getElementById(IDs.fileInput);
      const inputDropArea = document.getElementById(IDs.inputDropArea);

      const fileInputClickSpy = vi.spyOn(fileInput, "click");

      setupImageInputHandlers();

      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });

      inputDropArea.dispatchEvent(enterEvent);

      expect(fileInputClickSpy).toHaveBeenCalled();
    });

    it("should appear remove button when a file is added", async () => {
      const { setupImageInputHandlers } = await importInputModule();

      setupImageInputHandlers();

      const fileInput = document.getElementById(IDs.fileInput);
      const removeFileBtn = document.getElementById(IDs.removeFileBtn);

      const file = createFakeFile();
      Object.defineProperty(fileInput, "files", {
        value: createFakeFileList(file),
        writable: true,
      });

      expect(removeFileBtn.classList.contains("hidden")).toBe(false);
    });
  });

  describe("applyDragVisual() function", () => {
    it("should apply drag-over styles", async () => {
      const { applyDragVisual } = await importInputModule();

      const inputDropArea = document.getElementById(IDs.inputDropArea);

      applyDragVisual();

      expect(inputDropArea.style.borderColor).toBe(hexToRgb("#3a86ff"));
      expect(inputDropArea.style.background).toBe(hexToRgb("#f3f4f6"));
    });
  });

  describe("removeDragVisual() function", () => {
    it("should remove drag-over styles", async () => {
      const { removeDragVisual } = await importInputModule();
      const inputDropArea = document.getElementById(IDs.inputDropArea);

      inputDropArea.style.borderColor = "#3a86ff";
      inputDropArea.style.background = "#f3f4f6";

      removeDragVisual();

      expect(inputDropArea.style.borderColor).toBe(hexToRgb("#d1d5dc"));
      expect(inputDropArea.style.background).toBe("");
    });
  });
});
