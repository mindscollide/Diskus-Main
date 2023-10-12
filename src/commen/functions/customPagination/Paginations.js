import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination, Select } from "antd";
import { convertToArabicNumber } from "./utils"; // Import the function to convert to Arabic number

const CustomPagination = ({
  currentValue,
  pageSize,
  total,
  onChange,
  onShowSizeChange,
  pageSizeOptions,
  className,
}) => {
  const { t, i18n } = useTranslation();

  const handleChange = (page, pageSize) => {
    onChange(page, pageSize);
  };

  const handleSizeChange = (current, size) => {
    onShowSizeChange(current, size);
  };

  const itemRender = (current, type, originalElement) => {
    if (type === "page") {
      return (
        <span title={t("page", { page: current })}>
          {i18n.language === "ar" ? convertToArabicNumber(current) : current}
        </span>
      );
    }
    return originalElement;
  };

  const renderPageSizeOptions = () => {
    return pageSizeOptions.map((option) => (
      <Select.Option key={option} value={parseInt(option)}>
        {i18n.language === "ar" ? convertToArabicNumber(option) : option}
      </Select.Option>
    ));
  };

  return (
    <>
      <Pagination
        current={currentValue}
        pageSize={pageSize}
        total={total}
        onChange={handleChange}
        onShowSizeChange={handleChange}
        pageSizeOptions={pageSizeOptions}
        className={className}
        itemRender={itemRender}
        showSizeChanger={false} // Show the page size dropdown
        showQuickJumper={false} // Hide the quick jumper input
        locale={{ items_per_page: t("items_per_page"), page: t("page") }}
      />
      <Select
        value={pageSize}
        onChange={(current, size) => handleChange(current, size)}
        className="ml-2"
      >
        {renderPageSizeOptions()}
      </Select>
    </>
  );
};

export default CustomPagination;
