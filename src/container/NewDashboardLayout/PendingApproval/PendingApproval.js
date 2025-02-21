import React from "react";
import styles from "./PendingApproval.module.css";
import { Col, Row } from "react-bootstrap";
import { formatValue } from "../../../commen/functions/regex";
import { useTranslation } from "react-i18next";
const PendingApproval = ({ pendingAppr }) => {
  const { t } = useTranslation();
  let lang = localStorage.getItem("i18nextLng");

  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12} className={styles["PendingApprovalCount"]}>
          {formatValue(pendingAppr, lang)}
        </Col>
        <Col sm={12} md={12} lg={12} className={styles["PendingApprovalText"]}>
          {t("Pending-approvals")}
        </Col>
      </Row>
    </>
  );
};

export default PendingApproval;
