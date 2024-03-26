import React from "react";
import styles from "./VerificationEmailAndNumber.module.css";
import { Col, Container, Row } from "react-bootstrap";
import img2 from "../../../../../assets/images/7.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import { Link } from "react-router-dom";
import {
  Button,
  Paper,
  VerificationInputField,
} from "../../../../../components/elements";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { useTranslation } from "react-i18next";
const VerificationEmailAndNumber = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid className="VerifyCodeOneOverflow">
        <Row className="position-relative">
          <Col className="languageSelector">
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
            <Paper className="OTP_auth_paper">
              <Col sm={12} lg={12} md={12} className="EmailVerifyOTPbox">
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center mb-3"
                  >
                    <img
                      draggable="false"
                      src={DiskusLogo}
                      alt="diskus_logo"
                      width={220}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="mt-4">
                    <span className={styles["TwoFa_heading"]}>
                      {t("2fa-verification")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className={styles["verify_heading_line1"]}>
                      {t("6-digit-code-has-sent-on-to-this")}
                    </p>
                    <p className={styles["verify_heading_line2"]}>
                      {t("Number")}:
                    </p>
                    <p className={styles["verify_heading_line2"]}>
                      {t("Email")}:
                    </p>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["Enter-Code-Label"]}
                  >
                    <VerificationInputField
                      label={t("Enter-code")}
                      fields={6}
                      applyClass="OTPInput"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-left d-flex justify-content-start align-items-center gap-2">
                    <Button
                      className={styles["resendCode_btn"]}
                      text={t("Resend-code-in")}
                    />
                    <span className="OTPCounter">0:00</span>
                  </Col>
                </Row>
                <Row className=" mt-5 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text={t("Verify")}
                      className={styles["subscribNow_button_EmailVerify"]}
                      type="submit"
                    />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["Go_back_link_VerifyCodeOne"]}
                  >
                    <Link>{t("Go-back")}</Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  draggable="false"
                  src={img2}
                  alt="auth_icon"
                  width="380px"
                  className="phone-image"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  draggable="false"
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="Auth_Icon"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerificationEmailAndNumber;
