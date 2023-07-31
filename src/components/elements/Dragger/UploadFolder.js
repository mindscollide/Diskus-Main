import React, { useEffect } from "react";
import { Row, Col, Dropdown, Container } from "react-bootstrap";
import { Button, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ChevronDown } from "react-bootstrap-icons";
import Cancellicon from "../../../assets/images/Delete-ChatFeature-Icon.png";
import { useTranslation } from "react-i18next";
import PDFfileICon from "../../../assets/images/pdf_icon.svg";
import { Progress, Space, Tooltip } from "antd";
import styles from "./Dragger.module.css";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { uploadDocumentsApi } from "../../../store/actions/DataRoom_actions";
const UploadDataFolder = ({
  setProgress,
  title,
  customRequestFolderUpload,
  onChange
}) => {

  return (
    <Upload
      directory
      showUploadList={false}
      onChange={onChange}
      fileList={[]}
      customRequest={customRequestFolderUpload}
      onProgress={(onprogress) => setProgress(onprogress.percent)}
    >
      <p className={styles["New_folder"]}>{title}</p>
    </Upload>
  );
};

export default UploadDataFolder;


// import React, { useCallback, useState } from 'react';
// import { Upload, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const DirectoryUpload = () => {
//   const [files, setFiles] = useState([])
//   const handleUpload = useCallback(async ({ file, onSuccess, onError, onProgress }) => {
//     console.log(file, "filefilefilefile")

//     if (!file) {
//       // Handle the case when file is null or undefined
//       return;
//     }
//     setFiles((prev) => [...prev, file])
//     // const formData = new FormData();
//     try {
//       // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint for handling file uploads.
//       // const response = await axios.post('YOUR_API_ENDPOINT', formData, {
//       //   headers: {
//       //     'Content-Type': 'multipart/form-data',
//       //   },
//       //   onUploadProgress: (progressEvent) => {
//       //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//       //     onProgress({ percent: percentCompleted });
//       //   },
//       // });

//       // Handle the API response as needed
//       // console.log(response.data);

//       // Notify Ant Design that the upload was successful
//       // onSuccess(response);

//       // Show success message to the user
//       // message.success('Upload successful!');
//     } catch (error) {
//       console.error('Error uploading file:', error);

//       // Notify Ant Design that there was an error
//       onError(error);

//       // Show error message to the user
//       message.error('Upload failed. Please try again.');
//     }
//   }, []);
//   console.log(files, "filesfilesfilesfiles")
//   return (
//     <Upload showUploadList={false} customRequest={handleUpload} directory>
//       <Button icon={<UploadOutlined />}>Upload Folder</Button>
//     </Upload>
//   );
// };

// export default DirectoryUpload;

