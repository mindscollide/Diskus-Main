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
// import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import img10 from "../../../../../assets/images/10.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import Cookies from "js-cookie";
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
            DeviceToken: currentDevice.DeviceRegistrationToken,
          },
        ],
      };
      await dispatch(sendTwoFacAction(t, navigate, Data));
      await navigate("/verifycodethree", { state: { currentDevice } });
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
      await dispatch(sendTwoFacAction(t, navigate, Data));
    }
  };

  useEffect(() => {
    if (
      Authreducer.AuthenticateAFAResponse.userDevices !== null &&
      Authreducer.AuthenticateAFAResponse.userDevices !== undefined &&
      Authreducer.AuthenticateAFAResponse.userDevices.length > 0
    ) {
      let DeviceDetail = Authreducer.AuthenticateAFAResponse.userDevices;
      setCurrentDevice({
        DeviceName: DeviceDetail[0].deviceName,
        UserDeviceID: DeviceDetail[0].pK_UDID,
        DeviceRegistrationToken: DeviceDetail[0].deviceRegistrationToken,
      });
    }
  }, [Authreducer.AuthenticateAFAResponse]);

  return (
    <>
      <Container fluid className="auth_container">
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <select
              className="Sendemailreal-language"
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
                    className="EmailVerifyBoxSendEmailRealme"
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
                          <h3 className=" VerifyHeading ">2FA Verification</h3>
                          <span className="SelectLine">
                            Select Any One Option
                          </span>
                        </Col>
                      </Row>

                      <Row className="EmailBoxSendRealme">
                        <Col sm={12} md={12} lg={12} className="mt-2">
                          <Row>
                            <Col sm={12} md={1} lg={1} className="mt-1">
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
                                SEND NOTIFICATION ON {currentDevice.DeviceName}
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                value={"SEND NOTIFICATION ON REALME XTRA ZOOM"}
                                onChange={onChangeHandlerSendRealmeXtra1}
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
                              <span
                                className={
                                  !codeemail
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                SEND CODE ON EMAIL
                              </span>
                            </Col>
                            <Col sm={12} md={2} lg={2}>
                              <Form.Check
                                type="radio"
                                name="faSendEmailRealmeXtra"
                                value={"SEND CODE ON EMAIL"}
                                onChange={onChangeHandlerSendRealmeXtra2}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={12} md={12} lg={12} className="mt-1">
                          <Row>
                            <Col sm={12} md={1} lg={1}>
                              <img width={"15px"} src={img6} alt="" />
                            </Col>
                            <Col sm={12} md={9} lg={9}>
                              <span
                                className={
                                  !codesms
                                    ? "SendRealmeXtraZoomColor_active"
                                    : "SendRealmeXtraZoomColor"
                                }
                              >
                                SEND CODE ON SMS
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
                      <Row className="mt-5 d-flex justify-content-center">
                        <Col
                          sm={12}
                          lg={12}
                          md={12}
                          className="d-flex justify-content-center "
                        >
                          <Button
                            text="SEND CODE"
                            className="Next_button_EmailVerifySendEmailRealme"
                            onClick={onClickRealmeXtra}
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

export default SendEmailRealmeXtra;
