import React from "react";
import styles from "./upload.module.css";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import AttachmentIcon from "../../../assets/images/Attachment_Icon.svg";

const CustomUpload = ({
  change,
  onClick,
  multiple,
  className,
  disable,
  attachmentIconClass,
}) => {
  return (
    <Box display="flex">
      {/* <Input value={file} disabled={file ? false : true} /> */}
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
        // inputProps={{ acceptOnly: '.doc, .docx, .xls, .xlsx,.pdf,.png' }}
        // restrictions={{
        //   allowedExtensions: [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".png"],
        // }}

        maxfilesize={10000000}
        disabled={disable}
      />
      <label htmlFor="contained-button-file">
        <img
          className="cursor-pointer"
          src={AttachmentIcon}
          draggable="false"
        ></img>
      </label>
    </Box>
  );
};

export default CustomUpload;
