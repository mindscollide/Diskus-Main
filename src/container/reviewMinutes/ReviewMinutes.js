import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next"; // Importing translation hook
import styles from "./ReviewMinutes.module.css"; // Importing CSS module
import { useDispatch } from "react-redux"; // Importing Redux hook
import { useNavigate } from "react-router-dom"; // Importing navigation hook

// Functional component for pending approvals section
const ReviewMinutes = () => {
  const { t } = useTranslation(); // Translation hook
  const dispatch = useDispatch(); // Redux hook
  const navigate = useNavigate(); // Navigation hook

  //Getting current Language
  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <section className={styles["pendingApprovalContainer"]}>
      {" "}
      {/* Container for pending approval section */}
      <Row className="my-3 d-flex align-items-center">
        <Col sm={12} md={12} lg={12}>
          <span className={styles["pendingApprovalHeading"]}>
            {t("Review-minutes")}
            {/* Translation for pending approval heading */}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default ReviewMinutes; // Exporting pending approval component
