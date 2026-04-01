/**
 * @file i18n.js
 * @description i18next configuration for multi-language support.
 *
 * Supported languages: English (en), Arabic (ar), French (fr), Japanese (ja).
 * Fallback language: English.
 *
 * Translation files are loaded on-demand from /public/locales/<lang>/translation.json
 * via i18next-http-backend.
 *
 * Language detection order: URL path → localStorage → htmlTag → cookie.
 * Detected language is cached in a cookie.
 *
 * RTL layout for Arabic is handled by src/ar.css (imported in App.js).
 *
 * @see docs/I18N.md for usage guide and instructions for adding new languages/keys
 */
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    detection: {
      order: ["path", "localStorage", "htmlTag", "cookie"],
      caches: ["cookie"],
    },
    react: {},
  })

export default i18n
