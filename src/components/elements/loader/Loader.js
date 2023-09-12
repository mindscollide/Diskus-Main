import React, { useState, useEffect } from "react"
import Logo from "../../../assets/images/newElements/Diskus_newLogo.svg"
import { Container, Row, Col } from "react-bootstrap"
import styles from "./Loader.module.css"
// import newlogo from "../../../assets/images/Newlogo.svg";
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import DikusGIF from "../../../assets/images/Loader.gif"

const Loader = () => {
  const { t } = useTranslation()
  const location = useLocation()
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
  ]

  const [randomIndex, setRandomIndex] = useState(0)

  useEffect(() => {
    if (location.pathname === "/") {
      setRandomIndex(messages[0])
    } else if (location.pathname === "/enterPassword") {
      setRandomIndex(messages[0])
    } else if (location.pathname === "/DisKus/meeting") {
      setRandomIndex(messages[1])
    } else if (location.pathname === "/Diskus/Admin/AllMeeting") {
      setRandomIndex(messages[1])
    } else if (location.pathname === "/DisKus/calendar") {
      setRandomIndex(messages[2])
    } else if (location.pathname === "/DisKus/dataroom") {
      setRandomIndex(messages[3])
    } else if (location.pathname === "/DisKus/Notes") {
      setRandomIndex(messages[4])
    } else if (location.pathname === "/DisKus/groups") {
      setRandomIndex(messages[5])
    } else if (location.pathname === "/DisKus/committee") {
      setRandomIndex(messages[6])
    } else if (location.pathname === "/DisKus/resolution") {
      setRandomIndex(messages[10])
    } else if (location.pathname === "/DisKus/setting") {
      setRandomIndex(messages[12])
    } else if (location.pathname === "/Diskus/Admin/Organization") {
      setRandomIndex(messages[12])
    } else if (location.pathname === "/Diskus/Admin/setting") {
      setRandomIndex(messages[12])
    } else if (location.pathname === "/DisKus/faq's") {
      setRandomIndex(messages[8])
    } else if (location.pathname === "/DisKus/todolist") {
      setRandomIndex(messages[4])
    } else if (location.pathname === "/DisKus/polling") {
      setRandomIndex(messages[6])
    } else if (location.pathname === "/Diskus/Admin/") {
      setRandomIndex(messages[13])
    } else if (location.pathname === "/Diskus/Admin/Summary") {
      setRandomIndex(messages[13])
    } else if (location.pathname === "/Diskus/Admin/AddUser") {
      setRandomIndex(messages[14])
    } else if (location.pathname === "/Diskus/Admin/EditUser") {
      setRandomIndex(messages[15])
    } else if (location.pathname === "/Diskus/Admin/AllUserPage") {
      setRandomIndex(messages[15])
    } else if (location.pathname === "/packageselection") {
      setRandomIndex(messages[15])
    } else if (location.pathname === "/paymentForm") {
      setRandomIndex(messages[17])
    } else if (location.pathname === "/Diskus/Admin/PackageDetail") {
      setRandomIndex(messages[17])
    } else if (location.pathname === "/Diskus/Admin/UpgradePackage") {
      setRandomIndex(messages[17])
    } else if (location.pathname === "/Diskus/Admin/UpgradePackageDetail") {
      setRandomIndex(messages[17])
    } else if (location.pathname === "/Diskus/Admin/paymentform") {
      setRandomIndex(messages[17])
    } else if (location.pathname === "/Diskus/Admin/CancelSub") {
      setRandomIndex(messages[17])
    } else {
      const randomIdx = Math.floor(Math.random() * messages.length)
      setRandomIndex(messages[randomIdx])
    }
  }, [])

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <img
            src={DikusGIF}
            className={styles["LoadderImageclass"]}
            alt="My GIF Icon"
          />
          <Row>
            <Col lg={12} md={12} sm={12}>
              <p className={styles["Messeges_Styles"]}>{randomIndex}</p>
            </Col>
          </Row>
          {/* <img src={newlogo} widt="269.97px" height="259.69px" />
          {localStorage.getItem("deleteContent") && (
            <p className={styles["deleteOrganizationContent"]}>
              {t("Please-wait-loader")}
            </p>
          )}
          <div className={styles["loader-line"]}></div> */}
        </Col>
      </Row>
    </Container>
  )
}

export default Loader
