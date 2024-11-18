import React from "react";
import { Upload } from "antd";

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
