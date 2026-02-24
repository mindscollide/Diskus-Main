import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
// import styles from "./tagSelectDropdown.module.css";

export const TagSelectDropdown = ({
  tagsOptions = [],
  loadOptions,
  selectedTags = [],
  onChangeTag,
  disabled = false,
}) => {
  const MAX_TAG_LENGTH = 25;
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue, actionMeta) => {
    if (actionMeta.action !== "input-change") return newValue;

    // remove leading spaces
    let trimmed = newValue.replace(/^\s+/, "");

    // enforce max length
    if (trimmed.length > MAX_TAG_LENGTH) {
      trimmed = trimmed.slice(0, MAX_TAG_LENGTH);
    }

    setInputValue(trimmed);
    return trimmed;
  };

  const handleSelectTag = (option) => {
    if (!option) return;
    if (selectedTags.length >= 5) return;

    const exists = selectedTags.some(
      (tag) => tag.tagTitle.toLowerCase() === option.label.toLowerCase()
    );
    if (exists) return;

    onChangeTag(option);
    setInputValue(""); // clear input after selection
  };

  return (
    <div className="position-relative">
      <AsyncCreatableSelect
        classNamePrefix="Select_Tags"
        className={inputValue.length >= MAX_TAG_LENGTH ? "maxCountReached" : ""}
        cacheOptions
        options={tagsOptions}
        loadOptions={loadOptions}
        controlShouldRenderValue={false}
        value={null}
        onChange={handleSelectTag}
        isDisabled={disabled || selectedTags.length >= 5}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        maxMenuHeight={150}
        placeholder={"Type at least 3 characters..."}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < 3 ? "No Tags" : "No results, press Enter to add"
        }
        formatCreateLabel={(input) => `Add "${input}"`}
        isOptionDisabled={(option) =>
          selectedTags.some((tag) => tag.tagID === option.value)
        }
        components={{
          DropdownIndicator: null,
          IndicatorSeparator: null,
        }}
      />

      {/* Character count */}
      <div
        className={`characterCountIndicator ${
          inputValue.length >= MAX_TAG_LENGTH ? "maxCountReached" : ""
        }`}
      >
        {`${inputValue.length} / ${MAX_TAG_LENGTH}`}
      </div>
    </div>
  );
};

// export default TagSelectDropdown;
