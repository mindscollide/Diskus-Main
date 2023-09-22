import React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import LanguageIcon from "../../../assets/images/Language.svg";
import LanguageArrowDown from "../../../assets/images/New folder/LanguaugeSelector_Down.svg";
import LanguageArrowUp from "../../../assets/images/New folder/LanguaugeSelector_Up.svg";
import LanguageArrowDownBlack from "../../../assets/images/New folder/Language_ArrowDown.svg";
import LanguageArrowUpBlack from "../../../assets/images/New folder/Language_ArrowUp.svg";
import LanguageBlack from "../../../assets/images/Language_Black.svg";
import styles from "./Language-selector.module.css";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "./../../elements";
import Cookies from "js-cookie";
import numeral from "numeral";
import {
  getAllLanguages,
  getSelectedLanguage,
  changeNewLanguage,
} from "../../../store/actions/Language_actions";

const LanguageSelector = () => {
  const { LanguageReducer } = useSelector((state) => state);

  console.log("LanguageReducer", LanguageReducer);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let currentUserID = Number(localStorage.getItem("userID"));

  const languageref = useRef();
  const location = useLocation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [languageforView, setLanguageforView] = useState("");
  const currentLocale = Cookies.get("i18next") || "en";
  const [language, setLanguage] = useState(currentLocale);
  const { t, i18n } = useTranslation();

  const [languages, setLanguages] = useState([]);
  console.log(languages, "languageslanguageslanguages");
  const [selectedLanguage, setSelectedLanguage] = useState({
    systemSupportedLanguageID: 1,
    languageTitle: "English",
    code: "en",
  });

  useEffect(() => {
    dispatch(getAllLanguages(navigate, t));
  }, []);

  useEffect(() => {
    if (
      currentUserID !== null &&
      currentUserID !== undefined &&
      currentUserID !== 0
    ) {
      let data = { UserID: currentUserID };
      dispatch(getSelectedLanguage(data, navigate, t));
    }
  }, []);

  useEffect(() => {
    if (
      LanguageReducer.AllLanguagesData !== null &&
      LanguageReducer.AllLanguagesData !== undefined &&
      LanguageReducer.AllLanguagesData.length !== 0
    ) {
      setLanguages(LanguageReducer?.AllLanguagesData);
    }
  }, [LanguageReducer.AllLanguagesData]);

  useEffect(() => {
    if (
      LanguageReducer.SetLanguageData !== null &&
      LanguageReducer.SetLanguageData !== undefined &&
      LanguageReducer.SetLanguageData.length !== 0
    ) {
      setSelectedLanguage({
        ...selectedLanguage,
        systemSupportedLanguageID:
          LanguageReducer.SetLanguageData.systemSupportedLanguageID,
        languageTitle: LanguageReducer.SetLanguageData.languageTitle,
        code:
          LanguageReducer.SetLanguageData.systemSupportedLanguageID === 1
            ? "en"
            : LanguageReducer.SetLanguageData.systemSupportedLanguageID === 2
            ? "ar"
            : LanguageReducer.SetLanguageData.systemSupportedLanguageID === 3
            ? "fr"
            : "",
      });
    }
  }, [LanguageReducer.SetLanguageData]);

  const handleChangeLocale = (lang) => {
    setLanguageDropdown(false);
    // setLanguage(lang)
    let data = {
      UserID: currentUserID,
      SystemSupportedLanguageID: lang,
    };
    dispatch(changeNewLanguage(data, navigate, t));
    if (lang === 1) {
      setSelectedLanguage({
        languageTitle: "English",
        systemSupportedLanguageID: 1,
        code: "en",
      });
      localStorage.setItem("i18nextLng", "en");
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

      setTimeout(() => {
        // window.location.reload()
        i18n.changeLanguage("ar");
      }, 100);
    } else {
      setSelectedLanguage({
        languageTitle: "French",
        systemSupportedLanguageID: 3,
        code: "fr",
      });
      localStorage.setItem("i18nextLng", "fr");
      setTimeout(() => {
        // window.location.reload()
        i18n.changeLanguage("fr");
      }, 1000);
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

  // useEffect(() => {
  //   let currentLanguage = localStorage.getItem("i18nextLng");
  //   const currentLangObj = languages.find(
  //     (lang) => lang.systemSupportedLanguageID === Number(currentLanguage)
  //   );
  //   let currentLanguageforDiskus =
  //     currentLangObj?.systemSupportedLanguageID === 1
  //       ? "en"
  //       : currentLangObj?.systemSupportedLanguageID === 2
  //       ? "ar"
  //       : currentLangObj?.systemSupportedLanguageID === 3
  //       ? "fr"
  //       : "";
  //   // if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  //   //   setTimeout(() => {
  //   //     i18n.changeLanguage(currentLanguageforDiskus)
  //   //     document.body.dir = currentLanguageforDiskus.dir || 'ltr'
  //   //   }, 1000)
  //   // }
  // }, [i18n]);

  useEffect(() => {
    if (currentLanguage === "ar") {
      document.body.dir = "rtl";
      i18n.changeLanguage("ar");
    } else if (currentLanguage === "fr") {
      document.body.dir = "ltr";
      i18n.changeLanguage("fr");
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
          location.pathname.includes("/Diskus/") ||
          location.pathname.includes("/paymentForm") ||
          location.pathname.includes("/signuporganization") ||
          location.pathname.includes("/Diskus/Admin")
            ? "text-white d-flex gap-2 align-items-center position-relative cursor-pointer"
            : "text-black d-flex gap-2 align-items-center position-relative cursor-pointer"
        }
      >
        <img
          src={
            location.pathname.includes("/DisKus/") ||
            location.pathname.includes("/Diskus/") ||
            location.pathname.includes("/paymentForm") ||
            location.pathname.includes("/signuporganization") ||
            location.pathname.includes("/Diskus/Admin")
              ? LanguageIcon
              : LanguageBlack
          }
          alt=""
          draggable="false"
        />
        {/* {selectedLanguage.languageTitle} */}
        {currentLanguage === "en"
          ? "English"
          : currentLanguage === "ar"
          ? "Arabic"
          : currentLanguage === "fr"
          ? "French"
          : "English"}
        {languageDropdown ? (
          <img
            src={
              location.pathname.includes("/DisKus") ||
              location.pathname.includes("/Diskus")
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
              location.pathname.includes("/DisKus") ||
              location.pathname.includes("/Diskus")
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
      {/* {LanguageReducer.Loading === true ? <Loader /> : null} */}
    </section>
  );
};

export default LanguageSelector;
