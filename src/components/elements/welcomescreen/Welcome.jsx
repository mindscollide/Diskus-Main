/**
 * @component Loader
 * @description The Diskus welcome / splash screen displayed to users when
 * the application is initialising or navigating to the home view. It renders
 * a full-screen overlay containing the Diskus logo and a localised tagline
 * ("Your one-step solution to meeting management"). The root container carries
 * the `data-tut="welcomescreen"` attribute used by the guided product tour.
 *
 * @returns {JSX.Element} A full-viewport welcome overlay with the Diskus branding.
 */
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
          <img src={Logo} draggable="false" alt="" />

          <div className={styles["line"]}>
            <p>{t("Your-one-step-solution-to-meeting-management")}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
