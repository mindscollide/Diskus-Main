import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
  VerificationInputField,
} from "./../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "./../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./ForgotPasswordVerificaiton.module.css";
import DiskusAuthPageLogo from "./../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../assets/images/newElements/Language.svg";

const ForgotPasswordVerification = () => {
  const [disablebtnverify, setDisablebtnverify] = useState(true);
  const handleChangeButtonVerification = (e) => {
    console.log("handleChangeButton", e);
    if (e != "") {
      setDisablebtnverify(false);
    } else {
      setDisablebtnverify(true);
    }
  };
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  console.log("currentLocale", currentLocale);

  // let currentLanguage = localStorage.getItem("i18nextLng");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row>
          <Col className={styles["languageselect-box"]}>
            <select
              className={
                styles["Forgot_Password_Verification_select-language-signin"]
              }
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option
                  key={code}
                  value={code}
                  className={
                    styles["Forgot_password_Verification_language_options"]
                  }
                >
                  {name}
                </option>
              ))}
            </select>
            <img
              src={LanguageChangeIcon}
              className={styles["Forgot_password_Verification_languageIcon"]}
            />
          </Col>
        </Row>

        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper
              className={
                styles["Forgot_password_Verification_loginbox_auth_paper"]
              }
            >
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["ForgotPassword_Verification_EmailVerifyBox"]}
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <img src={DiskusLogo} alt="diskus_logo" />
                  </Col>
                </Row>
                <Form>
                  <Row className="mt-5 ">
                    <Col sm={12} md={12} lg={12}  className={styles["OTPHandler"]}>
                      <span className={styles["EmailVerifyLabel"]}>
                        Enter Verification Code
                      </span>
                      <VerificationInputField
                        fields={6}
                        applyClass="OTPInput"
                        change={handleChangeButtonVerification}
                       
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-left d-flex justify-content-between">
                      <span className={styles["Forgot_Password_Verification_OTPCounter"]}>
                        Didn't Reiceive the Code?
                        <a className={styles["Forgot_Password_Verification_ResendCode"]}>Resend Code</a>
                      </span>
                    </Col>
                  </Row>

                  <Row className="mt-5 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center mt-1 "
                    >
                      <Button
                        text={t("Next")}
                        // onClick={loginHandler}
                        className={
                          styles[
                            "Forgot_Password_Verification_Next_button_EmailVerify"
                          ]
                        }
                        disableBtn={disablebtnverify}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      styles["Forgot_passwordforogt_verification_email_link"]
                    }
                  >
                    <Link to="/">{t("Back-to-Sign-In")}</Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className="position-relative d-flex overflow-hidden"
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
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Forgot_Password_Verification_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      {/* {auth.Loading ? <Loader /> : null} */}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ForgotPasswordVerification;
