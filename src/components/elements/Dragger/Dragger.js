/**
 * @file Dragger.js
 * @description Drag-and-drop file upload component wrapping Ant Design's Upload.Dragger.
 */

import React from "react";
import { Upload } from "antd";

/**
 * Drag-and-drop area for file uploads with progress tracking.
 * @param {{ setProgress: Function, handleFileDraggerUploadRequest: Function, Icon: JSX.Element, className: string }} props
 * @returns {JSX.Element}
 */
const Dragger = ({
  setProgress,
  handleFileDraggerUploadRequest,
  Icon,
  className,
}) => {
  const { Dragger } = Upload;

  return (
    <Dragger
      className={className}
      showUploadList={false}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
      customRequest={handleFileDraggerUploadRequest}
    >
      {Icon}
    </Dragger>
  );
};

export default Dragger;
