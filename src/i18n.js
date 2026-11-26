/**
 * @file i18n.js
 * @description i18next configuration for multi-language support.
 *
 * Supported languages: English (en), Arabic (ar).
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
import moment from "moment"
// moment locales have to be registered before moment.locale() can select them. These are
// the ESM ones (moment/dist/locale), the same copy date_formater.js and the calendar use.
import "moment/dist/locale/ar"

// moment keeps ONE global locale, and every moment(...).format("MMM", "dddd", ...) in the
// app (date_formater.js and the screens) follows it: Arabic month / day names and Arabic
// digits only appear while that locale is "ar". Until now only a few screens set it, so a
// reload in Arabic left it on English for every other screen. It is set here, on startup
// and on every language change, so no screen has to remember to.
// the app is used in English and Arabic only
const MOMENT_LOCALES = ["ar"]
const syncMomentLocale = (lng) => {
  const code = String(lng || "en").split("-")[0]
  moment.locale(MOMENT_LOCALES.includes(code) ? code : "en")
}
i18n.on("languageChanged", syncMomentLocale)

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
  .then(() => syncMomentLocale(i18n.language))
  .catch(() => {})

export default i18n
