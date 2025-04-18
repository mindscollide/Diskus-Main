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
const ViewAttachments = ({ resolutionAttachments, setViewattachmentpage }) => {
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
    <Container fluid>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["ViewAttachment_paper"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["View_attachment_heading"]}>
                  {t("View-attachments")}
                </span>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Scroller_ViewAttachments"]}
              >
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
                        <Col sm={2} lg={2} md={2}>
                          <AttachmentViewer
                            data={data}
                            name={data.displayAttachmentName}
                            id={data.originalAttachmentName}
                            handleEyeIcon={() =>
                              handleLinkClick(pdfDataJson, ext)
                            }
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
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button
                  text={t("Close")}
                  onClick={() => setViewattachmentpage(false)}
                  className={styles["viewAttachmentCloseBtn"]}
                />
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAttachments;
