import { IDs } from "../constants/ids.js";
import { $ } from "../utils/dom.js";

let hideTimeout;

/**
 * Displays a toast-style notification message on the screen.
 *
 * @param {string} message - The text message to display in the notification.
 * @param {('error'|'success')} [type='error'] - The type of notification, determines styling (e.g., red or green).
 * @param {number} [duration=4000] - Duration in milliseconds before the notification is automatically hidden.
 * @returns {void}
 */
export function showNotification(message, type = "error", duration = 4000) {
  if (import.meta.env.PROD && window.gtag) {
    gtag("event", "show_notification", {
      message,
      type,
      duration,
    });
  }

  const notification = $(IDs.notification);

  notification.textContent = message;

  notification.classList.remove("hidden");
  notification.classList.remove("bg-red-500", "bg-green-500");

  notification.classList.add(type === "error" ? "bg-red-500" : "bg-green-500");

  clearTimeout(hideTimeout);

  hideTimeout = setTimeout(() => {
    notification.classList.add("hidden");
  }, duration);
}
