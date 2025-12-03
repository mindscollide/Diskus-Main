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
