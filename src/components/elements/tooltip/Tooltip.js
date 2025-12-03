import React from "react";
import "./Tooltip.css";

const Tooltip = ({ text, children }) => {
  let currentLang = localStorage.getItem("i18nextLng");
  , "currentLangcurrentLangcurrentLang");
  return (
    <div className="tooltip-container">
      {children}
      <div
        className={
          localStorage.getItem("i18nextLng") === "ar"
            ? "tooltip-text-ar"
            : "tooltip-text"
        }
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
