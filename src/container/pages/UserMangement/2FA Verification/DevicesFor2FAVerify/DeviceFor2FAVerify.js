import React, { useEffect, useState } from "react";
import { Button, Paper, Loader } from "../../../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import styles from "./DeviceFor2FAVerify.module.css";
import { useTranslation } from "react-i18next";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { sendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { LoginFlowRoutes } from "../../../../../store/actions/UserManagementActions";

const DeviceFor2FAVerify = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { Authreducer, LanguageReducer } = useSelector((state) => state);

  const [xtrazoom, setXtrazoom] = useState(false);
  const [codeemail, setCodeemail] = useState(false);
  const [codesms, setCodesms] = useState(false);
  const { t } = useTranslation();

  const [currentDevice, setCurrentDevice] = useState({
    DeviceName: "",
    UserDeviceID: 0,
    DeviceRegistrationToken: "",
  });

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

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

  const onClickRealmeXtra = async (e) => {
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    let UserID = localStorage.getItem("userID");
    e.preventDefault();
    if (xtrazoom) {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "BROWSER",
        DeviceID: "1",
        OrganizationID: OrganizationID,
        isEmail: codeemail,
        isSMS: codesms,
        isDevice: xtrazoom,
        UserDevices: [
          {
            DeviceName: currentDevice.DeviceName,
            UserDeviceID: currentDevice.UserDeviceID,
            DeviceRegistrationToken: currentDevice.DeviceRegistrationToken,
          },
        ],
      };
      await dispatch(
        sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes)
      );
      localStorage.setItem("GobackSelection", 2);
      localStorage.setItem("currentDevice", JSON.stringify(currentDevice));
    } else {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "BROWSER",
        DeviceID: "1",
        OrganizationID: OrganizationID,
        isEmail: codeemail,
        isSMS: codesms,
        isDevice: xtrazoom,
        UserDevices: [],
      };
      localStorage.setItem("GobackSelection", 2);
      await dispatch(
        sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes)
      );
    }
  };

  const handleGoBack = () => {
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };

  useEffect(() => {
    if (
      Authreducer.AuthenticateAFAResponse !== null &&
      Authreducer.AuthenticateAFAResponse !== undefined
    ) {
      if (Authreducer.AuthenticateAFAResponse.userDevices.length > 0) {
        let DeviceDetail = Authreducer.AuthenticateAFAResponse.userDevices;
        let data = {
          DeviceName: DeviceDetail[0].deviceName,
          UserDeviceID: DeviceDetail[0].pK_UDID,
          DeviceRegistrationToken: DeviceDetail[0].deviceRegistrationToken,
        };
        localStorage.setItem("currentDevice", JSON.stringify(data));
        setCurrentDevice({
          DeviceName: DeviceDetail[0].deviceName,
          UserDeviceID: DeviceDetail[0].pK_UDID,
          DeviceRegistrationToken: DeviceDetail[0].deviceRegistrationToken,
        });
      }
    }
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      let currentDevice = JSON.parse(localStorage.getItem("currentDevice"));

      if (currentDevice != undefined && currentDevice != null) {
        setCurrentDevice({
          DeviceName: currentDevice.DeviceName,
          UserDeviceID: currentDevice.UserDeviceID,
          DeviceRegistrationToken: currentDevice.DeviceRegistrationToken,
        });
      }
    }
  }, [Authreducer.AuthenticateAFAResponse]);

  console.log(
    Authreducer.AuthenticateAFAResponse,
    "AuthreducerAuthenticateAFAResponse"
  );

  let newClient = Helper.socket;
  useEffect(() => {
    if (newClient != null && newClient != "" && newClient != undefined) {
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID);
      }
    }
  }, [Helper.socket]);

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
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
                <span
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
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img10}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !xtrazoom
                                    ? styles["SendRealmeXtraZoomColor_active"]
                                    : styles["SendRealmeXtraZoomColor"]
                                }
                              >
                                {t("Send-notification-on-device")}{" "}
                                {currentDevice?.DeviceName}
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
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img5}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !codeemail
                                    ? styles["SendRealmeXtraZoomColor_active"]
                                    : styles["SendRealmeXtraZoomColor"]
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
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img6}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !codesms
                                    ? styles["SendRealmeXtraZoomColor_active"]
                                    : styles["SendRealmeXtraZoomColor"]
                                }
                              >
                                {t("Send-code-on-sms")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                value={"SEND CODE ON SMS"}
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
                            className={
                              styles["Next_button_EmailVerifySendEmailRealme"]
                            }
                            onClick={onClickRealmeXtra}
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
                      <Link onClick={handleGoBack}>{t("Go-back")}</Link>
                    </Col>
                  </Row>
                </span>
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
                  className={styles["phone-image"]}
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  draggable="false"
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  className={styles["Auth_Icon1SendEmailRealme"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>{" "}
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default DeviceFor2FAVerify;
