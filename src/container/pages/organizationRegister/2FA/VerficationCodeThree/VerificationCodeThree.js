import { Button } from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Col, Container, Row } from "react-bootstrap";
import "./VerificationCodeThree.css";
import { useNavigate } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "../../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";

import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import { useDispatch } from "react-redux";
import { resendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { useTranslation } from "react-i18next";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { LoginFlowRoutes } from "../../../../../store/actions/UserManagementActions";
const VerificationCodeThree = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // translate Languages start
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);
  

  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  
  let currentDevice = JSON.parse(localStorage.getItem("selectDevice"));
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
    let Data = {
      UserID: JSON.parse(userID),
      Device: "Browser",
      DeviceID: "1",
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

    
    if (
      data.payload.message
        .toLowerCase()
        .includes("2FA_VERIFIED_FROM_DEVICE".toLowerCase())
    ) {
      localStorage.setItem("TowApproval", true);

      if (roleID === 1 || roleID === 2) {
        navigate("/Admin/");
      } else {
        
        if (isFirstLogin !== null && isFirstLogin !== undefined) {
          if (isFirstLogin === true) {
            navigate("/onboard");
          } else {
            let RSVP = localStorage.getItem("RSVP");
            if (RSVP !== undefined && RSVP !== null) {
              navigate("/Diskus/Meeting/Useravailabilityformeeting");
            } else {
              if (
                localStorage.getItem("RSVP") !== null &&
                localStorage.getItem("RSVP") !== undefined
              ) {
                navigate("/Diskus/Meeting/Useravailabilityformeeting");
              } else {
                navigate("/Diskus/");
              }
            }
          }
        }
      }
    } else if (
      data.payload.message.toLowerCase() ===
      "2FA_VERIFIED_NOT_FROM_DEVICE".toLowerCase()
    ) {
      localStorage.setItem("TowApproval", false);
      
      dispatch(LoginFlowRoutes(7));
    }
  };

  let newClient = Helper.socket;

  useEffect(() => {
    if (newClient !== null && newClient !== "" && newClient !== undefined) {
      newClient.onMessageArrived = onMessageArrived;
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
  }, [Helper.socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        localStorage.setItem("seconds", seconds - 1);
        localStorage.setItem("minutes", minutes);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
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
      e.preventDefault();
      if (m !== null && s !== null) {
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

  const handleGoback = () => {
    
    if (localStorage.getItem("isMultiDevice") === "false") {
      localStorage.setItem("LoginFlowPageRoute", 8);
      dispatch(LoginFlowRoutes(8));
    } else {
      localStorage.setItem("LoginFlowPageRoute", 15);
      dispatch(LoginFlowRoutes(15));
    }
  };
  return (
    <>
      <Container fluid className='VerificationCodeThree'>
        <Row className='position-relative'>
          <Col className='languageSelectors'>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className='d-flex justify-content-center align-items-center min-vh-100'>
            <span className='loginbox_auth_paper_for_openyourrealmextra'>
              <Col
                sm={12}
                lg={12}
                md={12}
                className='EmailVerifyBox_for_openyourrealmextra'>
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
                      alt=''
                      width='220px'
                      height='69px'
                    />
                  </Col>
                </Row>

                <Row className='mt-4 '>
                  <Col sm={12} md={12} lg={12} className='text-cemter-ur pe-1'>
                    <p className='Heading-Style'>
                      {t("Open-your")}
                      <span className='deviceName'>{device.DeviceName}</span>
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='mt-2 d-flex justify-content-center'>
                    <img
                      draggable='false'
                      width='47.2px'
                      height='65.76px'
                      src={img10}
                      alt=''
                    />
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} md={12} lg={12} className='mt-4'>
                    <ul>
                      <li className='List_Components-verification'>
                        {t("Tap-on")}
                        <span className='anchor_tag_text'>{t("Diskus")}</span>
                        <span className='space'></span>
                        {t("Notification")}
                      </li>
                      <li className='List_Components-verification'>
                        {t("Click-on")}
                        <span className='anchor_tag_text1'>{t("Yes")}</span>
                        <span className='space'></span>
                        {t("to-sign-in")}
                      </li>
                    </ul>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12} lg={12} md={12} className='text-center mt-3'>
                    <span className='OTPCounter_for_openrealmextra'>
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>

                <Row className='mt-1 d-flex justify-content-center'>
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className='d-flex justify-content-center '>
                    <Button
                      disableBtn={seconds > 0 || minutes > 0}
                      text={t("Send-again").toUpperCase()}
                      className='Next_button_EmailVerify_For_openyourrealmextra'
                      onClick={resendOtpHandleClick}
                    />
                  </Col>
                </Row>
                <Row className='mt-1'>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='forogt_email_link_for_openrealmextra'>
                    <span className='cursor-pointer' onClick={handleGoback}>
                      {t("Go-back")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </span>
          </Col>

          <Col md={7} lg={7} sm={12} className=''>
            <Row>
              <Col sm={12} md={6} lg={6} className='position-relative'>
                <img
                  draggable='false'
                  src={img9}
                  alt='auth_icon'
                  className='phone-image'
                  height='500px'
                />
              </Col>
              <Col sm={12} md={6} lg={6} className='position-relative vh-100'>
                <img
                  draggable='false'
                  src={DiskusAuthPageLogo}
                  alt='auth_icon'
                  width='600px'
                  className='Verification_Code_Three_Auth_Icon'
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VerificationCodeThree;
