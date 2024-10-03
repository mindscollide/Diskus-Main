import React from "react";
import styles from "./chat.upload.module.css";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";

const CustomUploadImageChat = ({
  change,
  onClick,
  className,
  disable,
  uploadIcon,
}) => {
  return (
    <Box display="flex">
      <input
        className={styles.uploadText}
        id="contained-button-file"
        type="file"
        onChange={change}
        disable={disable}
        onClick={onClick}
        maxfilesize={10000000}
        disabled={disable}
        accept={"image/*"}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          className={className}
        >
          <img src={uploadIcon} alt="" draggable="false" />
        </Button>
      </label>
    </Box>
  );
};

export default CustomUploadImageChat;
