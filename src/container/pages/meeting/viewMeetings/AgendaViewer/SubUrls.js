import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import { useTranslation } from "react-i18next";

const SubUrls = ({ subAgendaData }) => {
  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <Row className="mt-2">
      <Col
        lg={8}
        md={8}
        sm={12}
        className={currentLanguage === "ar" ? "p-0" : ""}
      >
        <span
          className={styles["URLTitle_Heading"]}
          onClick={() =>
            window.open(subAgendaData.subAgendaUrlFieldRadio, "_blank")
          }
        >
          {subAgendaData.subAgendaUrlFieldRadio}
        </span>
      </Col>
    </Row>
  );
};

export default SubUrls;
