import React, { useState } from "react";
import styles from "./upload.module.css";
import { Input, Button } from "antd";
import { CalendarFill } from "react-bootstrap-icons";

const CustomUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

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
