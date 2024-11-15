import { Upload, Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

const Uploads = () => {
  const dispatch = useDispatch();
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
