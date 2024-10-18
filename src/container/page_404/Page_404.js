import React from "react";
import "./Page_404.css";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  //For Localization
  const { t } = useTranslation();
  console.log("organizatioName", localStorage.getItem("organizatioName"));
  return (
    <>
      <div className="user-select">
        <div className="user-select-content-container NotFound-PAGE">
          <div className="heading-main h-xl fw-bold text-center margin-top-100">
            <p className="p-0 page-404-title">{t("Error-404")}</p>
            <p className="p-0 age-404-message">
              {t("This-page-could-not-be-found")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
