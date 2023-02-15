import { Button, Paper, Loader } from "../../../../../components/elements";
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
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { sendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import Cookies from "js-cookie";
const TwoFacSendEmail = () => {
  const { Authreducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [currentDevice, setCurrentDevice] = useState({
    DeviceName: "",
    UserDeviceID: 0,
    DeviceRegistrationToken: "",
  });
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
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);
  console.log("currentLocale", currentLocale);
  let currentLanguage = localStorage.getItem("i18nextLng");

  // translate Languages end

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
    if (notificationdevice) {
      navigate("/verifycodethree");
    } else {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "POSTMAN",
        DeviceID: "c",
        OrganizationID: 1,
        isEmail: notificationemail,
        isSMS: notificationsms,
        isDevice: notificationdevice,
        UserDevices: [],
      };
      dispatch(sendTwoFacAction(t, navigate, Data)); 
    }
  }
  useEffect(() => {
    if (
      Authreducer.AuthenticateAFAResponse !== null &&
      Authreducer.AuthenticateAFAResponse !== undefined
    ) {
      if (Authreducer.AuthenticateAFAResponse.userDevices.length > 0) {
        let DeviceDetail = Authreducer.AuthenticateAFAResponse.userDevices;
        setCurrentDevice({
          DeviceName: DeviceDetail[0].deviceName,
          UserDeviceID: DeviceDetail[0].pK_UDID,
          DeviceRegistrationToken: DeviceDetail[0].deviceRegistrationToken,
        });
      }
    }
  }, [Authreducer.AuthenticateAFAResponse]);

    return (<>
  
<Container fluid className="auth_container">
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <select
              className="Two-fac-send-language"
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
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
                <Paper className="Send_Email_Realme">
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
                        <img src={img1} alt="diskus_logo" />
                      </Col>
                    </Row>

                    <Form>
                      <Row className="my-0 FAsendEmailRealme">
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center flex-column"
                        >
                          <h3 className=" VerifyHeadingTwofacSendEmail ">
                            2FA Verification
                          </h3>
                          <span className="SelectLineTwofacSendEmail">
                            Select Any One Option
                          </span>
                        </Col>
                      </Row>

                      <Row className="EmailBoxSendRealme">
                        <Col sm={12} md={12} lg={12} className="mt-2">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img width={"15px"} src={img10} alt="" />
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
                                SEND NOTIFICATION ON DEVICE
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
                        </Col>
                        <Col sm={12} md={12} lg={12} className="mt-0">
                          <Row className="my-1">
                            <Col sm={12} md={1} lg={1}>
                              <img width={"15px"} src={img5} alt="" />
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
                                SEND CODE ON EMAIL
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
                        </Col>
                        <Col sm={12} md={12} lg={12} className="mt-1">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              {" "}
                              <img width={"15px"} src={img6} alt="" />
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
                                SEND CODE ON SMS
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
                      <Row className="d-flex justify-content-center">
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className="m-5 d-flex justify-content-center "
                        >
                          <Button
                            text="SEND CODE"
                            className="Next_button_EmailVerifySendEmail"
                            onClick={onClickSendOnDevice}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Paper>
              </Col>
            </Row>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <div className="parent-class-images positionRelative">
              <div className="Auth_Icon1SendEmailRealme">
                <img src={img2} alt="auth_icon" width="380px" />
              </div>
              <div className="circle-imageSendEmailRealme">
                <img
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="Auth_Icon"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default TwoFacSendEmail;
