import React, { useState } from "react";
import styles from "./TwoFactorVerifyUM.module.css";
import { Col, Container, Form, Row } from "react-bootstrap";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Button, Paper } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import img5 from "../../../../assets/images/5.png";
import img10 from "../../../../assets/images/10.png";
import img2 from "../../../../assets/images/2.png";
import img3 from "../../../../assets/images/3.png";
import { Link } from "react-router-dom";
import { style } from "@mui/system";
const TwoFactorVerifyUM = () => {
  const { t } = useTranslation();
  const [sendCodeEmailPhone, setSendCodeEmailPhone] = useState(false);
  const [sendCodeEmail, setSendCodeEmail] = useState(false);
  return (
    <Container fluid className={styles["auth_container"]}>
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
          <Paper className={styles["Two_fac_auth_paper"]}>
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
                  width={220}
                />
              </Col>
            </Row>

            <Form>
              <Row className="my-0">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center flex-column "
                >
                  <h3 className={styles["VerifyHeadingtwofac"]}>
                    {t("2fa-verification")}
                  </h3>
                  <span className={styles["SelectLinetwofac"]}>
                    {t("Select-any-one-option")}
                  </span>
                </Col>
              </Row>

              <Row className={styles["EmailBoxtwofac"]}>
                <Col sm={12} md={12} lg={12} className="mx-1">
                  <Row>
                    <Col sm={12} md={1} lg={1}>
                      {" "}
                      <img
                        draggable="false"
                        width={"15px"}
                        className={
                          !sendCodeEmailPhone
                            ? styles["two_fac_image"]
                            : styles["two_fac_image_active"]
                        }
                        src={img10}
                        alt=""
                      />
                    </Col>
                    <Col sm={12} md={9} lg={9}>
                      {" "}
                      <span
                        className={
                          !sendCodeEmailPhone
                            ? styles["EmailLabeltwofacboth_active"]
                            : styles["EmailLabeltwofacboth"]
                        }
                      >
                        {t("Send-code-on-sms")}
                      </span>
                    </Col>
                    <Col
                      sm={12}
                      md={2}
                      lg={2}
                      className="d-flex justify-content-end"
                    >
                      <Form.Check
                        type="radio"
                        name="TwoFactor"
                        className="cursor-pointer"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col sm={12} md={1} lg={1}>
                      <img
                        draggable="false"
                        width={"17px"}
                        src={img5}
                        className={
                          !sendCodeEmail
                            ? styles["two_fac_image"]
                            : styles["two_fac_image_active"]
                        }
                        alt=""
                      />
                    </Col>
                    <Col sm={12} md={9} lg={9}>
                      <span
                        className={
                          !sendCodeEmail
                            ? styles["sendCodeEmail_active"]
                            : styles["sendCodeEmail"]
                        }
                      >
                        {t("Send-code-on-email")}
                      </span>
                    </Col>
                    <Col
                      sm={12}
                      md={2}
                      lg={2}
                      className="d-flex justify-content-end"
                    >
                      <Form.Check
                        type="radio"
                        name="TwoFactor"
                        className="cursor-pointer"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-5 d-flex justify-content-center">
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Verify").toUpperCase()}
                    iconClass="d-none"
                    className={styles["Next_button_EmailVerifyForTwoFac"]}
                    pdfIconClass="d-none"
                    align="center"
                  />
                </Col>
              </Row>
            </Form>
            <Row className="mt-2">
              <Col
                sm={12}
                md={12}
                lg={12}
                className={styles["forogt_email_link"]}
              >
                <Link to="/">{t("Go-back")}</Link>
              </Col>
            </Row>
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
                className="phone-image user-select-none"
              />
            </Col>
            <Col sm={12} md={6} lg={6} className="position-relative vh-100">
              <img
                draggable="false"
                src={img3}
                alt="auth_icon"
                width="600px"
                className="Auth_Icon"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TwoFactorVerifyUM;
