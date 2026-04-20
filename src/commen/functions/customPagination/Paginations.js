/**
 * @file customPagination/Paginations.js
 * @description Ant Design `<Pagination>` wrapper that renders page numbers as
 * Arabic Eastern numerals when the active locale is `"ar"`.  Exposes the same
 * props as Ant's Pagination plus a `pageSizeOptionsValues` convenience prop.
 */
import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "antd";

/**
 * Locale-aware pagination component.
 *
 * @param {object}   props
 * @param {number}   props.current               - Currently active page (1-based).
 * @param {number}   props.pageSize              - Number of items per page.
 * @param {number}   props.total                 - Total number of items.
 * @param {Function} props.onChange              - `(page, pageSize) => void` callback.
 * @param {number[]} props.pageSizeOptionsValues - Available page-size options.
 * @param {string}   [props.className]           - Additional CSS class names.
 * @param {boolean}  [props.showSizer]           - Whether to show the page-size
 *   changer (`showSizeChanger`).
 * @returns {JSX.Element}
 */
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
