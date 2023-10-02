import React from "react";
import styles from "./ViewAttachments.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import FileIcon, { defaultStyles } from "react-file-icon";
import Button from "../../elements/button/Button";
import { Link } from "react-router-dom";
const ViewAttachments = ({ resolutionAttachments, setViewattachmentpage }) => {
  console.log(
    resolutionAttachments,
    "resolutionAttachmentsresolutionAttachmentsresolutionAttachments"
  );
  const { t } = useTranslation();
  return (
    <Container fluid>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["ViewAttachment_paper"]}>
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
                      const first = data.displayAttachmentName.split(" ")[0];
                      const pdfData = {
                        taskId: data.fK_ResolutionID,
                        attachmentID: data.pK_RAID,
                        fileName: data.displayAttachmentName,
                        commingFrom: 3,
                      };
                      const pdfDataJson = JSON.stringify(pdfData);
                      return (
                        <Col
                          sm={12}
                          lg={1}
                          md={1}
                          className={styles["notes-attachment-icon"]}
                        >
                          {ext === "doc" ? (
                            <FileIcon
                              extension={"docx"}
                              size={78}
                              type={"document"}
                              labelColor={"rgba(44, 88, 152)"}
                            />
                          ) : ext === "docx" ? (
                            <FileIcon
                              extension={"docx"}
                              size={78}
                              type={"font"}
                              labelColor={"rgba(44, 88, 152)"}
                            />
                          ) : ext === "xls" ? (
                            <FileIcon
                              extension={"xls"}
                              type={"spreadsheet"}
                              size={78}
                              labelColor={"rgba(16, 121, 63)"}
                            />
                          ) : ext === "xlsx" ? (
                            <FileIcon
                              extension={"xls"}
                              type={"spreadsheet"}
                              size={78}
                              labelColor={"rgba(16, 121, 63)"}
                            />
                          ) : ext === "pdf" ? (
                            <Link
                              to={`/DisKus/documentViewer?pdfData=${encodeURIComponent(
                                pdfDataJson
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileIcon
                                extension={"pdf"}
                                size={78}
                                {...defaultStyles.pdf}
                              />
                            </Link>
                          ) : ext === "png" ? (
                            <FileIcon
                              extension={"png"}
                              size={78}
                              type={"image"}
                              labelColor={"rgba(102, 102, 224)"}
                            />
                          ) : ext === "txt" ? (
                            <FileIcon
                              extension={"txt"}
                              size={78}
                              type={"document"}
                              labelColor={"rgba(52, 120, 199)"}
                            />
                          ) : ext === "jpg" ? (
                            <FileIcon
                              extension={"jpg"}
                              size={78}
                              type={"image"}
                              labelColor={"rgba(102, 102, 224)"}
                            />
                          ) : ext === "jpeg" ? (
                            <FileIcon
                              extension={"jpeg"}
                              size={78}
                              type={"image"}
                              labelColor={"rgba(102, 102, 224)"}
                            />
                          ) : ext === "gif" ? (
                            <FileIcon
                              extension={"gif"}
                              size={78}
                              {...defaultStyles.gif}
                            />
                          ) : null}
                          <p className={styles["notes-attachment-text"]}>
                            {first}
                          </p>
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
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAttachments;
