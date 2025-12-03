import { Upload, Button } from "antd";
import React from "react";

const Uploads = () => {
  const props = {
    onChange: (info) => {
      
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
