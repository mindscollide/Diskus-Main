import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination, Select } from "antd";

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
  const arabicNumbers = "۰۱۲۳۴۵۶۷۸۹۱";
  function convertNumberToLetter(num) {
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
          <span className='todolist-pagination-current'>
            {convertNumberToLetter(current)}
          </span>
        );
      } else {
        return <span className='todolist-pagination-current'>{current}</span>;
      }
    }
    return originalElement;
  }

  // const renderPageSizeOptions = () => {
  //   return pageSizeOptions.map((option) => (
  //     <Select.Option key={option} value={parseInt(option)}>
  //       {i18n.language === "ar" ? convertToArabicNumber(option) : option}
  //     </Select.Option>
  //   ));
  // };

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
        // showSizeChanger={false} // Show the page size dropdown
        locale={{
          // items_per_page: t("items_per_page"),
          page: ` ${"/"}${t("page")}`,
        }}
      />
    </>
  );
};

export default CustomPagination;
