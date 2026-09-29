import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import styles from "./ShowRenameNotification.module.css";
import cross from "../../../assets/images/Group 71.png";
const ShowRenameNotification = ({ ClosingNotificationRenameFolder }) => {
  const { t } = useTranslation();
  return (
    <Row>
      <Col
        lf={12}
        md={12}
        sm={12}
        className={styles["backgeound_Rename_notification"]}
      >
        <Row className="mt-2">
          <Col lg={9} md={9} sm={9}>
            <span className={styles["Tag_line_rename_notfication"]}>
              {t("Folder-renamed")}
            </span>
          </Col>
          <Col lg={2} md={2} sm={2}>
            <span className={styles["Tag_line_rename_notfication"]}>
              {t("Undo")}
            </span>
          </Col>
          <Col lg={1} md={1} sm={1}>
            <img
              draggable="false"
              src={cross}
              alt=""
              height="15px"
              width="15px"
              onClick={ClosingNotificationRenameFolder}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ShowRenameNotification;
