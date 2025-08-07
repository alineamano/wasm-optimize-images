import { describe, expect, it, vi } from "vitest";
import { IDs } from "../web/constants/ids.js";

const MESSAGE = "Notification: Testing message";

const importShowNotificationModule = () =>
  import("../web/utils/showNotification.js");

describe("Show Notification Handler", () => {
  describe("showNotification() function", () => {
    beforeEach(() => {
      vi.resetModules();

      document.body.innerHTML = `
        <div id="${IDs.notification}" class="hidden"></div>
      `;
    });

    it("should update notification text content with tbe provided message", async () => {
      const { showNotification } = await importShowNotificationModule();

      const notification = document.getElementById(IDs.notification);

      showNotification(MESSAGE);

      expect(notification.textContent).toBe(MESSAGE);
    });

    it("should apply red background by default when type is not provided", async () => {
      const { showNotification } = await importShowNotificationModule();

      const notification = document.getElementById(IDs.notification);

      showNotification(MESSAGE);

      expect(notification.classList.contains("bg-red-500")).toBe(true);
      expect(notification.classList.contains("bg-green-500")).toBe(false);
    });

    it("should apply green background when notification type isnt error", async () => {
      const { showNotification } = await importShowNotificationModule();

      const notification = document.getElementById(IDs.notification);

      showNotification(MESSAGE, "success");

      expect(notification.classList.contains("bg-red-500")).toBe(false);
      expect(notification.classList.contains("bg-green-500")).toBe(true);
    });
  });
});
