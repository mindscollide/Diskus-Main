import React from "react";
import "./Tooltip.css";

/**
 * @component Tooltip
 * @description A lightweight custom tooltip that wraps any child element and
 * displays a floating text label on hover. The tooltip position/style adapts
 * to the active UI language: Arabic (`ar`) uses the `tooltip-text-ar` class
 * (typically right-aligned) while all other languages fall back to `tooltip-text`
 * (typically left-aligned). The language preference is read from `localStorage`
 * (key: `i18nextLng`) on every render.
 *
 * @param {string}    text     - The tooltip label text to display on hover.
 * @param {ReactNode} children - The element(s) that trigger the tooltip on hover.
 *
 * @example
 * <Tooltip text="Edit committee">
 *   <img src={editIcon} alt="Edit" />
 * </Tooltip>
 */
const Tooltip = ({ text, children }) => {
  let currentLang = localStorage.getItem("i18nextLng");
  console.log(JSON.stringify(currentLang), "currentLangcurrentLangcurrentLang");
  return (
    <div className="tooltip-container">
      {children}
      {/* Switch tooltip alignment class based on current language direction */}
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
