import React, { useState } from "react";
import styles from "./VerifyOTPUM.module.css";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Col, Container, Row } from "react-bootstrap";
import {
  Button,
  Paper,
  VerificationInputField,
} from "../../../../components/elements";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
const VerifyOTPUM = ({ setSignupStep }) => {
  const { t, i18n } = useTranslation();

  const currentLocale = Cookies.get("i18next") || "en";

  const [key, setKey] = useState(1);
  const [errorBar, setErrorBar] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOTP, setVerifyOTP] = useState("");
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  const [startTimer, setStartTimer] = useState(false);

  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const [language, setLanguage] = useState(currentLocale);

  // Languages
  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

  const changeHandler = (e) => {
    let otpval = e.toUpperCase();
    setVerifyOTP(otpval);
  };

  const verifyOTPClickHandler = (e) => {
    setSignupStep(4);
    Navigate("/Signup");
  };

  return (
    <>
      <Row>
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Container fluid>
        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className={styles["OTP_auth_paper"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["EmailVerifyOTPbox"]}
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
                      src={DiskusLogo}
                      alt="diskus_logo"
                      width="225px"
                      height="80px"
                    />
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      {t("Verify-your-email")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span className={styles["signIn_heading_line"]}>
                      {t("6-digit-code-has-sent-on-your-email")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col sm={12} md={12} lg={12} className="Enter-Code-Label">
                    <VerificationInputField
                      label={t("Enter-code")}
                      fields={6}
                      applyClass={styles["OTPInput"]}
                      change={changeHandler}
                      key={key}
                      value={verifyOTP}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="text-left d-flex justify-content-center gap-3">
                    {/* <Button
                      className={styles["resendCode_btn"]}
                      disableBtn={seconds > 0 || minutes > 0}
                      text={t("Resend-code-in")}
                      //   onClick={sendRequestResend}
                    /> */}
                    <span className={styles["OTPCounter"]}>
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p
                      className={
                        errorBar
                          ? ` ${styles["errorMessage-OTP"]} `
                          : `${styles["errorMessage-OTP_hidden"]}`
                      }
                    >
                      {errorMessage}
                    </p>
                  </Col>
                </Row>
                <Row className="d-flex mt-3 justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text={t("Resend-code")}
                      onClick={verifyOTPClickHandler}
                      className={styles["subscribNow_button_EmailVerify"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className="position-relative d-flex  overflow-hidden"
          >
            <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
              <h1 className={styles["heading-1"]}>
                {t("Simplify-management")}
              </h1>
              <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
              <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
            </Col>
            <Col md={4} lg={4} sm={12} className="position-relative">
              <img
                draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VerifyOTPUM;
