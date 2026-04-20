/**
 * @file i18n.js
 * @description Internationalisation (i18n) configuration for the application
 * using `i18next` with the following plugins:
 *
 *  - **`i18next-http-backend`** – Lazily loads translation JSON files from the
 *    server (typically from `/public/locales/{lng}/translation.json`).
 *  - **`react-i18next`** – Binds i18next to React via the `useTranslation` hook
 *    and `<Trans>` component.
 *  - **`i18next-browser-languagedetector`** – Automatically detects the user's
 *    preferred language via (in priority order): URL path, localStorage, HTML
 *    `lang` attribute, and cookie.  Detected language is cached to a cookie.
 *
 * Configuration:
 *  - `fallbackLng: "en"` – Falls back to English when a translation key is
 *    missing for the active language.
 *  - Supports Arabic (`ar`) and French (`fr`) in addition to English (`en`).
 *
 * Import this file once (in `index.js`) before any component renders so that
 * the `useTranslation` hook has access to the initialised instance.
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
      // caches: ["localStorage", "cookie"], // cache user language on
      caches: ["cookie"], // cache user language on
    },
    // interpolation: {
    //   escapeValue: false // react already safes from xss
    // },
    react: {
      // wait: false,
      // useSuspense: false,
    },
  })

export default i18n
