import React from "react";
import { Upload } from "antd";
import styles from "./Dragger.module.css";

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
