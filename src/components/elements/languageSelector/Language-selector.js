import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import LanguageArrowDown from "../../../assets/images/New folder/LanguaugeSelector_Down.svg";
import LanguageArrowUp from "../../../assets/images/New folder/LanguaugeSelector_Up.svg";
import LanguageArrowDownBlack from "../../../assets/images/New folder/Language_ArrowDown.svg";
import LanguageArrowUpBlack from "../../../assets/images/New folder/Language_ArrowUp.svg";
import styles from "./Language-selector.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getAllLanguages,
  getSelectedLanguage,
  changeNewLanguage,
} from "../../../store/actions/Language_actions";
import moment from "moment";

const LanguageSelector = () => {
  const AllLanguagesData = useSelector(
    (state) => state.LanguageReducer.AllLanguagesData
  );
  const SetLanguageData = useSelector(
    (state) => state.LanguageReducer.SetLanguageData
  );
  const navigate = useNavigate();

  const dispatch = useDispatch();

  let currentUserID = localStorage.getItem("userID");

  const languageref = useRef();
  const location = useLocation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const { t, i18n } = useTranslation();

  const [languages, setLanguages] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState({
    systemSupportedLanguageID: 1,
    languageTitle: "English",
    code: "en",
  });

  useEffect(() => {
    try {
      if (
        AllLanguagesData === null ||
        AllLanguagesData === undefined ||
        AllLanguagesData.length === 0
      ) {
        dispatch(getAllLanguages(navigate, t));
      }
      // if (currentUserID !== null) {
      //   let data = { UserID: Number(currentUserID) };
      //   dispatch(getSelectedLanguage(data, navigate, t));
      // }
    } catch {}
  }, []);

  useEffect(() => {
    if (
      AllLanguagesData !== null &&
      AllLanguagesData !== undefined &&
      AllLanguagesData.length !== 0
    ) {
      const newValues = AllLanguagesData.map((langValues) => ({
        languageTitle:
          langValues.systemSupportedLanguageID === 1
            ? t("English")
            : langValues.systemSupportedLanguageID === 2
            ? t("Arabic")
            : "",
        systemSupportedLanguageID: langValues.systemSupportedLanguageID,
        code:
          langValues.systemSupportedLanguageID === 1
            ? "en"
            : langValues.systemSupportedLanguageID === 2
            ? "ar"
            : "",
      })).filter((langValues) => langValues.systemSupportedLanguageID !== 3);

      setLanguages(newValues);
    }
  }, [AllLanguagesData]);

  useEffect(() => {
    if (
      SetLanguageData !== null &&
      SetLanguageData !== undefined &&
      SetLanguageData.length !== 0
    ) {
      setSelectedLanguage({
        ...selectedLanguage,
        systemSupportedLanguageID: SetLanguageData.systemSupportedLanguageID,
        languageTitle: SetLanguageData.languageTitle,
        code:
          SetLanguageData.systemSupportedLanguageID === 1
            ? "en"
            : SetLanguageData.systemSupportedLanguageID === 2
            ? "ar"
            : "",
      });
    }
  }, [SetLanguageData]);

  const handleChangeLocale = (lang) => {
    setLanguageDropdown(false);
    // setLanguage(lang)
    let data = {
      UserID: Number(currentUserID),
      SystemSupportedLanguageID: lang,
    };
    if (currentUserID !== null) {
      dispatch(changeNewLanguage(data, navigate, t));
    }
    if (lang === 1) {
      setSelectedLanguage({
        languageTitle: "English",
        systemSupportedLanguageID: 1,
        code: "en",
      });
      localStorage.setItem("i18nextLng", "en");
      moment.locale("en");
      setTimeout(() => {
        // window.location.reload()
        i18n.changeLanguage("en");
      }, 100);
    } else if (lang === 2) {
      setSelectedLanguage({
        languageTitle: "Arabic",
        systemSupportedLanguageID: 2,
        code: "ar",
      });
      localStorage.setItem("i18nextLng", "ar");
      moment.locale("ar");
      setTimeout(() => {
        i18n.changeLanguage("ar");
      }, 100);
    }
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
    if (currentLanguage === "ar") {
      document.body.dir = "rtl";
      i18n.changeLanguage("ar");
    } else {
      document.body.dir = "ltr";
      i18n.changeLanguage("en");
    }
  }, [currentLanguage]);

  return (
    <section
      className="position-relative"
      ref={languageref}
      onClick={() => setLanguageDropdown(!languageDropdown)}
    >
      <span
        className={
          location.pathname.includes("/DisKus/") ||
          location.pathname.includes("/Diskus") ||
          location.pathname.includes("/Diskus/") ||
          location.pathname.includes("/paymentForm") ||
          location.pathname.includes("/signuporganization") ||
          location.pathname.includes("/Admin")
            ? "text-white d-flex gap-2 align-items-center position-relative cursor-pointer"
            : "text-black d-flex gap-2 align-items-center position-relative cursor-pointer"
        }
      >
        {/* {selectedLanguage.languageTitle} */}
        {currentLanguage === "en"
          ? t("EN")
          : currentLanguage === "ar"
          ? t("Arabic")
          : t("EN")}
        {languageDropdown ? (
          <img
            src={
              location.pathname.includes("/DisKus/") ||
              location.pathname.includes("/Diskus/") ||
              location.pathname.includes("/Diskus") ||
              location.pathname.includes("/paymentForm") ||
              location.pathname.includes("/signuporganization") ||
              location.pathname.includes("/Admin")
                ? LanguageArrowUp
                : LanguageArrowUpBlack
            }
            onClick={() => setLanguageDropdown(!languageDropdown)}
            alt=""
            draggable="false"
          />
        ) : (
          <img
            src={
              location.pathname.includes("/DisKus/") ||
              location.pathname.includes("/Diskus/") ||
              location.pathname.includes("/Diskus") ||
              location.pathname.includes("/paymentForm") ||
              location.pathname.includes("/signuporganization") ||
              location.pathname.includes("/Admin")
                ? LanguageArrowDown
                : LanguageArrowDownBlack
            }
            onClick={() => setLanguageDropdown(!languageDropdown)}
            alt=""
            draggable="false"
          />
        )}
      </span>
      <div
        className={
          !languageDropdown
            ? styles["language_options"]
            : styles["language_options_active"]
        }
      >
        {languages.length > 0 &&
          languages.map((data, index) => {
            return (
              <span
                className="cursor-pointer"
                onClick={() =>
                  handleChangeLocale(data.systemSupportedLanguageID)
                }
                key={index}
              >
                {data.languageTitle}
              </span>
            );
          })}
      </div>
    </section>
  );
};

export default LanguageSelector;
