import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { Upload, Button, Modal, Spin } from "antd";
import styles from "./imageUploader.module.css";
import { updateUserProfilePicture } from "../../../store/actions/UpdateUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  base64UrlToFile,
  getBase64,
} from "../../../commen/functions/getBase64";
import { PlusLg } from "react-bootstrap-icons";

const AvatarEditorComponent = ({ pictureObj }) => {
  const [fileList, setFileList] = useState([]);
  const [onHold, setOnHold] = useState([]);
  const dispatch = useDispatch();
  const { Authreducer } = useSelector((state) => state);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
  };
  const handleCancel = () => setPreviewOpen(false);

  const uploadProfilePic = ({ file }) => {
    console.log(file, "uploadProfilePicuploadProfilePicuploadProfilePic");
    getBase64(file)
      .then((res) => {
        console.log("Test");
        // setFileList([file])
        let fileUrL = res.split(",")[1];
        dispatch(updateUserProfilePicture(navigate, t, file.name, fileUrL));
      })
      .catch((err) => console.log(err, "newFileListnewFileList"));
  };

  useEffect(() => {
    let file = {
      uid: "1",
      name: "image.png",
      url: `data:image/jpeg;base64,${pictureObj.DisplayProfilePictureName}`,
    }; // Set the base64 data as the URL
    setFileList([file]);
  }, [pictureObj]);

  return (
    <>
      <ImgCrop
      
        rotationSlider
        modalCancel={t("Cancel")}
        modalOk={t("Ok")}
        cropperProps={{
          objectFit: "auto-cover",
        }}
      >
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          customRequest={uploadProfilePic}
          onPreview={handlePreview}
          accept="image/png, image/jpeg"
          onRemove={() => setFileList([])}
          className={styles["image_uploader_box"]}
        >
          {Authreducer.Loading ? (
            <Spin />
          ) : fileList.length === 0 ? (
            <>
              <span className="d-flex align-items-center gap-1">
                <PlusLg /> Upload
              </span>
            </>
          ) : null}
        </Upload>

        <Modal
          zIndex={10}
          open={previewOpen}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
            draggable="false"
            />
        </Modal>
      </ImgCrop>
    </>
  );
};

export default AvatarEditorComponent;
