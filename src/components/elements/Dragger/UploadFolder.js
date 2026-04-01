/**
 * @component UploadDataFolder
 * @description An Ant Design Upload component configured for entire-directory
 * selection. Files accumulate in local state and, once the batch is complete,
 * the `onChange` callback is invoked with the directory name (derived from
 * the first file's `webkitRelativePath`) and the full file list. A processing
 * flag prevents duplicate triggers during a single selection cycle. The native
 * upload list is hidden so the parent can handle display.
 *
 * @param {Function} setProgress - Callback that receives the current upload percentage (0-100).
 * @param {string}   title       - Label text rendered inside the upload trigger area.
 * @param {Function} onChange    - Callback invoked with `{ directoryName: string, fileList: File[] }`
 *                                 once all files in the selected folder have been collected.
 * @returns {JSX.Element} A clickable folder-upload trigger.
 */
import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import styles from "./Dragger.module.css";

const UploadDataFolder = ({ setProgress, title, onChange }) => {
  const [fileList, setFileList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // Flag to prevent multiple triggers

  const customBeforeUpload = (file) => {
    setFileList((prevFileList) => [...prevFileList, file]);
    return false; // Prevent default behavior
  };

  useEffect(() => {
    if (!isProcessing && fileList.length > 0) {
      setIsProcessing(true); // Set flag to prevent multiple triggers
      const directoryName = fileList[0].webkitRelativePath.split("/")[0];
      onChange({ directoryName, fileList });

      // Reset the fileList after the change has been handled
      setFileList([]);
      setIsProcessing(false); // Reset the flag
    }
  }, [fileList, onChange, isProcessing]);

  return (
    <Upload
      directory
      showUploadList={false}
      multiple
      beforeUpload={customBeforeUpload}
      customRequest={(options) => {
        // Implement your file upload logic here
        // You might need to call setProgress and handle file uploading
      }}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadDataFolder;
