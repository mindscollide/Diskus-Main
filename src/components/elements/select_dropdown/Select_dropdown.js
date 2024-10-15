import React, { memo, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { withStyles } from "@mui/styles";

const SelectBox = memo(
  ({
    size,
    name,
    value,
    option,
    label,
    width,
    required,
    placeholder,
    change,
    focus,
    propertyName,
    disable,
    className,
  }) => {
    console.log("option", option);
    const CustomText = withStyles({
      root: {
        "& label.Mui-focused": {
          color: "black",
        },

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "1px solid #dee6e6",
            borderRadius: 0,
          },
          "&:hover fieldset": {
            border: "1px solid #dee6e6",
            borderRadius: 0,
          },
          "&.Mui-focused fieldset": {
            border: "1px solid #12B0E8",
            borderRadius: 0,
          },
        },
      },
    })(TextField);
    return (
      <Autocomplete
        closeIcon=""
        disabled={disable}
        onFocus={focus}
        id={name}
        autoComplete="off"
        value={value && value}
        className={className}
        placeholder={placeholder && placeholder}
        size={size ? size : "small"}
        options={option ? option : content}
        getOptionLabel={(item) =>
          item[propertyName]
            ? typeof item[propertyName] === "string" ||
              item[propertyName] instanceof String
              ? item[propertyName]
              : ""
            : item
            ? typeof item === "string" || item instanceof String
              ? item
              : ""
            : ""
        }
        style={{ width: `${width}` }}
        onChange={change}
        renderInput={(params) => (
          <CustomText
            {...params}
            label={label && <small>{label}</small>}
            variant="outlined"
            placeholder={placeholder && placeholder}
            required={required ? true : false}
          />
        )}
      />
    );
  }
);

export default SelectBox;

const content = ["No Data Found"];
