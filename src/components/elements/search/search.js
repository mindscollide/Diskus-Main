import React from "react";

import "./search.css";

const SearchInput = ({
  inputBox,
  type,
  inputFieldStyle,
  searchIconStyle,
  onclick,
  inputClass,
  placeholder,
  onchange,
  icon,
}) => {
  return (
    <>
      <div className={inputBox}>
        <div className={searchIconStyle} onClick={onclick}>
          {icon}
        </div>
        <div className={inputClass}>
          <input
            type={type}
            className={inputFieldStyle}
            onChange={onchange}
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  );
};
export default SearchInput;
