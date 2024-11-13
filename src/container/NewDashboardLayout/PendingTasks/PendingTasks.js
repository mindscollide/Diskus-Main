import React from "react";
import styles from "./PendingTasks.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
import { useTranslation } from "react-i18next";
const PendingTasks = ({ taskValue }) => {
  const { t } = useTranslation();
  let lang = localStorage.getItem("i18nextLng");

  return (
    <>
      <Row className={styles["PendingTaskLine"]}>
        <Col sm={12} md={12} lg={12} className={styles["UpComingTaskCount"]}>
          {formatValue(taskValue, lang)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["UpComingTaskText"]}>
          {t("Upcoming-tasks")}
        </Col>
      </Row>
    </>
  );
};

export default PendingTasks;
