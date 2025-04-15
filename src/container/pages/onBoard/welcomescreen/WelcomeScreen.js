import React from "react";
import DiskusLogo from "../../../../../src/assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "../../../../../src/assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";

import { Container, Row, Col } from "react-bootstrap";
import styles from "./WelcomeScreen.module.css";
import { useTranslation } from "react-i18next";

const Welcome = (props) => {
  console.log(props);
  const { t } = useTranslation();

  return (
    <Container className={styles["main-container"]} data-tut='welcomescreen'>
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <h3>{t("Welcome-to")}</h3>
          <img
            draggable='false'
            width={200}
            src={
              localStorage.getItem("i18nextLng") === "ar"
                ? DiskusLogoArabic
                : DiskusLogo
            }
            alt=''
          />
          <p>{t("Your-one-stop-solution-to-meeting-management")}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
