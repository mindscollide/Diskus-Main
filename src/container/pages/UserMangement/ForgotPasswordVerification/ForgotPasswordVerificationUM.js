import React, { useEffect, useState } from "react";
import styles from "./ForgotPasswordVerificationUM.module.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Container, Form, Row } from "react-bootstrap";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import {
  Button,
  Notification,
  VerificationInputField,
} from "../../../../components/elements";
import DiskusLogo from "./../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "./../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";
import DiskusAuthPageLogo from "./../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { verificationEmailOTP } from "../../../../store/actions/Auth2_actions";
import {
  LoginFlowRoutes,
  ResendForgotPasswordCodeApi,
} from "../../../../store/actions/UserManagementActions";
const ForgotPasswordVerificationUM = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { t } = useTranslation();

  // const [key, setKey] = useState(1);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Constants for timer
  const timerDurationMinutes = 5;
  const initialSeconds = 0;
  const initialMinutes = timerDurationMinutes;

  // State for timer
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds")
      ? parseInt(localStorage.getItem("seconds"))
      : initialSeconds
  );
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes")
      ? parseInt(localStorage.getItem("minutes"))
      : initialMinutes
  );
  const [errorBar, setErrorBar] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyOTP, setVerifyOTP] = useState("");

  // Resending the OTP CODE
  const sendRequestResend = () => {
    let email = localStorage.getItem("userEmail");
    let data = {
      Email: email,
    };
    console.log("UserEmail", data);
    setErrorMessage("");
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setVerifyOTP("");
    dispatch(ResendForgotPasswordCodeApi(t, data, setSeconds, setMinutes));
  };

  // Start the timer when the component mounts
  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      return; // Don't start the timer if it's already at 00:00
    }

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
        localStorage.setItem("seconds", seconds - 1);
        localStorage.setItem("minutes", minutes);
      } else {
        if (minutes > 0) {
          setSeconds(59);
          setMinutes((prevMinutes) => prevMinutes - 1);
          localStorage.setItem("seconds", 59);
          localStorage.setItem("minutes", minutes - 1);
        } else {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds, minutes]);

  // Clear timer state when navigating away from the page
  const handleRouteChange = () => {
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, []);

  // useEffect(() => {
  //   // if value was cleared, set key to re-render the element
  //   if (verifyOTP.length === 0) {
  //     setKey(key + 1);
  //     return;
  //   }
  // }, [verifyOTP]);

  //onChange For OTP
  const changeHandler = (e) => {
    let otpval = e.toUpperCase();
    console.log("changeHandler", otpval);
    setVerifyOTP(otpval);
  };

  //Submission Of OTP
  const SubmitOTP = (e) => {
    e.preventDefault();

    if (verifyOTP.length !== 6) {
      setErrorBar(true);
      setErrorMessage("OTP should be a 6 digit code");
    } else {
      setErrorBar(false);
      setErrorMessage("");
      setVerifyOTP("");

      dispatch(
        verificationEmailOTP(
          verifyOTP,
          navigate,
          t,
          true,
          setSeconds,
          setMinutes
        )
      );
    }
  };

  const handleBacktoSignIn = () => {
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row className='posotion-relative'>
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>

        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className='d-flex justify-content-center align-items-center min-vh-100'>
            <span
              className={
                styles["Forgot_password_Verification_loginbox_auth_paper"]
              }>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={
                  styles["ForgotPassword_Verification_EmailVerifyBox"]
                }>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='d-flex justify-content-center'>
                    <img
                      draggable='false'
                      src={
                        localStorage.getItem("i18nextLng") === "ar"
                          ? DiskusLogoArabic
                          : DiskusLogo
                      }
                      width={220}
                      alt='diskus_logo'
                    />
                  </Col>
                </Row>
                <Form onSubmit={SubmitOTP}>
                  <Row className='mt-5 '>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["OTPHandler"]}>
                      <span className={styles["EmailVerifyLabel"]}>
                        {t("Enter-verification-code")}
                      </span>
                    </Col>
                  </Row>
                  <Row className={styles["BoxesforOTP"]}>
                    <Col sm={12} md={12} lg={12}>
                      <VerificationInputField
                        fields={6}
                        applyClass='OTPInput'
                        value={verifyOTP}
                        change={changeHandler}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className='text-left d-flex justify-content-between'>
                      <span
                        className={
                          styles["Forgot_Password_Verification_Tagline"]
                        }>
                        {t("Didnt-receiverthe-code")}
                        <Button
                          className={
                            styles[
                              "Forgot_Password_Verification_resendCode_btn"
                            ]
                          }
                          disableBtn={seconds > 0 || minutes > 0}
                          text={t("Resend-code")}
                          type='button'
                          onClick={sendRequestResend}
                        />
                      </span>
                      <span
                        className={
                          styles[
                            "Forgot_password_Verification_update_OTPCounter"
                          ]
                        }>
                        0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["OTP_Error_Messege"]}>
                      {errorMessage}
                    </Col>
                  </Row>

                  <Row className='mt-5 d-flex justify-content-center'>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className='d-flex justify-content-center mt-1 '>
                      <Button
                        text={t("Next")}
                        onClick={SubmitOTP}
                        className={
                          styles[
                            "Forgot_Password_Verification_Next_button_EmailVerify"
                          ]
                        }
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className='mt-3'>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      styles["Forgot_passwordforogt_verification_email_link"]
                    }>
                    <Link onClick={handleBacktoSignIn}>{t("Go-back")}</Link>
                  </Col>
                </Row>
              </Col>
            </span>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className='position-relative d-flex overflow-hidden'>
            <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
              <h1 className={styles["heading-1"]}>
                {t("Simplify-management")}
              </h1>
              <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
              <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
            </Col>
            <Col md={4} lg={4} sm={12} className='position-relative'>
              <img
                draggable='false'
                src={DiskusAuthPageLogo}
                alt='auth_icon'
                width='600px'
                className={styles["Forgot_Password_Verification_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ForgotPasswordVerificationUM;
