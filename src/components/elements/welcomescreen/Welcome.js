import React from "react";
import Logo from "../../../assets/images/diskuslogo-forsigncard.svg";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Welcome.module.css";
import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation();
  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <h3>{t("Welcome-to")}</h3>
          <img src={Logo} draggable="false" />

          <div className={styles["line"]}>
            <p>{t("Your-one-step-solution-to-meeting-management")}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
