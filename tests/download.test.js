import { describe, expect, it, vi } from "vitest";
import { IDs } from "../web/constants/ids.js";

const showNotificationSpy = vi.fn();
const getCurrentBlobUrlSpy = vi.fn();
const tSpy = vi.fn(() => "No image to download");

vi.mock("../utils/showNotification.js", async () => ({
  showNotification: showNotificationSpy,
}));

vi.mock("../web/handlers/modal.js", async () => ({
  getCurrentBlobUrl: getCurrentBlobUrlSpy,
}));

vi.mock("../utils/translate.js", async () => ({
  t: tSpy,
}));

const importDownloadModule = () => import("../web/handlers/download.js");

describe("Download Handler", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    document.body.innerHTML = `
      <button id="${IDs.downloadBtn}">Download</button>
      <div id="${IDs.notification}" class="hidden"></div>
    `;
  });

  describe("triggerDownload() function", () => {
    it("should call appendChild and removeChild during the download process", async () => {
      const { triggerDownload } = await importDownloadModule();

      const appendSpy = vi.spyOn(document.body, "appendChild");
      const removeSpy = vi.spyOn(document.body, "removeChild");

      triggerDownload("blob:test-url", "file.png");

      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe("handleDownloadClick() function", () => {
    it.skip("should show error notification if no image", async () => {
      getCurrentBlobUrlSpy.mockReturnValue(null);

      const { handleDownloadClick } = await importDownloadModule();

      handleDownloadClick();

      expect(getCurrentBlobUrlSpy).toHaveBeenCalled();
      expect(showNotificationSpy).toHaveBeenCalledTimes(1);
    });

    it("should trigger download when blobUrl exists", async () => {
      const fakeBlobUrl = "blob:http://example.com/123";
      getCurrentBlobUrlSpy.mockReturnValue(fakeBlobUrl);

      const appendSpy = vi.spyOn(document.body, "appendChild");
      const removeSpy = vi.spyOn(document.body, "removeChild");

      const { handleDownloadClick } = await importDownloadModule();

      handleDownloadClick();

      expect(getCurrentBlobUrlSpy).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe("setupDownloadHandler() function", () => {
    it("should add click event listener to download button", async () => {
      const { handleDownloadClick, setupDownloadHandler } =
        await importDownloadModule();

      const downloadBtn = document.getElementById(IDs.downloadBtn);
      const addEventListenerSpy = vi.spyOn(downloadBtn, "addEventListener");

      setupDownloadHandler();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "click",
        handleDownloadClick
      );
    });
  });
});
