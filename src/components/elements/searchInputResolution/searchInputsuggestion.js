import React, { useState } from "react";
import Select from "react-select";
import "./searchInputsuggestion.css";
/**
 * @component SearchSelect
 * @description A searchable select input built on top of `react-select`. Maintains its own
 * input value state and a filtered options list derived from an internal (currently empty)
 * options array. The component is designed as a self-contained search-with-suggestions
 * control; the options list can be populated and filtered by extending `handleInputChange`.
 * Uses the `input_suggestion_resolution` class prefix for custom CSS styling.
 *
 * @example
 * <SearchSelect />
 */
const SearchSelect = () => {
  const options = [];

  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  return (
    <Select
      classNamePrefix={"input_suggestion_resolution"}
      options={filteredOptions}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      isSearchable
      placeholder="Search..."
    />
  );
};

export default SearchSelect;
