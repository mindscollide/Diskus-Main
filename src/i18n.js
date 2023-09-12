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
