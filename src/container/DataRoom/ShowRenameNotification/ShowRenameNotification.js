import React from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./ShowRenameNotification.module.css";
import cross from "../../../assets/images/Group 71.png";
const ShowRenameNotification = ({ ClosingNotificationRenameFolder }) => {
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
              "Folder 1 renamed to "Folder renamed"
            </span>
          </Col>
          <Col lg={2} md={2} sm={2}>
            <span className={styles["Tag_line_rename_notfication"]}>UNDO</span>
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
