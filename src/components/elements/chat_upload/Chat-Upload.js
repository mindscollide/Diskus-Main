import React from "react";
import styles from "./chat.upload.module.css";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import UploadChatIcon from "../../../assets/images/Upload-Chat-Icon.png";

const CustomUploadChat = ({
  onChange,
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
        onChange={onChange}
        disable={disable}
        onClick={onClick}
        maxfilesize={10000000}
        disabled={disable}
        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg, .gif"
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

export default CustomUploadChat;
