import { Button, Paper, Loader } from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Col, Container, Row } from "react-bootstrap";
import "./VerificationCodeThree.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector, useDispatch } from "react-redux";
import { resendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { useTranslation } from "react-i18next";
import LanguageChangeIcon from "../../../../../assets/images/newElements/Language.svg";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
const VerificationCodeThree = () => {
  const { t, i18n } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
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
  const onMessageArrived = (msg) => {
    let data = JSON.parse(msg.payloadString);
    let roleID = parseInt(localStorage.getItem("roleID"));
    let isFirstLogin = localStorage.getItem("isFirstLogin");

    console.log("message arrived", data);
    if (
      data.payload.message
        .toLowerCase()
        .includes("2FA_VERIFIED_FROM_DEVICE".toLowerCase())
    ) {
      localStorage.setItem("TowApproval", true);

      if (roleID === 1 || roleID === 2) {
        navigate("/Diskus/Admin/");
      } else {
        console.log("message arrived");
        if (isFirstLogin != undefined) {
          if (isFirstLogin === true) {
            navigate("/onboard");
          } else {
            navigate("/Diskus/");
          }
        }
      }
    } else {
      localStorage.setItem("TowApproval", false);
      navigate("/SigninDenied/");
    }
  };

  let newClient = Helper.socket;

  useEffect(() => {
    if (newClient != null && newClient != "" && newClient != undefined) {
      newClient.onMessageArrived = onMessageArrived;
    } else {
      let userID = localStorage.getItem("userID");
      mqttConnection(userID);
    }
  }, [Helper.socket]);

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
            <Paper className="loginbox_auth_paper_for_openyourrealmextra">
              <Col
                sm={12}
                lg={12}
                md={12}
                className="EmailVerifyBox_for_openyourrealmextra"
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center "
                  >
                    <img
                      src={img1}
                      width="220px"
                      height="69px"
                      // width="229.58px"
                      // height="72.03px"
                      // alt="diskus_logo"
                    />
                  </Col>
                </Row>

                <Row className="mt-4 ">
                  <Col sm={12} md={12} lg={12} className="text-cemter-ur pe-1">
                    <p className="Heading-Style">
                      {t("Open-your")}
                      <span className="deviceName">{device.DeviceName}</span>
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="mt-2 d-flex justify-content-center"
                  >
                    <img width="47.2px" height="65.76px" src={img10} alt="" />
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} md={12} lg={12} className="mt-4">
                    <ul>
                      <li className="List_Components-verification">
                        {t("Tap-on")}
                        <span className="anchor_tag_text">{t("Diskus")}</span>
                        <span className="space"></span>
                        {t("Notification")}
                      </li>
                      <li className="List_Components-verification">
                        {t("Click-on")}{" "}
                        <span className="anchor_tag_text">{t("Yes")}</span>
                        <span className="space"></span>
                        {t("to-sign-in")}
                      </li>
                    </ul>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} lg={12} md={12} className="text-center mt-3">
                    <span className="OTPCounter_for_openrealmextra">
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>

                <Row className="mt-1 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center "
                  >
                    <Button
                      disableBtn={seconds > 0 || minutes > 0}
                      text={t("Send-again").toUpperCase()}
                      className="Next_button_EmailVerify_For_openyourrealmextra"
                      onClick={resendOtpHandleClick}
                    />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="forogt_email_link_for_openrealmextra"
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
              </Col>
            </Paper>
          </Col>

          <Col md={7} lg={7} sm={12} className="">
            <Row>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="position-relative"
              >
                <img
                  src={img9}
                  alt="auth_icon"
                  className="phone-image"
                  width="320px"
                  height="417px"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  width="600px"
                  className="Verification_Code_Three_Auth_Icon"
                />
              </Col>
            </Row>
          </Col>
          {/* <Col
            md={7}
            lg={7}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100 roundspinner-image"
          >
            <img
              src={img9}
              alt="auth_icon"
              className="mobile_image_two"
              width="360.81px"
              height="530.4px"
            />
          </Col> */}
        </Row>
        {Authreducer.Loading && Authreducer.SendTwoFacOTPResponse !== null ? (
          <Loader />
        ) : null}
      </Container>
    </>
  );
};

export default VerificationCodeThree;
