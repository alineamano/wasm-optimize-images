/**
 * The currently active language code (e.g., "en", "pt").
 * @type {string}
 */
let currentLang = "pt";

/**
 * An object containing key-value pairs for translated strings.
 * Keys are translation identifiers (e.g., "title"), and values are the translated texts.
 * @type {Object.<string, string>}
 */
let translations = {};

/**
 * Loads the translation JSON file for the specified language and updates the UI texts.
 *
 * @async
 * @param {string} [lang="pt"] - Language code to load (e.g., "en", "pt").
 * @returns {Promise<void>} A promise that resolves when the translations are loaded and texts updated.
 */
export async function loadLanguage(lang = "pt") {
  const response = await fetch(`./i18n/${lang}.json`);
  translations = await response.json();
  currentLang = lang;
  updateTexts();
}

/**
 * Retrieves the translated string for the given key.
 *
 * @param {string} key - The translation key (e.g., "title", "compress_button").
 * @returns {string} The translated text if found, otherwise the key itself.
 */
export function t(key) {
  return translations[key] || key;
}

/**
 * Updates the text content of all elements that have a `data-i18n` attribute.
 * The function will replace the text content of the element
 * with the corresponding translation from the loaded language file.
 *
 * @returns {void}
 */
export function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translated = t(key);

    if (typeof translated === "string" && translated.length > 0) {
      const hasHTML = /<\/?[a-z][\s\S]*>/i.test(translated);
      if (hasHTML) {
        element.innerHTML = translated;
      } else {
        element.textContent = translated;
      }
    }
  });
}

/**
 * Sets up the language selector buttons with click event listeners.
 * On click, loads the selected language and updates UI texts.
 * Also updates button styles to indicate the active language.
 *
 * @returns {void}
 */
export function setupLanguageSelector() {
  const selector = document.getElementById("language-selector");
  if (!selector) return;

  const buttons = selector.querySelectorAll("button[data-lang]");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const selectedLang = button.dataset.lang;
      if (selectedLang && selectedLang !== currentLang) {
        await loadLanguage(selectedLang);
        updateActiveButton(buttons, selectedLang);
      }
    });
  });

  // Set active button on load
  updateActiveButton(buttons, currentLang);
}

/**
 * Updates the visual state of language buttons to reflect the active language.
 *
 * @param {NodeListOf<HTMLButtonElement>} buttons - The language selector buttons.
 * @param {string} activeLang - The currently active language code.
 * @returns {void}
 */
function updateActiveButton(buttons, activeLang) {
  buttons.forEach((btn) => {
    if (btn.dataset.lang === activeLang) {
      btn.classList.add("scale-120");
    } else {
      btn.classList.remove("scale-120");
    }
  });
}
