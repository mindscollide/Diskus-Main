import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { Upload, Button, Modal } from "antd";
import styles from "./imageUploader.module.css";
import { updateUserProfilePicture } from "../../../store/actions/UpdateUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../../commen/functions/getBase64";
import { PlusLg } from "react-bootstrap-icons";

const AvatarEditorComponent = () => {
  const { Authreducer } = useSelector((state) => state);
  const [fileList, setFileList] = useState([]);
  const [onHold, setOnHold] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onChange = ({ fileList: newFileList }) => {
    let fileObj = newFileList[0].originFileObj;
    getBase64(fileObj)
      .then((res) => {
        let fileUrL = res.split(",")[1];
        setFileList(newFileList);
        dispatch(updateUserProfilePicture(navigate, t, fileObj.name, fileUrL));
        // setFileList(onHold);
        // setTimeout(() => {
        //   setFileList(newFileList)
        // }, 10000)
      })
      .catch((err) => console.log(err, "newFileListnewFileList"));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleCancel = () => setPreviewOpen(false);
  // useEffect(() => {
  //   if (Authreducer.UpdateProfilePicture !== null) {
  //     if (
  //       Authreducer.UpdateProfilePicture.responseMessage
  //         .toLowerCase()
  //         .includes(
  //           "ERM_AuthService_SignUpManager_UpdateProfilePicture_01".toLowerCase()
  //         )
  //     ) {
  //       console.log(fileList, "fileListfileList");
  //       if (onHold) {
  //         console.log(fileList, "fileListfileList");
  //         setFileList(onHold);
  //       }
  //     }
  //   }
  // }, [Authreducer.UpdateProfilePicture]);

  console.log(onHold, "fileListfileList");
  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={handlePreview}
          onRemove={() => setFileList([])}
          className={styles["image_uploader_box"]}
        >
          {fileList.length === 0 ? (
            <>
              <span className="d-flex align-items-center gap-1">
                <PlusLg /> Upload
              </span>
            </>
          ) : null}
        </Upload>
        <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </ImgCrop>
    </>
  );
};

export default AvatarEditorComponent;
