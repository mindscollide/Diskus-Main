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
import { useTranslation } from "react-i18next";
import { Pagination } from "antd";

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
    const arabicNumbers = "۰۱۲۳۴۵۶۷۸۹۱";
    let result = "";
    const str = num.toString();
    for (let c of str) {
      result += arabicNumbers.charAt(c);
    }
    return result;
  }

  function itemRender(current, type, originalElement) {
    if (type === "page") {
      if (currentLanguage === "ar") {
        return (
          <span className="todolist-pagination-current">
            {convertNumberToLetter(current)}
          </span>
        );
      } else {
        return <span className="todolist-pagination-current">{current}</span>;
      }
    }
    return originalElement;
  }

  return (
    <>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        pageSizeOptions={pageSizeOptionsValues}
        className={className}
        itemRender={itemRender}
        showSizeChanger={showSizer}
        locale={{
          page: ` ${"/"}${t("page")}`,
        }}
      />
    </>
  );
};

export default CustomPagination;
