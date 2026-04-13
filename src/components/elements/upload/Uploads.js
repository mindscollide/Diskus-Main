import { Upload, Button } from "antd";
import React from "react";

/**
 * @component Uploads
 * @description A self-contained PDF upload trigger built on top of the Ant Design
 * `Upload` component. It renders a styled "Upload File" button with a file icon
 * and restricts the file picker to PDF documents only. The upload list UI is
 * intentionally hidden (`showUploadList={false}`) so that file management is
 * handled externally. Currently the `onChange` handler only logs the resulting
 * file list to the console and does not persist files — callers should extend
 * or replace this component with proper upload logic when needed.
 *
 * Accepted file types: .pdf
 *
 * @example
 * <Uploads />
 */
const Uploads = () => {
  const props = {
    onChange: (info) => {
      console.log("setUploadList", info.fileList);
    },
  };
  return (
    <Upload {...props} accept={".pdf"} showUploadList={false}>
      <Button className="UploadFileButton">
        <i className="icon-file-upload uploadfile"></i>Upload File
      </Button>
    </Upload>
  );
};
export default Uploads;
