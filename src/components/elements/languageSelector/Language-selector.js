import React from "react";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import LanguageIcon from "../../../assets/images/Language.svg";
import LanguageBlack from "../../../assets/images/Language_Black.svg";
import styles from "./Language-selector.module.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import moment from "moment";
import numeral from "numeral";

const LanguageSelector = () => {
  const languageref = useRef();
  const location = useLocation();
  console.log(location, "locationlocationlocationlocationlocation");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [languageforView, setLanguageforView] = useState("");
  const currentLocale = Cookies.get("i18next") || "en";
  console.log(currentLocale, "currentLocalecurrentLocale");
  const [language, setLanguage] = useState(currentLocale);
  const { t, i18n } = useTranslation();
  // Languages
  const languages = [
    { name: "English", code: "en" },
    // { name: "日本語", code: "ja" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];
  useEffect(() => {
    if (language !== null) {
      let currentLanguageForView = languages.filter(
        (data, index) => data.code === language
      );
      console.log(
        currentLanguageForView,
        "currentLanguageForViewcurrentLanguageForViewcurrentLanguageForView"
      );
      setLanguageforView(currentLanguageForView[0].name);
    }
  }, []);
  const handleChangeLocale = (lang) => {
    setLanguageDropdown(false);
    setLanguage(lang);

    let currentLanguageForView = languages.filter(
      (data, index) => data.code === lang
    );
    console.log(
      currentLanguageForView,
      "currentLanguageForViewcurrentLanguageForViewcurrentLanguageForView"
    );
    setLanguageforView(currentLanguageForView[0].name);
    numeral.locale(currentLanguageForView[0].code);
    localStorage.setItem("i18nextLng", lang);

    window.location.reload();
  };
  const handleOutsideClick = (event) => {
    if (
      languageref.current &&
      !languageref.current.contains(event.target) &&
      languageDropdown
    ) {
      setLanguageDropdown(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [languageDropdown]);

  useEffect(() => {
    let currentLanguage = localStorage.getItem("i18nextLng");
    const currentLangObj = languages.find(
      (lang) => lang.code === currentLanguage
    );
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      setTimeout(() => {
        i18n.changeLanguage(currentLanguage);
        document.body.dir = currentLangObj.dir || "ltr";
      }, 1000);
    }
  }, [i18n]);
  return (
    <section className="position-relative" ref={languageref}>
      <span
        className={
          location.pathname.includes("/DisKus/") ||
            location.pathname.includes("/paymentForm") ||
            location.pathname.includes("/signuporganization") ||
            location.pathname.includes("/Diskus/Admin")
            ? "text-white d-flex gap-2 align-items-center position-relative cursor-pointer"
            : "text-black d-flex gap-2 align-items-center position-relative cursor-pointer"
        }
        onClick={() => setLanguageDropdown(!languageDropdown)}
      >
        <img
          src={
            location.pathname.includes("/DisKus/") ||
              location.pathname.includes("/paymentForm") ||
              location.pathname.includes("/signuporganization") ||
              location.pathname.includes("/Diskus/Admin")
              ? LanguageIcon
              : LanguageBlack
          }
        />
        {languageforView}
        {languageDropdown ? (
          <ChevronUp fontWeight={"bold"} />
        ) : (
          <ChevronDown fontWeight={"bold"} />
        )}
      </span>
      <div
        className={
          !languageDropdown
            ? styles["language_options"]
            : styles["language_options_active"]
        }
      >
        {languages.map((data, index) => {
          return (
            <span
              className="cursor-pointer"
              onClick={() => handleChangeLocale(data.code)}
            >
              {data.name}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default LanguageSelector;
