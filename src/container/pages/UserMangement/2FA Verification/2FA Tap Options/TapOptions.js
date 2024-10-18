import React from "react";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import styles from "./TapOptions.module.css";
import { Col, Container, Row } from "react-bootstrap";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { Button, Paper } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const TapOptions = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className={styles["VerificationCodeThree"]}>
      <Row className="position-relative">
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col
          lg={5}
          md={5}
          sm={12}
          className="d-flex justify-content-center align-items-center min-vh-100"
        >
          <Paper
            className={styles["loginbox_auth_paper_for_openyourrealmextra"]}
          >
            <Col
              sm={12}
              lg={12}
              md={12}
              className={styles["EmailVerifyBox_for_openyourrealmextra"]}
            >
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center "
                >
                  <img
                    draggable="false"
                    src={img1}
                    width="220px"
                    height="69px"
                    alt=""
                  />
                </Col>
              </Row>

              <Row className="mt-4 ">
                <Col sm={12} md={12} lg={12} className="text-cemter-ur pe-1">
                  <p className={styles["Heading-Style"]}>
                    {t("Open-your")}
                    <span className={styles["deviceName"]}>Iphone 12</span>
                  </p>
                </Col>
              </Row>

              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="mt-2 d-flex justify-content-center"
                >
                  <img
                    draggable="false"
                    width="47.2px"
                    height="65.76px"
                    src={img10}
                    alt=""
                  />
                </Col>
              </Row>

              <Row>
                <Col sm={12} md={12} lg={12} className="mt-4">
                  <ul>
                    <li className={styles["List_Components-verification"]}>
                      {t("Tap-on")}
                      <span className={styles["anchor_tag_text"]}>
                        {t("Diskus")}
                      </span>
                      <span className={styles["space"]}></span>
                      {t("Notification")}
                    </li>
                    <li className={styles["List_Components-verification"]}>
                      {t("Click-on")}
                      <span className={styles["anchor_tag_text1"]}>
                        {t("Yes")}
                      </span>
                      <span className={styles["space"]}></span>
                      {t("to-sign-in")}
                    </li>
                  </ul>
                </Col>
              </Row>

              <Row>
                <Col sm={12} lg={12} md={12} className="text-center mt-3">
                  <span className={styles["OTPCounter_for_openrealmextra"]}>
                    0:0
                  </span>
                </Col>
              </Row>

              <Row className="mt-1 d-flex justify-content-center">
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className="d-flex justify-content-center "
                >
                  <Button
                    text={t("Send-again").toUpperCase()}
                    className={
                      styles["Next_button_EmailVerify_For_openyourrealmextra"]
                    }
                  />
                </Col>
              </Row>
              <Row className="mt-1">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["forogt_email_link_for_openrealmextra"]}
                >
                  <Link>{t("Go-back")}</Link>
                </Col>
              </Row>
            </Col>
          </Paper>
        </Col>

        <Col md={7} lg={7} sm={12} className="">
          <Row>
            <Col sm={12} md={6} lg={6} className="position-relative">
              <img
                draggable="false"
                src={img9}
                alt="auth_icon"
                className={styles["phone-image"]}
                height="417px"
              />
            </Col>
            <Col sm={12} md={6} lg={6} className="position-relative vh-100">
              <img
                draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                className={styles["Verification_Code_Three_Auth_Icon"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TapOptions;
