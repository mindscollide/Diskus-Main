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
        
        locale={{ page: ` ${"/"}${t("page")}` }}
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
