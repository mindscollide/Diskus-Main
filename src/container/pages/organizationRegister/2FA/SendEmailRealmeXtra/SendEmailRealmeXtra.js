import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./SendEmailRealmeXtra.css";
import { useSelector, useDispatch } from "react-redux";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/2.png";
import LanguageIcon from "../../../../../assets/images/newElements/Language.svg";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
import { useTranslation } from "react-i18next";
import { sendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
const SendEmailRealmeXtra = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Authreducer } = useSelector((state) => state);
  const [xtrazoom, setXtrazoom] = useState(false);
  const [codeemail, setCodeemail] = useState(false);
  const [codesms, setCodesms] = useState(false);
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
  console.log("currentDevice", currentDevice);
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
        Device: "POSTMAN",
        DeviceID: "c",
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
      await dispatch(sendTwoFacAction(t, navigate, Data));
      localStorage.setItem("GobackSelection", 2);
      localStorage.setItem("currentDevice", JSON.stringify(currentDevice));
      // await navigate("/2FAverificationdevieotp", { state: { currentDevice } });
    } else {
      let Data = {
        UserID: JSON.parse(UserID),
        Device: "POSTMAN",
        DeviceID: "c",
        OrganizationID: OrganizationID,
        isEmail: codeemail,
        isSMS: codesms,
        isDevice: xtrazoom,
        UserDevices: [],
      };
      localStorage.setItem("GobackSelection", 2);
      await dispatch(sendTwoFacAction(t, navigate, Data));
    }
  };

  useEffect(() => {
    if (
      Authreducer.AuthenticateAFAResponse !== null &&
      Authreducer.AuthenticateAFAResponse !== undefined
    ) {
      if (Authreducer.AuthenticateAFAResponse.userDevices.length > 0) {
        console.log(" Authreducer.AuthenticateAFAResponse.userDevices");
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
      console.log(
        " Authreducer.AuthenticateAFAResponse.userDevices",
        currentDevice
      );
      console.log(
        " Authreducer.AuthenticateAFAResponse.userDevices",
        currentDevice.DeviceName
      );

      if (
        currentDevice.DeviceName != undefined &&
        currentDevice.DeviceName != null
      ) {
        console.log(" Authreducer.AuthenticateAFAResponse.userDevices");

        setCurrentDevice({
          DeviceName: currentDevice.DeviceName,
          UserDeviceID: currentDevice.UserDeviceID,
          DeviceRegistrationToken: currentDevice.DeviceRegistrationToken,
        });
      }
    }
  }, [Authreducer.AuthenticateAFAResponse]);

  return (
    <>
      <Row>
        <Col className="languageselect-box">
          <select
            className="select-language-signin_sendmailwithdevice"
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
            className="languageIcon_sendmailwithdevice"
          />
        </Col>
      </Row>
      <Container fluid className="auth_container">
        <Row>
          <Col lg={5} md={5} sm={12}>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center align-items-center min-vh-100"
              >
                <Paper className="Send_Email_Realme_sendmailwithdevice">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="EmailVerifyBox_sendmailwithdevice"
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
                      <Row className=" ">
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-center flex-column"
                        >
                          <h3 className="VerifyHeading_sendmailwithdevice">
                            {t("2fa-verification")}
                          </h3>
                          <span className="SelectLine">
                            {t("Select-any-one-option")}
                          </span>
                        </Col>
                      </Row>

                      <Row className="">
                        <Col sm={12} md={12} lg={12} className="">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img width={"15px"} src={img10} alt="" />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !xtrazoom
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                {t("Send-notification-on")}{" "}
                                {currentDevice.DeviceName}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                // value={"SEND NOTIFICATION ON REALME XTRA ZOOM"}
                                onChange={onChangeHandlerSendRealmeXtra1}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={12} md={12} lg={12} className="my-2">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img width={"17px"} src={img5} alt="" />
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
                                // value={"SEND CODE ON EMAIL"}
                                onChange={onChangeHandlerSendRealmeXtra2}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={12} md={12} lg={12}>
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img width={"17px"} src={img6} alt="" />
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
                            text="SEND CODE"
                            className="Next_button_EmailVerifySendEmailRealme"
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
                  className="Auth_Icon"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default SendEmailRealmeXtra;
