import React, { useState } from "react";
import styles from "./upload.module.css";
import { Input, Button } from "antd";
import { CalendarFill } from "react-bootstrap-icons";

/**
 * @component CustomUpload (uploadButton)
 * @description A file-upload control that pairs a read-only text input (showing
 * the selected file path) with a calendar-icon button that opens the native file
 * picker. The input is disabled until a file is selected, providing a clear visual
 * cue that the field is populated only after a file has been chosen.
 *
 * Note: This component manages its own local state (`uploadedFile`) and does not
 * accept external props — it is intended as a standalone, self-contained widget.
 * Integration with a parent form or upload handler should be added if needed.
 *
 * @example
 * <CustomUpload />
 */
const CustomUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  // Capture the file path string from the input value and store it in local state
  // so it can be reflected in the read-only display input above the button.
  const uploadHandler = (e) => {
    const uplaodFilePath = e.target.value;
    setUploadedFile(uplaodFilePath);
  };

  return (
    <>
      <Input value={uploadedFile} disabled={uploadedFile ? false : true} />
      <input
        className={styles.uploadText}
        id="contained-button-file"
        type="file"
        onChange={uploadHandler}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={styles.uploadButton}
        >
          <CalendarFill size={34} />
        </Button>
      </label>
    </>
  );
};

export default CustomUpload;
