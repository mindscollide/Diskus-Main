import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./EmptyTableComponent.module.css";
import SpinComponent from "../../../../components/elements/mainLoader/loader";
import NoMeetingsIcon from "../../../../assets/images/No-Meetings.png";
import { useTranslation } from "react-i18next";

const EmptyTableComponent = () => {
  const { t } = useTranslation();
  return (
    <section className={styles["EmptyTableMeeting"]}>
      <Row>
        <Col className="d-flex justify-content-center align-items-center flex-column">
          <img
            src={NoMeetingsIcon}
            alt=""
            draggable="false"
            className="nodata-table-icon"
          />
          <h4>{t("No-new-meetings")}</h4>
          <span>{t("Anything-important-thats-needs-discussion")}</span>
        </Col>
      </Row>
    </section>
  );
};

export default EmptyTableComponent;
