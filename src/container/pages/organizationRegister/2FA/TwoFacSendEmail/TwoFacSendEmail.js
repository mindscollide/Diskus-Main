import {
  Button,
  Paper,
  Loader,
  Notification,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./TwoFacSendEmail.css";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import img3 from "../../../../../assets/images/3.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  sendTwoFacAction,
  TwoFaAuthenticate,
} from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";

const TwoFacSendEmail = () => {
  const { Authreducer } = useSelector((state) => state);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
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

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

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

  let currentLanguage = localStorage.getItem("i18nextLng");

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
        navigate("/selectfrommultidevices", { state: { currentDevice } });
      } else {
        setOpen({
          open: true,
          message: "0 Device Not Found",
        });
        setTimeout(() => {
          setOpen({
            open: false,
            message: "",
          });
        }, 2000);
      }
    } else {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "BROWSER",
        DeviceID: "c",
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
      Authreducer.AuthenticateAFAResponse !== null &&
      Authreducer.AuthenticateAFAResponse !== undefined
    ) {
      if (Authreducer.AuthenticateAFAResponse.userDevices.length > 0) {
        let DeviceDetail = Authreducer.AuthenticateAFAResponse.userDevices;
        let Devices = [];
        DeviceDetail.map((data, index) => {
          Devices.push({
            DeviceName: data.deviceName,
            UserDeviceID: data.pK_UDID,
            DeviceRegistrationToken: data.deviceRegistrationToken,
          });
        });
        setCurrentDevice(Devices);
      }
    }
  }, [Authreducer.AuthenticateAFAResponse]);

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
    if (newClient != null && newClient != "" && newClient != undefined) {
    } else {
      let userID = localStorage.getItem("userID");
      mqttConnection(userID);
    }
  }, [Helper.socket]);

  return (
    <>
      {/* <Row>
        <Col className="languageselect-box">
          <select
            className="select-language-signin_twofacmultidevice"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className="language_options">
                {name}
              </option>
            ))}
          </select>
          <img
            src={LanguageChangeIcon}
            className="languageIcon_twofacmultidevice"
          />
        </Col>
      </Row> */}
      <Container fluid className="auth_container">
        <Row className="position-relative">
          <Col className="languageSelector" >
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
                <Paper className="Send_Email_multipleDevice">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="EmailVerifyBoxSendEmail"
                  >
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className="d-flex justify-content-center "
                      >
                        <img src={img1} width={220} alt="diskus_logo" />
                      </Col>
                    </Row>

                    <Form>
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center flex-column"
                        >
                          <h3 className="VerifyHeadingTwofacSendEmail_twofacmultidevice ">
                            {t("2fa-verification")}
                          </h3>
                          <span className="SelectLineTwofacSendEmail_twofacmultidevice">
                            {t("Select-any-one-option")}
                          </span>
                        </Col>
                      </Row>

                      <Row className="EmailBoxSendRealme_twofacmultidevice">
                        <Col sm={12} md={12} lg={12} className="mx-2">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img
                                width={"15px"}
                                className={
                                  !notificationdevice
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img10}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              {" "}
                              <span
                                className={
                                  !notificationdevice
                                    ? "SendEmailOnDeiveColor_active"
                                    : "SendEmailOnDeiveColor"
                                }
                              >
                                {t("Send-notification-on-device")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                onChange={changeHandler1}
                                value={"SEND NOTIFICATION ON DEVICE"}
                                name="2faverificationSendEmail"
                              />
                            </Col>
                          </Row>
                          {/* </Col>
                        <Col sm={12} md={12} lg={12} className="my-2"> */}
                          <Row className="my-2">
                            <Col sm={12} md={1} lg={1}>
                              <img
                                width={"17px"}
                                className={
                                  !notificationemail
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img5}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              {" "}
                              <span
                                className={
                                  !notificationemail
                                    ? "SendEmailOnDeiveColor_active"
                                    : "SendEmailOnDeiveColor"
                                }
                              >
                                {t("Send-code-on-email")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              {" "}
                              <Form.Check
                                onChange={changeHandler2}
                                type="radio"
                                value={"SEND CODE ON EMAIL"}
                                name="2faverificationSendEmail"
                              />
                            </Col>
                          </Row>
                          {/* </Col>
                        <Col sm={12} md={12} lg={12} > */}
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              {" "}
                              <img
                                width={"17px"}
                                className={
                                  !notificationsms
                                    ? "two_fac_image"
                                    : "two_fac_image_active"
                                }
                                src={img6}
                                alt=""
                              />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              {" "}
                              <span
                                className={
                                  !notificationsms
                                    ? "SendEmailOnDeiveColor_active"
                                    : "SendEmailOnDeiveColor"
                                }
                              >
                                {t("Send-code-on-sms")}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                onChange={changeHandler3}
                                value={"SEND CODE ON SMS"}
                                type="radio"
                                name="2faverificationSendEmail"
                              />{" "}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className="d-flex justify-content-center"
                        >
                          <Button
                            text={t("Send-code")}
                            className="Next_button_EmailVerifySendEmail_sendCode"
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
                  <Row className="mb-2 mt-1">
                    <Col sm={12} md={12} lg={12} className="forogt_email_link ">
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
                  src={img2}
                  alt="auth_icon"
                  width="380px"
                  className="phone-image"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="MultiFac_Auth_Icon"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
      <Notification
        open={open.open}
        setOpen={open.open}
        message={open.message}
      />
    </>
  );
};

export default TwoFacSendEmail;
