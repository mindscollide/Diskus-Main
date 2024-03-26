import { Button, Paper } from "../../../../../components/elements";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import styles from "./DeviceFor2FAVerify.module.css";
import { useTranslation } from "react-i18next";
const DeviceFor2FAVerify = () => {
  const { t } = useTranslation();

  const [xtrazoom, setXtrazoom] = useState(false);
  const [codeemail, setCodeemail] = useState(false);
  const [codesms, setCodesms] = useState(false);

  const onChangeHandlerSendRealmeXtra1 = (e) => {
    setXtrazoom(true);
    setCodeemail(false);
    setCodesms(false);
  };
  const onChangeHandlerSendRealmeXtra2 = (e) => {
    setCodeemail(true);
    setXtrazoom(false);
    setCodesms(false);
  };
  const onChangeHandlerSendRealmeXtra3 = (e) => {
    setCodesms(true);
    setCodeemail(false);
    setXtrazoom(false);
  };
  return (
    <>
      <Container fluid className="auth_container">
        <Row className="position-relative">
          <Col className="languageSelector">
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col lg={5} md={5} sm={12}>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center align-items-center min-vh-100"
              >
                <Paper
                  className={styles["Send_Email_Realme_sendmailwithdevice"]}
                >
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className={styles["EmailVerifyBox_sendmailwithdevice"]}
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
                          width={220}
                          alt="diskus_logo"
                        />
                      </Col>
                    </Row>

                    <Form>
                      <Row className=" ">
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center flex-column"
                        >
                          <h3
                            className={
                              styles["VerifyHeading_sendmailwithdevice"]
                            }
                          >
                            {t("2fa-verification")}
                          </h3>
                          <span className={styles["SelectLine"]}>
                            {t("Select-any-one-option")}
                          </span>
                        </Col>
                      </Row>

                      <Row className="">
                        <Col sm={12} md={12} lg={12} className="mx-2">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img
                                draggable="false"
                                width={"15px"}
                                className={
                                  !xtrazoom
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img10}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !xtrazoom
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                {t("Send-notification-on-device")}{" "}
                                {/* {currentDevice?.DeviceName} */}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                onChange={onChangeHandlerSendRealmeXtra1}
                              />
                            </Col>
                          </Row>

                          <Row className="my-2">
                            <Col sm={12} md={1} lg={1}>
                              <img
                                draggable="false"
                                width={"17px"}
                                className={
                                  !codeemail
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img5}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !codeemail
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                {t("Send-code-on-email")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                onChange={onChangeHandlerSendRealmeXtra2}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img
                                draggable="false"
                                width={"17px"}
                                className={
                                  !codesms
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img6}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !codesms
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                {t("Send-code-on-sms")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                // value={"SEND CODE ON SMS"}
                                onChange={onChangeHandlerSendRealmeXtra3}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-center mt-5 mb-1">
                        <Col sm={12} lg={12} md={12}>
                          <Button
                            text={t("Send-code")}
                            className="Next_button_EmailVerifySendEmailRealme"
                            // onClick={onClickRealmeXtra}
                            disableBtn={
                              xtrazoom || codeemail || codesms ? false : true
                            }
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Row className="">
                    <Col sm={12} md={12} lg={12} className="forogt_email_link">
                      <Link to="/">{t("Go-back")}</Link>
                    </Col>
                  </Row>
                </Paper>
              </Col>
            </Row>
          </Col>
          <Col md={7} lg={7} sm={12} className="">
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
    </>
  );
};

export default DeviceFor2FAVerify;
