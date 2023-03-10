import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationCodeThree.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector, useDispatch } from "react-redux";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { resendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { useTranslation } from "react-i18next";
import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
const VerificationCodeThree = () => {
  const { t, i18n } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyOTP, setVerifyOTP] = useState(null);
  let GobackSelection = localStorage.getItem("GobackSelection");
  const [open, setOpen] = useState({
    open: false,
    message: "",
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

  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  console.log(minutes, seconds, "datadatadatadatadata");
  let currentDevice = JSON.parse(localStorage.getItem("currentDevice"));
  const [device, setDevice] = useState({
    DeviceName: currentDevice?.DeviceName,
    UserDeviceID: currentDevice?.UserDeviceID,
    DeviceRegistrationToken: currentDevice?.DeviceRegistrationToken,
  });
  const resendOtpHandleClick = (e) => {
    e.preventDefault();
    let userID = localStorage.getItem("userID");
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setVerifyOTP("");
    let Data = {
      UserID: JSON.parse(userID),
      Device: "Browser",
      DeviceID: "c",
      OrganizationID: JSON.parse(OrganizationID),
      isEmail: false,
      isSMS: false,
      isDevice: true,
      UserDevices: [
        {
          DeviceName: device.DeviceName,
          DeviceToken: device.DeviceRegistrationToken,
        },
      ],
    };
    dispatch(resendTwoFacAction(t, Data, navigate, setSeconds, setMinutes));
  };
  // useEffect(() => {
  //   if (location.state !== null && location.state !== undefined) {
  //     setDevice({
  //       DeviceName: location.state.currentDevice.DeviceName,
  //       UserDeviceID: location.state.currentDevice.UserDeviceID,
  //       DeviceRegistrationToken:
  //         location.state.currentDevice.DeviceRegistrationToken,
  //     });
  //   }
  // }, [location.state]);

  useEffect(() => {
    if (Authreducer.SendTwoFacOTPResponse !== null) {
      let OTPValue = Authreducer.SendTwoFacOTPResponse;
      setVerifyOTP(OTPValue?.otpCode);
    }
  }, [Authreducer.SendTwoFacOTPResponse]);

  useEffect(() => {
    // if (startTimer) {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        localStorage.setItem("seconds", seconds - 1);
        localStorage.setItem("minutes", minutes);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          // setStartTimer(false)
          localStorage.removeItem("seconds");
          localStorage.removeItem("minutes");
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
          localStorage.setItem("seconds", 59);
          localStorage.setItem("minutes", minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  useEffect(() => {
    let s = localStorage.getItem("seconds");
    let m = localStorage.getItem("minutes");
    window.addEventListener("beforeunload ", (e) => {
      console.log("ttt");
      e.preventDefault();
      if (m != undefined && s != undefined) {
        if (s === 1) {
          setSeconds(59);
          setMinutes(m - 1);
        } else {
          setSeconds(s - 1);
          setMinutes(minutes);
        }
      } else {
        setSeconds(59);
        setMinutes(4);
      }
    });
  }, []);
  return (
    <>
      <Row>
        <Col className="languageselect-box">
          <select
            className="select-language-signin_2FAverificationdevieotp"
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
            className="languageIcon_2FAverificationdevieotp"
          />
        </Col>
      </Row>
      <Container fluid className="VerificationCodeThree">
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className="loginbox_auth_paperForVerificationCodeThree">
              <Col
                sm={12}
                lg={12}
                md={12}
                className="EmailVerifyBoxVerificationCodeThree"
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
                  <Row className="mt-4 ">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center flex-column"
                    >
                      <h3 className="MainHeadingVerificationCodeThree">
                        {t("2fa-verification")}
                      </h3>
                      <span className="SubHeadingVerificationCodeThree">
                        {t("A-notification-has-been-sent-to-your-device")}
                      </span>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="mt-2 d-flex justify-content-center"
                    >
                      <img width={"35px"} src={img10} alt="" />
                    </Col>
                    <Col sm={12} md={12} lg={12} className="text-center mt-1 ">
                      <span className="device-title">{device.DeviceName}</span>
                    </Col>
                    <Col sm={12} md={12} lg={12} className="text-center">
                      <span className="otp_value">
                        {" "}
                        {verifyOTP?.slice(0, 3) + " " + verifyOTP?.slice(3, 6)}
                      </span>
                    </Col>
                    <Col className="text-center">
                      <span className="OTPCounter">
                        0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-3 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center "
                    >
                      <Button
                        disableBtn={seconds > 0 || minutes > 0}
                        text={t("Send-again").toUpperCase()}
                        className="Next_button_EmailVerifyVerificationCodeThree"
                        onClick={resendOtpHandleClick}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Row className="mt-1">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className="forogt_email_link_verification_Code_Three"
                >
                  <Link
                    to={
                      parseInt(GobackSelection) === 1
                        ? "/twofac"
                        : parseInt(GobackSelection) === 2
                        ? "/sendmailwithdevice"
                        : parseInt(GobackSelection) === 3
                        ? "/twofacmultidevice"
                        : "/twofac"
                    }
                  >
                    {t("Go-back")}
                  </Link>
                </Col>
              </Row>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  src={img9}
                  alt="auth_icon"
                  className="mobile_image"
                  width="250px"
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
      {Authreducer.Loading && Authreducer.SendTwoFacOTPResponse !== null ? (
        <Loader />
      ) : null}
    </>
  );
};

export default VerificationCodeThree;
