import React, { useState, useEffect } from "react";
import Logo from "../../../assets/images/newElements/Diskus_newLogo.svg";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
import newlogo from "../../../assets/images/Newlogo.svg";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const Loader = () => {
  const { t } = useTranslation();
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
  ];

  console.log(location.pathname, "locationpathname");
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * messages.length);
    setRandomIndex(randomIdx);
  }, []);

  return (
    <Container className={styles["main-container"]} data-tut="welcomescreen">
      <Row className={styles["overlay-box"]}>
        <Col className={styles["overlay"]}></Col>
        <Col className={styles["overlay-content"]}>
          <img src={newlogo} widt="269.97px" height="259.69px" />
          {localStorage.getItem("deleteContent") && (
            <p className={styles["deleteOrganizationContent"]}>
              {t("Please-wait-loader")}
            </p>
          )}
          <div className={styles["loader-line"]}></div>
          <Row>
            <Col lg={12} md={12} sm={12}>
              {location.pathname === "/" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[0]}</p>
                </>
              ) : null}
              {location.pathname === "/enterPassword" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[0]}</p>
                </>
              ) : null}

              {location.pathname === "/DisKus/meeting" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[1]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/AllMeeting" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[1]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/calendar" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[2]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/dataroom" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[3]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/Notes" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[4]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/groups" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[5]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/committee" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[6]}</p>
                </>
              ) : null}

              {location.pathname === "/DisKus/resolution" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[10]}</p>
                </>
              ) : null}

              {location.pathname === "/DisKus/setting" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[12]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/Organization" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[12]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/setting" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[12]}</p>
                </>
              ) : null}

              {location.pathname === "/DisKus/faq's" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[8]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/todolist" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[4]}</p>
                </>
              ) : null}
              {location.pathname === "/DisKus/polling" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[6]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[13]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/Summary" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[13]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/AddUser" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[14]}</p>
                </>
              ) : null}
              {location.pathname === "/Diskus/Admin/EditUser" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[15]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/AllUserPage" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[15]}</p>
                </>
              ) : null}

              {location.pathname === "/packageselection" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[16]}</p>
                </>
              ) : null}

              {location.pathname === "/paymentForm" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/PackageDetail" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/UpgradePackage" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/UpgradePackageDetail" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/paymentform" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}

              {location.pathname === "/Diskus/Admin/CancelSub" ? (
                <>
                  <p className={styles["Messeges_Styles"]}>{messages[17]}</p>
                </>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
