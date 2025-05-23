import React, { useEffect, useState } from "react";
import styles from "./TwoFactorMultipleDevices.module.css";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import Helper from "../../../../../commen/functions/history_logout";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "../../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";
import img2 from "../../../../../assets/images/2.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  TwoFaAuthenticate,
  sendTwoFacAction,
} from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import Cookies from "js-cookie";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Button, Notification } from "../../../../../components/elements";
import { LoginFlowRoutes } from "../../../../../store/actions/UserManagementActions";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
const TwoFactorMultipleDevices = () => {
  const AuthreducerAuthenticateAFAResponse = useSelector(
    (state) => state.Authreducer.AuthenticateAFAResponse
  );

  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [currentDevice, setCurrentDevice] = useState([
    {
      DeviceName: "",
      UserDeviceID: "",
      DeviceRegistrationToken: "",
    },
  ]);

  const [notificationdevice, setNotificationdevice] = useState(false);
  const [notificationemail, setNotificationemail] = useState(false);
  const [notificationsms, setNotificationsms] = useState(false);

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  let newClient = Helper.socket;

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

  const changeHandler1 = (e) => {
    setNotificationdevice(true);
    setNotificationemail(false);
    setNotificationsms(false);
  };

  const changeHandler2 = (e) => {
    setNotificationemail(true);
    setNotificationdevice(false);
    setNotificationsms(false);
  };

  const changeHandler3 = (e) => {
    setNotificationsms(true);
    setNotificationdevice(false);
    setNotificationemail(false);
  };

  const onClickSendOnDevice = (e) => {
    e.preventDefault();
    let UserID = localStorage.getItem("userID");
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    if (notificationdevice) {
      if (currentDevice[0].DeviceName !== "") {
        localStorage.setItem("GobackSelection", 3);
        localStorage.setItem("currentDevice", JSON.stringify(currentDevice));
        localStorage.setItem("LoginFlowPageRoute", 15);
        dispatch(LoginFlowRoutes(15));
      } else {
        showMessage(t("0-device-not-found"), "error", setOpen);
      }
    } else {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "BROWSER",
        DeviceID: "1",
        OrganizationID: OrganizationID,
        isEmail: notificationemail,
        isSMS: notificationsms,
        isDevice: notificationdevice,
        UserDevices: [],
      };
      localStorage.setItem("GobackSelection", 3);
      dispatch(sendTwoFacAction(t, navigate, Data, setSeconds, setMinutes));
    }
  };

  useEffect(() => {
    if (
      AuthreducerAuthenticateAFAResponse !== null &&
      AuthreducerAuthenticateAFAResponse !== undefined
    ) {
      if (AuthreducerAuthenticateAFAResponse.userDevices.length > 0) {
        let DeviceDetail = AuthreducerAuthenticateAFAResponse.userDevices;
        let Devices = [];
        DeviceDetail.forEach((data) => {
          Devices.push({
            DeviceName: data.deviceName,
            UserDeviceID: data.pK_UDID,
            DeviceRegistrationToken: data.deviceRegistrationToken,
          });
        });
        setCurrentDevice(Devices);
      }
    }
  }, [AuthreducerAuthenticateAFAResponse]);

  useEffect(() => {
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      let organizationID = localStorage.getItem("organizationID");
      let userID = localStorage.getItem("userID");
      if (organizationID != undefined && userID != undefined) {
        dispatch(
          TwoFaAuthenticate(
            t,
            organizationID,
            userID,
            navigate,
            setSeconds,
            setMinutes
          )
        );
      }
    }
  }, []);

  useEffect(() => {
    if (newClient !== null && newClient !== "" && newClient !== undefined) {
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
  }, [Helper.socket]);

  const handleGoback = () => {
    console.log("goback");

    localStorage.setItem("LoginFlowPageRoute", 2);
    dispatch(LoginFlowRoutes(2));
  };

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row className='position-relative'>
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
                className='d-flex justify-content-center align-items-center min-vh-100'>
                <span className={styles["Send_Email_multipleDevice"]}>
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className={styles["EmailVerifyBoxSendEmail"]}>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className='d-flex justify-content-center '>
                        <img
                          draggable='false'
                          src={
                            localStorage.getItem("i18nextLng") === "ar"
                              ? DiskusLogoArabic
                              : img1
                          }
                          width={220}
                          alt='diskus_logo'
                        />
                      </Col>
                    </Row>

                    <Form>
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className='d-flex justify-content-center flex-column'>
                          <span
                            className={
                              styles[
                                "VerifyHeadingTwofacSendEmail_twofacmultidevice"
                              ]
                            }>
                            {t("2fa-verification")}
                          </span>
                          <span
                            className={
                              styles[
                                "SelectLineTwofacSendEmail_twofacmultidevice"
                              ]
                            }>
                            {t("Select-any-one-option")}
                          </span>
                        </Col>
                      </Row>

                      <section className="my-4">
                        <Row >
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className='d-flex justify-content-between '>
                            <div className='d-flex gap-2 align-items-center'>
                              <img
                                draggable='false'
                                width={"15px"}
                                className={
                                  !notificationdevice
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img10}
                                alt=''
                              />
                              <span
                                className={
                                  !notificationdevice
                                    ? styles["SendEmailOnDeiveColor_active"]
                                    : styles["SendEmailOnDeiveColor"]
                                }>
                                {t("Send-notification-on-device")}
                              </span>
                            </div>
                            <div>
                              <Form.Check
                                type='radio'
                                onChange={changeHandler1}
                                value={"SEND NOTIFICATION ON DEVICE"}
                                name='2faverificationSendEmail'
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className='my-2'>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className='d-flex justify-content-between '>
                            <div className='d-flex gap-2 align-items-center'>
                              <img
                                draggable='false'
                                width={"17px"}
                                className={
                                  !notificationemail
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img5}
                                alt=''
                              />
                              <span
                                className={
                                  !notificationemail
                                    ? styles["SendEmailOnDeiveColor_active"]
                                    : styles["SendEmailOnDeiveColor"]
                                }>
                                {t("Send-code-on-email")}
                              </span>
                            </div>
                            <div>
                              <Form.Check
                                onChange={changeHandler2}
                                type='radio'
                                value={"SEND CODE ON EMAIL"}
                                name='2faverificationSendEmail'
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className='d-flex justify-content-between '>
                            <div className='d-flex gap-2 align-items-center'>
                              <img
                                draggable='false'
                                width={"17px"}
                                className={
                                  !notificationsms
                                    ? styles["two_fac_image"]
                                    : styles["two_fac_image_active"]
                                }
                                src={img6}
                                alt=''
                              />
                              <span
                                className={
                                  !notificationsms
                                    ? styles["SendEmailOnDeiveColor_active"]
                                    : styles["SendEmailOnDeiveColor"]
                                }>
                                {t("Send-code-on-sms")}
                              </span>
                            </div>
                            <div>
                              <Form.Check
                                onChange={changeHandler3}
                                value={"SEND CODE ON SMS"}
                                type='radio'
                                name='2faverificationSendEmail'
                              />{" "}
                            </div>{" "}
                          </Col>
                        </Row>
                      </section>
                      <Row>
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className='d-flex justify-content-center'>
                          <Button
                            text={t("Send-code")}
                            className={
                              styles[
                                "Next_button_EmailVerifySendEmail_sendCode"
                              ]
                            }
                            onClick={onClickSendOnDevice}
                            disableBtn={
                              notificationsms ||
                              notificationemail ||
                              notificationdevice
                                ? false
                                : true
                            }
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Row className='mt-2'>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='d-flex justify-content-center'>
                      <span
                        onClick={handleGoback}
                        className={styles["forogt_email_link"]}>
                        {t("Go-back")}
                      </span>
                    </Col>
                  </Row>
                </span>
              </Col>
            </Row>
          </Col>
          <Col md={7} lg={7} sm={12} className=''>
            <Row>
              <Col sm={12} md={6} lg={6} className='position-relative'>
                <img
                  draggable='false'
                  src={img2}
                  alt='auth_icon'
                  // width="380px"
                  className={styles["phone-image"]}
                />
              </Col>
              <Col sm={12} md={6} lg={6} className='position-relative vh-100'>
                <img
                  draggable='false'
                  src={DiskusAuthPageLogo}
                  alt='auth_icon'
                  width='600px'
                  className={styles["MultiFac_Auth_Icon"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default TwoFactorMultipleDevices;
