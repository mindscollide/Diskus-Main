/**
 * @file UploadFile.js
 * @description File upload button component wrapping Ant Design's Upload, supporting multiple file selection and pre-upload validation.
 */

import React from "react";
import { Upload } from "antd";
import styles from "./Dragger.module.css";

/**
 * Renders a labeled upload trigger for selecting one or more files.
 * @param {{ setProgress: Function, handleFileUploadRequest: Function, title: string, multiple: boolean, className: string, beforeUpload: Function }} props
 * @returns {JSX.Element}
 */
const UploadFile = ({
  setProgress,
  handleFileUploadRequest,
  title,
  multiple,
  className,
  beforeUpload, // ✅ new prop
}) => {
  return (
    <Upload
      multiple={multiple}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
      customRequest={handleFileUploadRequest}
      className={className}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadFile;
