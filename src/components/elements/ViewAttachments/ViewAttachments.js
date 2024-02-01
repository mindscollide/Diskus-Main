import React, { useState } from "react";
import styles from "./ViewAttachments.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import FileIcon, { defaultStyles } from "react-file-icon";
import Button from "../../elements/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { DataRoomDownloadFileApiFunc } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
const ViewAttachments = ({ resolutionAttachments, setViewattachmentpage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // for anotantion opens in new tabb on doubble click
  const [clicks, setClicks] = useState(0);
  const [dataCheck, setDataCheck] = useState([]);
  const handleClickDownloadFile = (fileID, fileName) => {
    let data = {
      FileID: Number(fileID),
    };
    dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, fileName));
  };
  const handleLinkClick = (data) => {
    if (clicks === 1) {
      if (dataCheck === data) {
        // Perform the action you want to happen on the double-click here
        window.open(
          `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(data)}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        setDataCheck(data);
      }

      // Reset the click count
      setClicks(0);
    } else {
      // Increment the click count
      setClicks(clicks + 1);
      setDataCheck(data);
      // You can add a delay here to reset the click count after a certain time if needed
      setTimeout(() => {
        setClicks(0);
        setDataCheck([]);
      }, 300); // Reset after 300 milliseconds (adjust as needed)
    }
  };
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
                        attachmentID: Number(data.originalAttachmentName),
                        fileName: data.displayAttachmentName,
                        commingFrom: 4,
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
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"docx"}
                                size={78}
                                type={"document"}
                                labelColor={"rgba(44, 88, 152)"}
                              />
                            </span>
                          ) : ext === "docx" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"docx"}
                                size={78}
                                type={"font"}
                                labelColor={"rgba(44, 88, 152)"}
                              />
                            </span>
                          ) : ext === "xls" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"xls"}
                                type={"spreadsheet"}
                                size={78}
                                labelColor={"rgba(16, 121, 63)"}
                              />
                            </span>
                          ) : ext === "xlsx" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"xls"}
                                type={"spreadsheet"}
                                size={78}
                                labelColor={"rgba(16, 121, 63)"}
                              />
                            </span>
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
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"png"}
                                size={78}
                                type={"image"}
                                labelColor={"rgba(102, 102, 224)"}
                              />
                            </span>
                          ) : ext === "txt" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"txt"}
                                size={78}
                                type={"document"}
                                labelColor={"rgba(52, 120, 199)"}
                              />
                            </span>
                          ) : ext === "jpg" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"jpg"}
                                size={78}
                                type={"image"}
                                labelColor={"rgba(102, 102, 224)"}
                              />
                            </span>
                          ) : ext === "jpeg" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"jpeg"}
                                size={78}
                                type={"image"}
                                labelColor={"rgba(102, 102, 224)"}
                              />
                            </span>
                          ) : ext === "gif" ? (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={"gif"}
                                size={78}
                                {...defaultStyles.gif}
                              />
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleClickDownloadFile(
                                  pdfData.attachmentID,
                                  pdfData.fileName
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FileIcon
                                extension={ext}
                                size={78}
                                {...defaultStyles.ext}
                              />
                            </span>
                          )}
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
