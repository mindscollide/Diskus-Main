import React from "react";
import styles from "./upload.module.css";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import AttachmentIcon from '../../../assets/images/Attachment_Icon.svg'

const CustomUpload = ({ change, onClick, className, disable }) => {

  return (
    <Box display="flex">
      {/* <Input value={file} disabled={file ? false : true} /> */}
      <input
        className={styles.uploadText}
        id="contained-button-file"
        type="file"
        onChange={change}
        disable= {disable}
        onClick={onClick}
        accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg,.gif"
        // inputProps={{ acceptOnly: '.doc, .docx, .xls, .xlsx,.pdf,.png' }}
        // restrictions={{
        //   allowedExtensions: [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".png"],
        // }}
        maxfilesize={10000000}
        disabled={disable}
      />
      <label htmlFor="contained-button-file">
      
          <img src={AttachmentIcon}></img>
      </label>
    </Box>
  );
};

export default CustomUpload;
