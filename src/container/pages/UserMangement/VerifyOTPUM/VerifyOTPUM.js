import React, { useEffect, useState } from "react";
import styles from "./VerifyOTPUM.module.css";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Col, Container, Row } from "react-bootstrap";
import {
  Button,
  Paper,
  VerificationInputField,
  Notification,
  Loader,
} from "../../../../components/elements";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import {
  cleareMessage,
  verificationEmailOTP,
} from "../../../../store/actions/Auth2_actions";
import { ResendOTP } from "../../../../store/actions/Auth_Verify_Opt";
import { useSelector } from "react-redux";
import { LoginFlowRoutes } from "../../../../store/actions/UserManagementActions";

const VerifyOTPUM = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { Authreducer, LanguageReducer } = useSelector((state) => state);

  const [key, setKey] = useState(1);
  const [errorBar, setErrorBar] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOTP, setVerifyOTP] = useState("");
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  const changeHandler = (e) => {
    let otpval = e.toUpperCase();
    setVerifyOTP(otpval);
  };

  useEffect(() => {
    // if value was cleared, set key to re-render the element
    if (verifyOTP.length === 0) {
      setKey(key + 1);
      return;
    }
  }, [verifyOTP]);

  const verifyOTPClickHandler = (e) => {
    console.log("hello");
    e.preventDefault();

    if (verifyOTP.length !== 6) {
      setVerifyOTP("");
      setErrorBar(true);
      setErrorMessage("OTP should be a 6 digit code");
    } else {
      setErrorBar(false);
      setErrorMessage("");
      setVerifyOTP("");
      setVerifyOTP("");
      dispatch(
        verificationEmailOTP(
          verifyOTP,
          navigate,
          t,
          false,
          setSeconds,
          setMinutes
        )
      );
    }
  };

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  const sendRequestResend = () => {
    let nEmail = localStorage.getItem("UserEmail");
    let data = {
      Email: nEmail,
    };

    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    dispatch(ResendOTP(t, data, setSeconds, setMinutes));
  };

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
      if (m !== undefined && s !== undefined) {
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

  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EnterPasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);

  const handleBacktoSignIn = () => {
    localStorage.removeItem("signupCurrentPage", 3);
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
    navigate("/");
  };

  return (
    <>
      <Row>
        <Col className={styles["languageSelector"]}>
          <LanguageSelector />
        </Col>
      </Row>
      <Container fluid>
        <Row>
          <Col
            lg={4}
            md={4}
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
                    className="d-flex justify-content-center "
                  >
                    <img
                      draggable="false"
                      src={DiskusLogo}
                      alt="diskus_logo"
                      width="225px"
                      height="80px"
                    />
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      {t("Verify-your-email")}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span className={styles["signIn_heading_line"]}>
                      {t("6-digit-code-has-sent-on-your-email")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col sm={12} md={12} lg={12} className="Enter-Code-Label">
                    <VerificationInputField
                      label={t("Enter-code")}
                      fields={6}
                      applyClass={styles["OTPInput"]}
                      change={changeHandler}
                      key={key}
                      value={verifyOTP}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="text-left d-flex justify-content-start gap-3">
                    <Button
                      className={styles["resendCode_btn"]}
                      disableBtn={seconds > 0 || minutes > 0}
                      text={t("Resend-code-in")}
                      onClick={sendRequestResend}
                    />
                    <span className={styles["OTPCounter"]}>
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p
                      className={
                        errorBar
                          ? ` ${styles["errorMessage-OTP"]} `
                          : `${styles["errorMessage-OTP_hidden"]}`
                      }
                    >
                      {errorMessage}
                    </p>
                  </Col>
                </Row>
                <Row className="d-flex mt-5 justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text={t("Verify")}
                      onClick={verifyOTPClickHandler}
                      className={styles["subscribNow_button_EmailVerify"]}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      styles["Forgot_passwordforogt_verification_email_link"]
                    }
                  >
                    <span onClick={handleBacktoSignIn}>{t("Go-back")}</span>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className="position-relative d-flex  overflow-hidden"
          >
            <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
              <h1 className={styles["heading-1"]}>
                {t("Simplify-management")}
              </h1>
              <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
              <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
            </Col>
            <Col md={4} lg={4} sm={12} className="position-relative">
              <img
                draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default VerifyOTPUM;
