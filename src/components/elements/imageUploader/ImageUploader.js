import ImgCrop from "antd-img-crop";
import React, { useEffect, useMemo, useState } from "react";
import { Upload, Spin } from "antd";
import CustomModal from "../../elements/modal/Modal";
import styles from "./imageUploader.module.css";
import "./imageuploader.css";
import { updateUserProfilePicture } from "../../../store/actions/UpdateUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBase64 } from "../../../commen/functions/getBase64";
import { PlusLg } from "react-bootstrap-icons";
import { isBase64 } from "../../../commen/functions/validations";
import DefaultAvatar from "../../../assets/images/DefaultAvatar.png";

const AvatarEditorComponent = ({ pictureObj, setUserProfileEdit }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const dispatch = useDispatch();
  const { Authreducer } = useSelector((state) => state);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handlePreview = async (file) => {
    const base64Image = file.url.split(",")[1];
    if (isBase64(base64Image)) {
      setPreviewImage(base64Image);
      setPreviewOpen(true);
    }
  };

  const handleCancel = () => setPreviewOpen(false);

  const uploadProfilePic = ({ file }) => {
    
    getBase64(file)
      .then((res) => {
        let fileUrL = res.split(",")[1];
        dispatch(updateUserProfilePicture(navigate, t, file.name, fileUrL));
      })
      .catch((err) => console.error("Error converting file to base64:", err));
  };

  const memoizedFile = useMemo(() => {
    if (pictureObj.DisplayProfilePictureName) {
      return [
        {
          uid: "1",
          name: "image.png",
          url: `data:image/jpeg;base64,${pictureObj.DisplayProfilePictureName}`,
        },
      ];
    }
    return [];
  }, [pictureObj.DisplayProfilePictureName]);
  useEffect(() => {
    setFileList(memoizedFile);
  }, [memoizedFile]);

  //For Removing Profile Picture funtion
  const onRemovePicture = () => {
    // Simulate base64 processing for DefaultAvatar
    fetch(DefaultAvatar)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result.split(",")[1]; // Get the base64 string
          dispatch(
            updateUserProfilePicture(
              navigate,
              t,
              "DefaultAvatar.png",
              base64Image
            )
          );
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) =>
        console.error("Error converting DefaultAvatar to base64:", err)
      );

    // Reset fileList to empty
    setFileList([]);
  };

  return (
    <>
      <ImgCrop rotationSlider modalCancel={t("Cancel")} modalOk={t("Ok")}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          customRequest={uploadProfilePic}
          onPreview={handlePreview}
          accept="image/png, image/jpeg"
          onRemove={onRemovePicture}
          className={
            fileList.length > 0 && isBase64(fileList[0].url)
              ? "image_uploader_box"
              : "not_working"
          }
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
      </ImgCrop>

      <CustomModal
        className={styles["CustomModalProfile"]}
        show={previewOpen}
        size={"small"}
        ModalBody={
          <>
            {previewImage && (
              <img
                alt="Preview"
                src={`data:image/jpeg;base64,${previewImage}`}
                draggable="false"
                height={500}
                width={"100%"}
              />
            )}
          </>
        }
        onHide={handleCancel}
      />
    </>
  );
};

export default AvatarEditorComponent;
