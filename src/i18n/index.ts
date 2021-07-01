import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./ko.json";
import en from "./en.json";
import zhHans from "./zh-hans.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
      ko,
      zhHans
    },
    lng: "ko",
    fallbackLng: "ko",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

