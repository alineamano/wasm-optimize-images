import { beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_EN_TRANSLATION = {
  title: "Image Optimizer",
  compress_button: "Testing Compress Image Button",
};

const showNotificationMock = vi.fn();

vi.doMock("../web/utils/showNotification.js", () => ({
  showNotification: showNotificationMock,
}));

const importTranslationModule = async () => {
  const translationModule = await import("../web/utils/translate.js");
  const showNotificationModule = await import(
    "../web/utils/showNotification.js"
  );
  return { translationModule, showNotificationModule };
};

describe("Translate Handler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("t() function", () => {
    it("should return translated text for known keys", async () => {
      const { translationModule } = await importTranslationModule();
      translationModule._setTranslations(MOCK_EN_TRANSLATION);

      expect(translationModule.t("title")).toBe("Image Optimizer");
      expect(translationModule.t("compress_button")).toBe(
        "Testing Compress Image Button"
      );
    });

    it("should return key itself for unknown keys", async () => {
      const { translationModule } = await importTranslationModule();
      translationModule._setTranslations(MOCK_EN_TRANSLATION);

      expect(translationModule.t("unknown_key")).toBe("unknown_key");
    });
  });

  describe("loadLanguage() function", () => {
    it("should fetch the correct language JSON file", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({}),
        })
      );

      const { translationModule } = await importTranslationModule();
      await translationModule.loadLanguage("jp");

      expect(fetch).toHaveBeenCalledWith("./i18n/jp.json");
    });

    it("should update translations and currentLang after successful fetch", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(MOCK_EN_TRANSLATION),
        })
      );

      const { translationModule } = await importTranslationModule();

      await translationModule.loadLanguage("en");

      expect(translationModule.translations).toEqual(MOCK_EN_TRANSLATION);
      expect(translationModule.currentLang).toBe("en");
    });

    it("should call showNotification and logs error on fetch failure", async () => {
      global.fetch = vi.fn(() => Promise.reject("Network error"));

      document.body.innerHTML = `<div id="notification" class="hidden"></div>`;

      const consoleErrorMock = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { translationModule } = await importTranslationModule();
      await translationModule.loadLanguage("pt");

      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
      expect(showNotificationMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateTexts() function", () => {
    it("should update textContent when translation has data-i18n", async () => {
      document.body.innerHTML = `<p data-i18n="title"></p>`;

      const { translationModule } = await importTranslationModule();
      translationModule._setTranslations(MOCK_EN_TRANSLATION);

      translationModule.updateTexts();

      const element = document.querySelector("p");
      expect(element.textContent).toBe("Image Optimizer");
    });

    it("should update innerHtml when translation has data-i18n", async () => {
      document.body.innerHTML = `<p data-i18n="title"></p>`;

      const { translationModule } = await importTranslationModule();
      translationModule._setTranslations({
        title: "<span class='text-red-500'>Image Optimizer</span>",
      });

      translationModule.updateTexts();

      const element = document.querySelector("p");
      expect(element.textContent).toBe("Image Optimizer");
      expect(element.classList.contains("text-red-500"));
    });
  });

  describe("updateActiveButton() function", () => {
    it("should add 'scale-120' class to the active language button", async () => {
      document.body.innerHTML = `
        <button data-lang="pt" title="Português">🇧🇷</button>
        <button data-lang="en" title="English">🇺🇸</button>
      `;

      const buttons = document.querySelectorAll("button[data-lang]");

      const { translationModule } = await importTranslationModule();
      translationModule.updateActiveButton(buttons, "en");

      const ptButton = document.querySelector('button[data-lang="pt"]');
      const enButton = document.querySelector('button[data-lang="en"]');

      expect(ptButton.classList.contains("scale-120")).toBe(false);
      expect(enButton.classList.contains("scale-120")).toBe(true);
    });

    it("should remove 'scale-120' class from buttons not matching active language", async () => {
      document.body.innerHTML = `
        <button data-lang="pt" title="Português">🇧🇷</button>
        <button data-lang="en" title="English" class="scale-120">🇺🇸</button>
      `;

      const buttons = document.querySelectorAll("button[data-lang]");

      const { translationModule } = await importTranslationModule();
      translationModule.updateActiveButton(buttons, "pt");

      const ptButton = document.querySelector('button[data-lang="pt"]');
      const enButton = document.querySelector('button[data-lang="en"]');

      expect(ptButton.classList.contains("scale-120")).toBe(true);
      expect(enButton.classList.contains("scale-120")).toBe(false);
    });

    it("should not add 'scale-120' class if activeLang does not match any button", async () => {
      document.body.innerHTML = `
        <button data-lang="pt" title="Português">🇧🇷</button>
        <button data-lang="en" title="English" class="scale-120">🇺🇸</button>
      `;
      const buttons = document.querySelectorAll("button[data-lang]");

      const { translationModule } = await importTranslationModule();
      translationModule.updateActiveButton(buttons, "jp");

      buttons.forEach((btn) => {
        expect(btn.classList.contains("scale-120")).toBe(false);
      });
    });
  });
});
