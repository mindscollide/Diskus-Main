import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
  VerificationInputField,
} from "./../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "./../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./ForgotPasswordVerificaiton.module.css";
import DiskusAuthPageLogo from "./../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../assets/images/newElements/Language.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  ResendOTP,
  VerifyOTPFunc,
} from "../../../../src/store/actions/Auth_Verify_Opt";
import { cleareChangePasswordMessage } from "../../../store/actions/Auth_Forgot_Password";
import {
  cleareMessage,
  verificationEmailOTP,
} from "../../../../src/store/actions/Auth2_actions";
const ForgotPasswordVerification = () => {

  const { auth, Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];
  const currentLocale = Cookies.get("i18next") || "en";
  const [language, setLanguage] = useState(currentLocale);
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [errorBar, setErrorBar] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOTP, setVerifyOTP] = useState("");
  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Resending the OTP CODE
  const sendRequestResend = () => {

    let nEmail = localStorage.getItem("UserEmail");
    let data = {
      Email: nEmail,
    };
    console.log("UserEmail", data);

    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setVerifyOTP("");
    dispatch(ResendOTP(t, data, setSeconds, setMinutes));
    // setStartTimer(true)
  };

  const changeHandler = (e) => {
    let otpval = e.toUpperCase();
    console.log("changeHandler",otpval)
    setVerifyOTP(otpval);
  };
  const SubmitOTP = (e) => {
    e.preventDefault();
    console.log("changeHandler",verifyOTP)

    if (verifyOTP.length !== 6) {
      setErrorBar(true);
      setErrorMessage("OTP should be a 6 digit code");
    } else {
      setErrorBar(false);
      setErrorMessage("");
      dispatch(
        verificationEmailOTP(verifyOTP, navigate, t, setSeconds, setMinutes)
      );
      // dispatch(VerifyOTPFunc(verifyOTP, navigate, t));
    }
  };

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
      // localStorage.removeItem("seconds");
      // localStorage.removeItem("minutes");
    };
    // }
  }, [
    seconds,
    // startTimer
  ]);

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

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  //for messeges shown in the snack-bar
  useEffect(() => {
    if (auth.ResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      })
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareChangePasswordMessage());
    } else {
      dispatch(cleareChangePasswordMessage());
    }
  }, [auth.ResponseMessage]);

  //for showing the responses in the snackbar 
  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      })
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [Authreducer.VerifyOTPEmailResponseMessage]);

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row>
          <Col className={styles["languageselect-box"]}>
            <select
              className={
                styles["Forgot_Password_Verification_select-language-signin"]
              }
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option
                  key={code}
                  value={code}
                  className={
                    styles["Forgot_password_Verification_language_options"]
                  }
                >
                  {name}
                </option>
              ))}
            </select>
            <img
              src={LanguageChangeIcon}
              className={styles["Forgot_password_Verification_languageIcon"]}
            />
          </Col>
        </Row>

        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper
              className={
                styles["Forgot_password_Verification_loginbox_auth_paper"]
              }
            >
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["ForgotPassword_Verification_EmailVerifyBox"]}
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <img src={DiskusLogo} alt="diskus_logo" />
                  </Col>
                </Row>
                <Form onSubmit={SubmitOTP}>
                  <Row className="mt-5 ">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["OTPHandler"]}
                    >
                      <span className={styles["EmailVerifyLabel"]}>
                        Enter Verification 
                      </span>
                  
                    </Col>
                  </Row>
                  <Row className={styles["BoxesforOTP"]}>
                    <Col sm={12} md={12} lg={12}>
                    <VerificationInputField
                        fields={6}
                        applyClass="OTPInput"
                        value={verifyOTP}
                        change={changeHandler}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-left d-flex justify-content-between">
                      <span
                        className={
                          styles["Forgot_Password_Verification_Tagline"]
                        }
                      >
                        Didn't Reiceive the Code?
                        <Button
                          className={
                            styles[
                              "Forgot_Password_Verification_resendCode_btn"
                            ]
                          }
                          disableBtn={seconds > 0 || minutes > 0}
                          text={t("Resend-code")}
                          onClick={sendRequestResend}
                        />
                      </span>
                      <span
                        className={
                          styles[
                            "Forgot_password_Verification_update_OTPCounter"
                          ]
                        }
                      >
                        0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["OTP_Error_Messege"]}
                    >
                      {errorMessage}
                    </Col>
                  </Row>

                  <Row className="mt-5 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center mt-1 "
                    >
                      <Button
                        text={t("Next")}
                        onClick={SubmitOTP}
                        className={
                          styles[
                            "Forgot_Password_Verification_Next_button_EmailVerify"
                          ]
                        }
                        // disableBtn={disablebtnverify}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      styles["Forgot_passwordforogt_verification_email_link"]
                    }
                  >
                    <Link to="/forgotpasssowrd">{t("Back-to-Sign-In")}</Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className="position-relative d-flex overflow-hidden"
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
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Forgot_Password_Verification_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      {auth.Loading ? <Loader /> : Authreducer.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ForgotPasswordVerification;
