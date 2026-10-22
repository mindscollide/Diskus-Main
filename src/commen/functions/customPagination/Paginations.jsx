/**
 * antd `<Pagination>` with the page numbers localised for Arabic.
 *
 * antd renders Western digits regardless of locale, so `itemRender` below
 * replaces the page-number glyphs when the UI language is `ar`. Everything else
 * — prev/next arrows, the size changer — is left as antd's original element.
 *
 * ── Two things to know before reusing or editing this ────────────────────────
 *
 * 1. It uses a DIFFERENT digit set from the rest of the app. The map here is
 *    U+06F0-U+06F9 (Extended Arabic-Indic, i.e. the Persian glyphs ۰۱۲۳),
 *    whereas commen/functions/regex.js converts with `0x0660 + digit`, which is
 *    U+0660-U+0669 (Arabic-Indic ٠١٢٣). Both display as "Arabic numerals" but
 *    they are distinct characters and render differently. Anything that has to
 *    agree visually with the rest of the UI should use the regex.js helpers;
 *    this local copy is the odd one out.
 *
 * 2. `arabicNumbers` is ELEVEN characters — there is a stray duplicate U+06F1 at
 *    index 10. Harmless today because `charAt` is only ever called with 0-9, but
 *    it is a trap for anyone who indexes past 9 or takes `.length` as 10.
 *
 * Locale for the digits is read from localStorage (`i18nextLng`) rather than
 * from `useTranslation`, so it is captured at render and does not react to a
 * language change until the component re-renders for some other reason.
 *
 * @param {number}   current              1-based current page
 * @param {number}   pageSize             rows per page
 * @param {number}   total                total row count (antd derives the page count)
 * @param {Function} onChange             (page, pageSize) => void
 * @param {string[]} pageSizeOptionsValues options for the size changer
 * @param {string}   className            passed through to antd
 * @param {boolean}  showSizer            show the page-size changer
 */
import React from "react";
import { Pagination } from "antd";
import Select, { components } from "react-select";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../utils";

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptionsValues,
  className,
  showSizer,
}) => {
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { t } = useTranslation();

  function convertNumberToLetter(num) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    return num
      .toString()
      .split("")
      .map((c) => arabicNumbers.charAt(Number(c)))
      .join("");
  }

  const displayNumber = (num) =>
    currentLanguage === "ar" ? convertNumberToLetter(num) : formatNumber(num);

  // itemRender: formats the current page number shown inside the Pagination component
  function itemRender(current, type, originalElement) {
    if (type === "page") {
      return (
        <span className='todolist-pagination-current'>
          {displayNumber(current)}
        </span>
      );
    }
    return originalElement;
  }

  const options = showSizer
    ? pageSizeOptionsValues.map((val) => ({
        value: Number(val),
        label: `${displayNumber(val)} / ${t("Page")}`,
      }))
    : [];

  // Number(pageSize) added so string vs number mismatch doesn't break the match
  const selectedOption = showSizer
    ? options.find((opt) => opt.value === Number(pageSize))
    : null;

  const handleSizeChange = (selected) => {
    onChange(1, selected.value);
  };

  // Custom MenuList: renders options in a 2-column grid instead of a vertical list
  const GridMenuList = (props) => {
    return (
      <components.MenuList {...props}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4px",
            padding: "4px",
            width: "220px",
          }}>
          {props.children}
        </div>
      </components.MenuList>
    );
  };

  // Custom Option: removes default full-width row styling so it fits the grid cell
  const GridOption = (props) => {
    return (
      <components.Option {...props}>
        <div style={{ textAlign: "center" }}>{props.data.label}</div>
      </components.Option>
    );
  };

  return (
    <div className={"Global_pagination_styles"}>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        className={className}
        itemRender={itemRender}
        showSizeChanger={false}
        
        locale={{ page: ` ${"/"}${t("Page")}` }}
      />
      {showSizer && (
        <Select
          value={selectedOption}
          onChange={handleSizeChange}
          options={options}
          // isRtl={currentLanguage === "ar"}
          isSearchable={false}
          classNamePrefix={"Pagination_pagesizer"}
          menuPortalTarget={document.body}
          components={{ MenuList: GridMenuList, Option: GridOption }}
          styles={{
            option: (base, state) => ({
              ...base,
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: state.isSelected
                ? "#1677ff"
                : state.isFocused
                  ? "#f0f5ff"
                  : "transparent",
              color: state.isSelected ? "#fff" : "#000",
            }),
            menu: (base) => ({
              ...base,
              width: "max-content",
              minWidth: "160px",
            }),
          }}
        />
      )}
    </div>
  );
};

export default CustomPagination;
