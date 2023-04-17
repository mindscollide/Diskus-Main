import React from "react";
import styles from "./ViewAttachments.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
const ViewAttachments = () => {
  const { t } = useTranslation();
  return (
    <Container>
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
              ></Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAttachments;
