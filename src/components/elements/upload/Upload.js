import React from "react";
import styles from "./upload.module.css";
import { Box } from "@material-ui/core";
import AttachmentIcon from "../../../assets/images/Attachment_Icon.svg";

const CustomUpload = ({ change, onClick, multiple, disable }) => {
  return (
    <Box display="flex">
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
    </Box>
  );
};

export default CustomUpload;
