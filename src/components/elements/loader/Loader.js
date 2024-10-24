import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import DikusGIF from "../../../assets/images/Loader.gif";
import { useSelector } from "react-redux";

const Loader = () => {
  const { t } = useTranslation();
  const downloadMessageIndex = useSelector(
    (state) => state.DataRoomReducer.downloadMessage
  );
  console.log(downloadMessageIndex, "downloadMessageIndexdownloadMessageIndex");
  const location = useLocation();
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
    t("Authenticating-your-credentials"),
    t("Containing-&-encrypting-network"),
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
    if (downloadMessageIndex === 1) {
      setRandomIndex(messages[18]);
    } else {
      if (location.pathname === "/") {
        setRandomIndex(messages[0]);
      } else if (location.pathname === "/enterPassword") {
        setRandomIndex(messages[0]);
      } else if (location.pathname === "/DisKus/meeting") {
        setRandomIndex(messages[1]);
      } else if (location.pathname === "/Admin/AllMeeting") {
        setRandomIndex(messages[1]);
      } else if (location.pathname === "/DisKus/calendar") {
        setRandomIndex(messages[2]);
      } else if (location.pathname === "/DisKus/dataroom") {
        setRandomIndex(messages[3]);
      } else if (location.pathname === "/DisKus/Notes") {
        setRandomIndex(messages[4]);
      } else if (location.pathname === "/DisKus/groups") {
        setRandomIndex(messages[5]);
      } else if (location.pathname === "/DisKus/committee") {
        setRandomIndex(messages[6]);
      } else if (location.pathname === "/DisKus/resolution") {
        setRandomIndex(messages[10]);
      } else if (location.pathname === "/DisKus/setting") {
        setRandomIndex(messages[12]);
      } else if (location.pathname === "/Admin/Organization") {
        setRandomIndex(messages[12]);
      } else if (location.pathname === "/Admin/setting") {
        setRandomIndex(messages[12]);
      } else if (location.pathname === "/DisKus/faq's") {
        setRandomIndex(messages[8]);
      } else if (location.pathname === "/DisKus/todolist") {
        setRandomIndex(messages[4]);
      } else if (location.pathname === "/DisKus/polling") {
        setRandomIndex(messages[6]);
      } else if (location.pathname === "/Admin/") {
        setRandomIndex(messages[13]);
      } else if (location.pathname === "/Admin/Summary") {
        setRandomIndex(messages[13]);
      } else if (location.pathname === "/Admin/AddUser") {
        setRandomIndex(messages[14]);
      } else if (location.pathname === "/Admin/EditUser") {
        setRandomIndex(messages[15]);
      } else if (location.pathname === "/Admin/AllUserPage") {
        setRandomIndex(messages[15]);
      } else if (location.pathname === "/packageselection") {
        setRandomIndex(messages[15]);
      } else if (location.pathname === "/paymentForm") {
        setRandomIndex(messages[17]);
      } else if (location.pathname === "/Admin/PackageDetail") {
        setRandomIndex(messages[17]);
      } else if (location.pathname === "/Admin/UpgradePackage") {
        setRandomIndex(messages[17]);
      } else if (location.pathname === "/Admin/UpgradePackageDetail") {
        setRandomIndex(messages[17]);
      } else if (location.pathname === "/Admin/paymentform") {
        setRandomIndex(messages[17]);
      } else if (location.pathname === "/Admin/CancelSub") {
        setRandomIndex(messages[17]);
      } else if (downloadMessageIndex === 1) {
        setRandomIndex(messages[18]);
      } else {
        const randomIdx = Math.floor(Math.random() * messages.length);
        setRandomIndex(messages[randomIdx]);
      }
    }
  }, [downloadMessageIndex]);

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <img
            src={DikusGIF}
            className={styles["LoadderImageclass"]}
            alt="My GIF Icon"
            draggable="false"
          />
          <Row>
            <Col lg={12} md={12} sm={12}>
              <p className={styles["Messeges_Styles"]}>{randomIndex}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
