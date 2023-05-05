import React from "react";
import styles from "./ViewAttachments.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import FileIcon, { defaultStyles } from "react-file-icon";
import Button from '../../elements/button/Button'
const ViewAttachments = ({ resolutionAttachments,setViewattachmentpage }) => {
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
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Scroller_ViewAttachments"]}
              >
                <Row>
                  {resolutionAttachments && resolutionAttachments.map((data, index) => {
                    var ext = data.displayAttachmentName.split(".").pop();
                    const first =
                      data.displayAttachmentName.split(" ")[0];
                    return (
                      <Col
                        sm={12}
                        lg={1}
                        md={1}
                        className={
                          styles["notes-attachment-icon"]
                        }
                      >
                        <FileIcon
                          extension={ext}
                          size={78}
                          labelColor={"rgba(97,114,214,1)"}
                        />
                        <p
                          className={
                            styles["notes-attachment-text"]
                          }
                        >
                          {first}
                        </p>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end"><Button text={"Close"} onClick={() => setViewattachmentpage(false)} className={styles["viewAttachmentCloseBtn"]} /></Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAttachments;
