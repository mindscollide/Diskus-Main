// import React from "react";
// import styles from "./chat.upload.module.css";
// import Button from "@material-ui/core/Button";
// import { Box } from "@material-ui/core";
// import UploadChatIcon from "../../../assets/images/Upload-Chat-Icon.png";

// const CustomUploadChat = ({
//   change,
//   onClick,
//   className,
//   disable,
//   uploadIcon,
// }) => {
//   return (
//     <Box display="flex">
//       {/* <Input value={file} disabled={file ? false : true} /> */}
//       <input
//         className={styles.uploadText}
//         id="contained-button-file"
//         type="file"
//         onChange={change}
//         disable={disable}
//         onClick={onClick}
//         accept=".doc, .docx, .xls, .xlsx,.pdf,.png,.txt,.jpg, .jpeg,.gif"
//         // inputProps={{ acceptOnly: '.doc, .docx, .xls, .xlsx,.pdf,.png' }}
//         // restrictions={{
//         //   allowedExtensions: [".doc", ".docx", ".xls", ".xlsx", ".pdf", ".png"],
//         // }}
//         maxfilesize={10000000}
//         disabled={disable}
//       />
//       <label htmlFor="contained-button-file">
//         <Button
//           variant="contained"
//           color="primary"
//           component="span"
//           className={className}
//         >
//           <img src={uploadIcon} alt="" />
//         </Button>
//       </label>
//     </Box>
//   );
// };

// export default CustomUploadChat;

import React from 'react'
import styles from './chat.upload.module.css'
import Button from '@material-ui/core/Button'
import { Box } from '@material-ui/core'
import { UploadOutlined } from '@ant-design/icons'
import { Button as AntButton, message, Upload } from 'antd'
import UploadChatIcon from '../../../assets/images/Upload-Chat-Icon.png'

const CustomUploadChat = ({
  change,
  onClick,
  className,
  disable,
  uploadIcon,
}) => {
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  }

  return (
    <Box display="flex">
      <Upload {...props} className={styles.uploadText}>
        <Button
          variant="contained"
          color="primary"
          component={AntButton}
          className={className}
          disabled={disable}
          icon={<UploadOutlined />}
        >
          <img src={uploadIcon} alt="" />
        </Button>
      </Upload>
    </Box>
  )
}

export default CustomUploadChat
