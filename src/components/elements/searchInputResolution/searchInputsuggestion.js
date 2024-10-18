import React, { useState } from "react";
import Select from "react-select";
import "./searchInputsuggestion.css";
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
