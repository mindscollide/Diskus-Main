import React, { useEffect, useState } from "react";
import styles from "./TwoFactorVerifyUM.module.css";
import { Col, Container, Form, Row } from "react-bootstrap";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Button, CustomRadio2 } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import img5 from "../../../../assets/images/5.png";
import img10 from "../../../../assets/images/10.png";
import img2 from "../../../../assets/images/2.png";
import img3 from "../../../../assets/images/3.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { sendTwoFacAction } from "../../../../store/actions/TwoFactorsAuthenticate_actions";
import Helper from "../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../commen/functions/mqttconnection";
import { LoginFlowRoutes } from "../../../../store/actions/UserManagementActions";
import CustomRadioGroup from "../../../../components/elements/radio/CustomRadioGroup";
const TwoFactorVerifyUM = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [twoFactorMethod, setTwoFactorMethod] = useState(null);
  // values: "sms" | "email"

  const [sendCodeEmailPhone, setSendCodeEmailPhone] = useState(false);
  const [sendCodeEmail, setSendCodeEmail] = useState(false);

  const onChangeHandlerTwoFactor = (value) => {
    setTwoFactorMethod(value);
  };

  //onChange For Email
  const onChangeHandlerSendEmail = (e) => {
    setSendCodeEmail(true);
    setSendCodeEmailPhone(false);
  };

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4,
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60,
  );

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  //Click Handler For Sending Two Factor
  const onClickHnadler = (e) => {
    e.preventDefault();
    let userID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    const Data = {
      UserID: JSON.parse(userID),
      Device: "Browser",
      DeviceID: "1",
      OrganizationID: JSON.parse(OrganizationID),
      isEmail: twoFactorMethod === "email",
      isSMS: twoFactorMethod === "sms",
      isDevice: false,
      UserDevices: [],
    };

    localStorage.setItem("GobackSelection", 1);
    console.log(Data, "onClickHnadleronClickHnadler");
    // dispatch(sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes));
  };

  let newClient = Helper.socket;

  useEffect(() => {
    if (newClient !== null && newClient !== "" && newClient !== undefined) {
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
  }, [Helper.socket]);

  //handle Go Back Button

  const handleGoBackButton = () => {
    console.log("goback");

    localStorage.setItem("LoginFlowPageRoute", 2);
    dispatch(LoginFlowRoutes(2));
  };

  return (
    <>
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
            <span className={styles["Two_fac_auth_paper"]}>
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="d-flex justify-content-center "
                >
                  <img
                    draggable="false"
                    src={
                      localStorage.getItem("i18nextLng") === "ar"
                        ? DiskusLogoArabic
                        : DiskusLogo
                    }
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

                <Row className="mt-3">
                  <Col sm={12} md={12} lg={12} className="w-100">
                    <CustomRadioGroup
                      value={twoFactorMethod}
                      className="cursor-pointer"
                      onChange={(e) => onChangeHandlerTwoFactor(e.target.value)}
                      is2FA={true}
                      options={[
                        {
                          label: (
                            <div className="d-flex justify-content-start mb-2 align-items-center gap-2">
                              <img
                                draggable="false"
                                width="15px"
                                className={
                                  twoFactorMethod !== "sms"
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img10}
                                alt=""
                              />
                              <span
                                className={
                                  twoFactorMethod === "sms"
                                    ? styles["EmailLabeltwofacboth"]
                                    : styles["EmailLabeltwofacboth_active"]
                                }
                              >
                                {t("Send-code-on-sms")}
                              </span>
                            </div>
                          ),
                          value: "sms",
                        },
                        {
                          label: (
                            <div className="d-flex justify-content-start align-items-center gap-2">
                              <img
                                draggable="false"
                                width="17px"
                                src={img5}
                                className={
                                  twoFactorMethod !== "email"
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                alt=""
                              />
                              <span
                                className={
                                  twoFactorMethod === "email"
                                    ? styles["sendCodeEmail"]
                                    : styles["sendCodeEmail_active"]
                                }
                              >
                                {t("Send-code-on-email")}
                              </span>
                            </div>
                          ),
                          value: "email",
                        },
                      ]}
                    />

                    {/* <CustomRadioGroup
                      value={sendCodeEmailPhone}
                      className="cursor-pointer"
                      onChange={(e) => onChangeHandlerTwoFactor(e.target.value)}
                      is2FA={true}
                      options={[
                        {
                          label: (
                            <div className="d-flex justify-content-start mb-2 align-items-center gap-2">
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
                              <span
                                className={
                                  !sendCodeEmailPhone
                                    ? styles["EmailLabeltwofacboth_active"]
                                    : styles["EmailLabeltwofacboth"]
                                }
                              >
                                {t("Send-code-on-sms")}
                              </span>
                            </div>
                          ),
                          value: sendCodeEmailPhone,
                        },
                        {
                          label: (
                            <div className="d-flex justify-content-start align-items-center gap-2">
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
                              <span
                                className={
                                  !sendCodeEmail
                                    ? styles["sendCodeEmail_active"]
                                    : styles["sendCodeEmail"]
                                }
                              >
                                {t("Send-code-on-email")}
                              </span>
                            </div>
                          ),
                          value: sendCodeEmailPhone,
                        },
                      ]}
                    /> */}
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
                      onClick={onClickHnadler}
                      disableBtn={!twoFactorMethod}
                      iconClass="d-none"
                      pdfIconClass="d-none"
                      className={styles["Next_button_EmailVerifyForTwoFac"]}
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
                  <span className="cursor-pointer" onClick={handleGoBackButton}>
                    {t("Go-back")}
                  </span>
                </Col>
              </Row>
            </span>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  draggable="false"
                  src={img2}
                  alt="auth_icon"
                  className={styles["phone-image"]}
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  draggable="false"
                  src={img3}
                  alt="auth_icon"
                  className={styles["Auth_Icon"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TwoFactorVerifyUM;
