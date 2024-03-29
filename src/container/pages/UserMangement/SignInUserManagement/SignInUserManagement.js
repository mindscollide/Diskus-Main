import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Button, Paper, Checkbox } from "../../../../components/elements";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./SignInUserMangement.module.css";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import SignUpOrganizationUM from "../../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import { useNavigate } from "react-router-dom";
// import SignupProcessUserManagement from "../../SignUpProcessUserManagement/SignupProcessUserManagement";

const SignInUserManagement = ({ setCurrentStep }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSubscribeNowButton = () => {
    setCurrentStep(9);
    navigate("/Signup");
  };

  const handleClickFreeTrail = () => {
    localStorage.setItem("PackageID", 4);
    localStorage.setItem("TenureOfSuscriptionID", 2);
    setCurrentStep(9);
    navigate("/Signup", {
      state: {
        freeTrail: true,
      },
    });
  };
  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <section className={styles["freetrail_banner"]}>
              <span className={styles["freetrail_heading"]}>
                {t("Start-your-Free-Trial-now")}
              </span>
              <span
                className={styles["Free-Trial_btn"]}
                onClick={handleClickFreeTrail}
              >
                {t("Free-Trial")}
              </span>
            </section>
          </Col>
        </Row>
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12} className={styles["SignInEmailBox"]}>
            <Paper className={styles["EmailVerifyBox"]}>
              <Col sm={12} lg={12} md={12}>
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
                <Row className="mt-4 mb-4 text-center">
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      {t("Sign-in")}
                    </span>
                  </Col>
                </Row>
                <Form>
                  <Row className="">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center flex-column"
                    >
                      <Form.Control
                        required
                        className={styles["inputEmailField"]}
                        width="100%"
                        placeholder={t("Email")}
                        maxLength={160}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <Checkbox
                        classNameDiv=""
                        className={styles["RememberEmail"]}
                      />
                      <span className="Remember_checkbox_styles Arabicstyles_Subtotal_Not_include_taxes">
                        {t("Remeber-email")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-4 mb-1 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center  "
                    >
                      <Button
                        text={t("Next")}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-3">
                  <Col sm={12} md={12} lg={12}>
                    {" "}
                    <span className={styles["signup-text-inloginpage"]}>
                      {t("Havent-subscribed-yet")}
                    </span>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center mt-1">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="w-100 d-flex justify-content-center"
                  >
                    <Button
                      text={t("Subscribe-now")}
                      onClick={handleSubscribeNowButton}
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

export default SignInUserManagement;
