import React, { useEffect, useState } from "react";
import styles from "./VerificationEmailAndNumber.module.css";
import { Col, Container, Row } from "react-bootstrap";
import img2 from "../../../../../assets/images/7.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import Cookies from "js-cookie";
import Helper from "../../../../../commen/functions/history_logout";
import { mqttConnection } from "../../../../../commen/functions/mqttconnection";
import { useNavigate } from "react-router-dom";
import { countryNameforPhoneNumber } from "../../../../Admin/AllUsers/AddUser/CountryJson";
import {
  Button,
  Paper,
  VerificationInputField,
  Notification,
  Loader,
} from "../../../../../components/elements";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  resendTwoFacAction,
  verificationTwoFacOtp,
} from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { cleareMessage } from "../../../../../store/actions/Auth2_actions";
import { LoginFlowRoutes } from "../../../../../store/actions/UserManagementActions";
const VerificationEmailAndNumber = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [value, setValue] = useState(null);
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [worldCountryIDS, setWorldCountryIDS] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [key, setKey] = useState(1);
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );

  const handleChange = (e) => {
    setOtpCode(e.toUpperCase());
  };

  useEffect(() => {
    // if value was cleared, set key to re-render the element
    if (otpCode.length === 0) {
      setKey(key + 1);
      return;
    }
  }, [otpCode]);

  // Languages
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let userID = localStorage.getItem("userID");
    let Data = {
      UserID: JSON.parse(userID),
      IsRequestFromDevice: false,
      IsYesSelectedOnDevice: false,
      OTP: otpCode,
    };

    setOtpCode("");
    dispatch(verificationTwoFacOtp(Data, t, navigate, setOtpCode));
  };

  const resendOtpHandleClick = () => {
    let userID = localStorage.getItem("userID");
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setOtpCode("");
    let Data = {
      UserID: JSON.parse(userID),
      Device: "Browser",
      DeviceID: "1",
      OrganizationID: JSON.parse(OrganizationID),
      isEmail: value === 0 ? false : value === 1 ? true : false,
      isSMS: value === 0 ? true : value === 1 ? false : false,
      isDevice: false,
      UserDevices: [],
    };
    dispatch(resendTwoFacAction(t, Data, navigate, setSeconds, setMinutes));
  };

  useEffect(() => {
    if (Authreducer.AuthenticateAFAResponse !== null) {
      localStorage.setItem(
        "email",
        Authreducer.AuthenticateAFAResponse.emailAddress
      );
      localStorage.setItem(
        "phoneNumber",
        Authreducer.AuthenticateAFAResponse.mobileNumber
      );
      localStorage.setItem(
        "worldCountryID",
        Authreducer.AuthenticateAFAResponse.worldCountryID
      );
    }
  }, [Authreducer.AuthenticateAFAResponse]);

  useEffect(() => {
    if (
      Authreducer.SendTwoFacOTPResponseMessage === t("Failed-to-verify-otp")
    ) {
      setOpen({
        open: true,
        message: Authreducer.SendTwoFacOTPResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
      }, 3000);
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [Authreducer.SendTwoFacOTPResponseMessage]);

  useEffect(() => {
    let value = localStorage.getItem("value");
    let email = localStorage.getItem("email");
    let phoneNumber = localStorage.getItem("phoneNumber");
    let worldCountryID = localStorage.getItem("worldCountryID");
    console.log("first1", worldCountryID);

    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return parseInt(obj.id) === parseInt(worldCountryID);
    });
    console.log("first2", a);
    setValue(JSON.parse(value));
    setEmail(email);
    setPhoneNumber(phoneNumber);
    if (a != undefined) {
      setWorldCountryIDS(a.secondary);
    }
  }, [value]);

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

  const handleGoBackButton = () => {
    localStorage.setItem("LoginFlowPageRoute", 4);
    dispatch(LoginFlowRoutes(4));
  };

  return (
    <div>
      <Container fluid className={styles["VerifyCodeOneOverflow"]}>
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
            <Paper className={styles["OTP_auth_paper"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["EmailVerifyOTPbox"]}
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center mb-3"
                  >
                    <img
                      draggable="false"
                      src={DiskusLogo}
                      alt="diskus_logo"
                      width={220}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="mt-4">
                    <span className={styles["TwoFa_heading"]}>
                      {t("2fa-verification")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className={styles["verify_heading_line1"]}>
                      {t("6-digit-code-has-sent-on-to-this")}
                    </p>
                    {value === 0 ? (
                      <p className={styles["verify_heading_line2"]}>
                        {t("Number")} : {worldCountryIDS} {phoneNumber}
                      </p>
                    ) : value === 1 ? (
                      <p className={styles["verify_heading_line2"]}>
                        {t("Email")}: {email}
                      </p>
                    ) : (
                      <>
                        <p className={styles["verify_heading_line2"]}>
                          {t("Number")}: {phoneNumber}
                        </p>
                        <p className={styles["verify_heading_line2"]}>
                          {t("Email")}: {email}
                        </p>
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col sm={12} md={12} lg={12} className="Enter-Code-Label">
                    <VerificationInputField
                      label={t("Enter-code")}
                      fields={6}
                      applyClass="OTPInput"
                      change={handleChange}
                      key={key}
                      value={otpCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-left d-flex justify-content-start align-items-center gap-2">
                    <Button
                      className={styles["resendCode_btn"]}
                      disableBtn={seconds > 0 || minutes > 0}
                      text={t("Resend-code-in")}
                      onClick={resendOtpHandleClick}
                    />
                    <span className="OTPCounter">
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>

                <Row className=" mt-5 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text={t("Verify")}
                      disableBtn={otpCode.length !== 6 ? true : false}
                      className={styles["subscribNow_button_EmailVerify"]}
                      onClick={handleSubmit}
                      type="submit"
                    />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["Go_back_link_VerifyCodeOne"]}
                  >
                    <span
                      className="d-flex justify-content-center cursor-pointer"
                      onClick={handleGoBackButton}
                    >
                      {" "}
                      {t("Go-back")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Paper>
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
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  className={styles["Auth_Icon"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      <Notification open={open.open} setOpen={setOpen} message={open.message} />
    </div>
  );
};

export default VerificationEmailAndNumber;
