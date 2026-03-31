import React from "react";
import styles from "./upload.module.css";
import AttachmentIcon from "../../../assets/images/Attachment_Icon.svg";

/**
 * @component CustomUpload
 * @description A file-picker input styled as a clickable attachment icon. The
 * native `<input type="file">` is visually hidden and activated through its
 * associated `<label>`, which displays the platform's attachment SVG icon.
 * Supports multi-file selection and restricts accepted formats to common
 * document, spreadsheet, image, and text types.
 *
 * Accepted file types: .doc, .docx, .xls, .xlsx, .pdf, .png, .txt,
 *                      .jpg, .jpeg, .gif, .csv
 *
 * @param {Function} change    - `onChange` handler called with the file-input event
 *                               when the user selects one or more files.
 * @param {Function} onClick   - `onClick` handler attached to the file input (useful
 *                               for resetting the input value before re-selection).
 * @param {boolean}  multiple  - When true, allows the user to select multiple files at once.
 * @param {boolean}  disable   - When true, disables the file input to prevent interaction.
 *
 * @example
 * <CustomUpload
 *   change={handleFileChange}
 *   onClick={handleInputClick}
 *   multiple={true}
 *   disable={isUploading}
 * />
 */
const CustomUpload = ({ change, onClick, multiple, disable }) => {
  return (
    <div display="flex">
      <input
        className={styles.uploadText}
        id="contained-button-file"
        type="file"
        onChange={change}
        disable={disable}
        onClick={onClick}
        size={1000}
        multiple={multiple}
        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif, .csv"
        maxfilesize={10000000}
        disabled={disable}
      />
      <label htmlFor="contained-button-file">
        <img
          className="cursor-pointer"
          alt=""
          src={AttachmentIcon}
          draggable="false"
        ></img>
      </label>
    </div>
  );
};

export default CustomUpload;
