import React, { useState } from "react";
import styles from "./PasswordVerification.module.css";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { Link } from "react-router-dom";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import { Col, Container, Form, Row } from "react-bootstrap";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Button, Checkbox, Paper } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
const PasswordVerification = () => {
  const { t } = useTranslation();

  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);

  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  return (
    <Container fluid className={styles["auth_container"]}>
      <Row className="position-relative">
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col
          lg={4}
          md={4}
          sm={12}
          className="d-flex justify-content-center align-items-center min-vh-100"
        >
          <Paper className={styles["loginbox_auth"]}>
            <Col sm={12} lg={12} md={12} className={styles["EmailVerifyBox"]}>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center"
                >
                  <img draggable="false" src={DiskusLogo} alt="diskus_logo" />
                </Col>
              </Row>
              <Row className="text-center mt-3 mb-4">
                <Col>
                  <span className={styles["signIn_heading"]}>
                    {t("Sign-in")}
                  </span>
                </Col>
              </Row>
              <Form>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="Enter-password-field position-relative d-flex justify-content-cente"
                  >
                    <Form.Control
                      className={styles["PasswordTextField"]}
                      type={showNewPasswordIcon ? "text" : "password"}
                      //   name="MyUniquePasswordField"
                      //   ref={passwordRef}
                      //   value={password || ""}
                      //   onChange={passwordChangeHandler}
                      placeholder={t("Password")}
                      iconClassName={styles["IconStyle"]}
                      labelClass="lightLabel"
                      autoComplete="off"
                      maxLength={200}
                    />
                    <span
                      className={styles["passwordIcon"]}
                      onClick={showNewPassowrd}
                    >
                      {showNewPasswordIcon ? (
                        <img
                          draggable="false"
                          alt=""
                          src={PasswordHideEyeIcon}
                        />
                      ) : (
                        <img draggable="false" alt="" src={PasswordEyeIcon} />
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p
                      className={
                        errorBar
                          ? ` ${styles["errorMessage-inLogin"]} `
                          : `${styles["errorMessage-inLogin_hidden"]}`
                      }
                    >
                      {errorMessage}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                    <Checkbox
                      classNameDiv=""
                      //   checked={remeberPassword}
                      //   onChange={rememberPasswordCheck}
                    />
                    <span className={styles["Remember-password"]}>
                      {t("Remember-password")}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-5 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center "
                  >
                    <Button
                      text={t("Sign-in")}
                      //   onClick={loginHandler}
                      className={styles["Next_button_EmailVerify"]}
                    />
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["forogt_email_link"]}
                >
                  <Link
                    to="/forgotpasssowrd"
                    className={styles["ForgotPassword"]}
                  >
                    {t("Forgot-password")}
                  </Link>
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
            <h1 className={styles["heading-1"]}>{t("Simplify-management")}</h1>
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
  );
};

export default PasswordVerification;
