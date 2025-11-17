import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import DikusGIF from "../../../assets/images/Loader.gif";
import { useSelector } from "react-redux";
import ProgressLoader from "../ProgressLoader/ProgressLoader";
import { Spin } from "antd";
import SpinComponent from "../mainLoader/loader";

const Loader = ({ progress }) => {
  const { t } = useTranslation();
  const location = window.location.href;
  const downloadMessageIndex = useSelector(
    (state) => state.DataRoomReducer.downloadMessage
  );
  const messages = [
    t("Securing-your-session-one-step-at-a-time"),
    t("Deploying-multiple-encryption-layers"),
    t("Obfuscating-network"),
    t("Containing-&-encrypting-network"),
    t("Securing-your-data"),
    t("Generating-new-key-for-security"),
    t("Encrypting-your-data"),
    t("Authenticating-your-credentials"),
    t("Generating-secure-token"),
    t("Authenticating-identity"),
    t("Authenticating-identity-&-encrypting-network"),
    t("Welcome-to-the-admin-panel-your-trusted-control-center"),
    t("Protecting-your-data-during-onboarding"),
    t("Protecting-your-data"),
    t("Advanced-data-protection-in-progress"),
    t("Securing-your-data-please-wait"),
    t("Downloading-file"),
  ];

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * messages.length);
    setRandomIndex(messages[randomIdx]);
  }, []);

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          
          {!location.toLowerCase().includes("/Diskus/".toLowerCase()) &&
          !location.toLowerCase().includes("/Admin/".toLowerCase()) ? (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className={styles["MainSpinner"]}>
                  <SpinComponent />
                </Col>
              </Row>
            </>
          ) : null}
          <ProgressLoader progress={progress} />
          {/* <Row>
            <Col lg={12} md={12} sm={12}>
              <p className={styles["Messeges_Styles"]}>{randomIndex}</p>
            </Col>
          </Row> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
