import React from "react";
import styles from "./ViewAttachments.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Button from "../../../components/elements/button/Button";
import { useNavigate } from "react-router-dom";
import { DataRoomDownloadFileApiFunc } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import AttachmentViewer from "../../../components/elements/fileAttachment/attachment";
import { fileFormatforSignatureFlow } from "../../../commen/functions/utils";
import CustomModal from "../../../components/elements/modal/Modal";
const ViewAttachments = ({ resolutionAttachments, setViewattachmentpage }) => {
  console.log(
    resolutionAttachments,
    "resolutionAttachmentsresolutionAttachments"
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickDownloadFile = (fileID, fileName) => {
    let data = {
      FileID: Number(fileID),
    };
    dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, fileName));
  };
  const handleLinkClick = (data, ext) => {
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/Diskus/documentViewer?pdfData=${encodeURIComponent(data)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };
  return (
    <CustomModal
      show={true}
      setShow={setViewattachmentpage}
      ModalTitle={t("View-attachments")}
      modalTitleClassName={styles["View_attachment_heading"]}
      modalHeaderClassName={styles["viewAttachment_ModalHeader"]}
      centered={true}
      onHide={() => setViewattachmentpage(false)}
      closeButton={true}
      size={"md"}
      ModalBody={
        <>
          <div className={styles["Scroller_ViewAttachments"]}>
            <Row>
              {resolutionAttachments &&
                resolutionAttachments.map((data, index) => {
                  let ext = data.displayAttachmentName.split(".").pop();
                  const pdfData = {
                    taskId: data.fK_ResolutionID,
                    attachmentID: Number(data.originalAttachmentName),
                    fileName: data.displayAttachmentName,
                    commingFrom: 4,
                  };
                  const pdfDataJson = JSON.stringify(pdfData);
                  return (
                    <Col sm={6} lg={6} md={6}>
                      <AttachmentViewer
                        data={data}
                        name={data.displayAttachmentName}
                        id={data.originalAttachmentName}
                        handleEyeIcon={() => handleLinkClick(pdfDataJson, ext)}
                        handleClickDownload={() =>
                          handleClickDownloadFile(
                            data.originalAttachmentName,
                            data.displayAttachmentName
                          )
                        }
                      />
                    </Col>
                  );
                })}
            </Row>
          </div>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <Button
                text={t("Close")}
                onClick={() => setViewattachmentpage(false)}
                className={styles["viewAttachmentCloseBtn"]}
              />{" "}
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ViewAttachments;
