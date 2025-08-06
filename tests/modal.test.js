import { describe, expect, it, vi } from "vitest";
import { IDs } from "../web/constants/ids";

const FAKE_URL = "blob:http://example.com/123";

const clearSelectedFileMock = vi.fn();
const revokeObjectURLMock = vi.fn();

vi.doMock("../web/handlers/input.js", () => ({
  clearSelectedFile: clearSelectedFileMock,
}));

const importModalModule = () => import("../web/handlers/modal.js");

describe("Modal Handler", () => {
  beforeEach(() => {
    vi.resetModules();

    document.body.innerHTML = `
      <img id="${IDs.compressedImagePreview}" src="" />
      <button id="${IDs.downloadBtn}" disabled aria-disabled="true"></button>
      <div id="${IDs.languageSelector}" class="hidden"></div>
      <div id="${IDs.modalOverlay}"></div>
      <button id="${IDs.modalCloseBtn}"></button>
      <div id="${IDs.originalSize}"></div>
      <div id="${IDs.compressedSize}"></div>
      <div id="${IDs.sizeObservation}"></div>
    `;

    global.URL.revokeObjectURL = revokeObjectURLMock;
  });

  describe("getCurrentBlobUrl() function", () => {
    it("should return null initially", async () => {
      const { getCurrentBlobUrl } = await importModalModule();

      expect(getCurrentBlobUrl()).toBeNull();
    });

    it("should return the current blob URL after showCompressedImage is called", async () => {
      const { getCurrentBlobUrl, showCompressedImage } =
        await importModalModule();

      showCompressedImage(FAKE_URL, 1024, 512);

      expect(getCurrentBlobUrl()).toBe(FAKE_URL);
    });
  });

  describe("formatBytes() function", () => {
    it("should return bytes less than 1024 as B", async () => {
      const { formatBytes } = await importModalModule();

      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(512)).toBe("512 B");
      expect(formatBytes(1023)).toBe("1023 B");
    });

    it("should return bytes between 1 KB and 1 MB as KB", async () => {
      const { formatBytes } = await importModalModule();

      expect(formatBytes(1024)).toBe("1.00 KB");
      expect(formatBytes(1536)).toBe("1.50 KB");
    });

    it("should format bytes >= 1 MB as MB", async () => {
      const { formatBytes } = await importModalModule();

      expect(formatBytes(1048576)).toBe("1.00 MB");
      expect(formatBytes(1572864)).toBe("1.50 MB");
    });
  });

  describe("setupCloseModalHandler() function", () => {
    it("should attach click event listener to close button", async () => {
      const { closeModal, setupCloseModalHandler } = await importModalModule();

      const modalCloseBtn = document.getElementById(IDs.modalCloseBtn);
      const addEventListenerSpy = vi.spyOn(modalCloseBtn, "addEventListener");

      setupCloseModalHandler();

      expect(addEventListenerSpy).toHaveBeenCalledWith("click", closeModal);
    });
  });

  describe("closeModal() function", () => {
    it("should call revokeObjectURL and clearSelectedFile function when closeModal is called", async () => {
      const { closeModal, showCompressedImage } = await importModalModule();

      showCompressedImage(FAKE_URL, 1024, 512);

      closeModal();

      expect(revokeObjectURLMock).toHaveBeenCalledTimes(1);
      expect(clearSelectedFileMock).toHaveBeenCalledTimes(1);
    });

    it("should remove hidden of language selector when modal is closed", async () => {
      const { closeModal, showCompressedImage } = await importModalModule();

      const languageSelector = document.getElementById(IDs.languageSelector);

      showCompressedImage(FAKE_URL, 1024, 512);

      closeModal();

      expect(languageSelector.classList.contains("hidden")).toBe(false);
    });

    it("should disable button when modal is closed", async () => {
      const { closeModal, showCompressedImage } = await importModalModule();

      const downloadBtn = document.getElementById(IDs.downloadBtn);

      showCompressedImage(FAKE_URL, 1024, 512);

      closeModal();

      expect(downloadBtn.disabled).toBe(true);
      expect(downloadBtn.getAttribute("aria-disabled")).toBe("true");
    });

    it("should reset status of elements when modal is closed", async () => {
      const { closeModal, showCompressedImage } = await importModalModule();

      const modalOverlay = document.getElementById(IDs.modalOverlay);
      const sizeObservation = document.getElementById(IDs.sizeObservation);
      const compressedImagePreview = document.getElementById(
        IDs.compressedImagePreview
      );
      const originalSize = document.getElementById(IDs.originalSize);
      const compressedSize = document.getElementById(IDs.compressedSize);

      showCompressedImage(FAKE_URL, 1024, 512);

      closeModal();

      expect(modalOverlay.classList.contains("hidden")).toBe(true);
      expect(sizeObservation.classList.contains("hidden")).toBe(true);

      expect(originalSize.textContent).toBe("");
      expect(compressedSize.textContent).toBe("");

      expect(compressedImagePreview.getAttribute("src")).toBe("");
    });
  });
});
