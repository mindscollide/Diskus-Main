import React from "react";
import DiskusLogo from "../../../../../src/assets/images/newElements/Diskus_newLogo.svg";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./WelcomeScreen.module.css";
import { useTranslation } from "react-i18next";

const Welcome = (props) => {
  console.log(props);
  const { t } = useTranslation();

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <h3>{t("Welcome-to")}</h3>
          <img draggable="false" src={DiskusLogo} alt="" />
          <p>{t("Your-one-stop-solution-to-meeting-management")}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
