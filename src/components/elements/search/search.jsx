import React from "react";

import "./search.css";

/**
 * @component SearchInput
 * @description A composable search field made up of an icon area and a text input.
 * All visual concerns (wrapper class, icon position, input styling) are controlled
 * entirely through props, making the component reusable across different contexts
 * (header search, modal filters, inline list search, etc.) without needing CSS
 * overrides at the call site.
 *
 * @param {string}    inputBox         - CSS class applied to the outermost wrapper div.
 * @param {string}    type             - HTML input type (typically "text" or "search").
 * @param {string}    inputFieldStyle  - CSS class applied directly to the `<input>` element.
 * @param {string}    searchIconStyle  - CSS class applied to the icon container div.
 * @param {Function}  onclick          - Click handler attached to the icon container.
 * @param {string}    inputClass       - CSS class applied to the div that wraps the `<input>`.
 * @param {string}    placeholder      - Placeholder text shown when the input is empty.
 * @param {Function}  onchange         - Change handler fired on every keystroke in the input.
 * @param {ReactNode} icon             - Icon element rendered inside the icon container.
 *
 * @example
 * <SearchInput
 *   inputBox="search-wrapper"
 *   type="text"
 *   placeholder="Search committees..."
 *   icon={<SearchIcon />}
 *   onchange={handleSearch}
 *   searchIconStyle="search-icon"
 *   inputFieldStyle="search-field"
 *   inputClass="search-input-wrapper"
 * />
 */
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
