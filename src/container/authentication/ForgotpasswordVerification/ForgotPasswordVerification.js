import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  Notification,
  Loader,
  VerificationInputField,
} from "./../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "./../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./ForgotPasswordVerificaiton.module.css";
import DiskusAuthPageLogo from "./../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ResendOTP } from "../../../../src/store/actions/Auth_Verify_Opt";
import { cleareChangePasswordMessage } from "../../../store/actions/Auth_Forgot_Password";
import {
  cleareMessage,
  verificationEmailOTP,
} from "../../../../src/store/actions/Auth2_actions";
import LanguageSelector from "../../../components/elements/languageSelector/Language-selector";
const ForgotPasswordVerification = () => {
  const { auth, Authreducer, LanguageReducer } = useSelector((state) => state);
  const [key, setKey] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [open, setOpen] = useState({
    open: false,
    message: "",
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
    dispatch(ResendOTP(t, data, setSeconds, setMinutes));
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

  //for messeges shown in the snack-bar
  useEffect(() => {
    if (auth.ResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      });
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
      dispatch(cleareMessage());
    }
  }, [Authreducer.VerifyOTPEmailResponseMessage]);

  useEffect(() => {
    // if value was cleared, set key to re-render the element
    if (verifyOTP.length === 0) {
      setKey(key + 1);
      return;
    }
  }, [verifyOTP]);

  const changeHandler = (e) => {
    let otpval = e.toUpperCase();
    console.log("changeHandler", otpval);
    setVerifyOTP(otpval);
  };

  const SubmitOTP = (e) => {
    e.preventDefault();
    console.log("changeHandler", verifyOTP);

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
  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row className="posotion-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
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
                    <img
                      draggable="false"
                      src={DiskusLogo}
                      width={220}
                      alt="diskus_logo"
                    />
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
                        {t("Enter-verification-code")}
                      </span>
                    </Col>
                  </Row>
                  <Row className={styles["BoxesforOTP"]}>
                    <Col sm={12} md={12} lg={12}>
                      <VerificationInputField
                        fields={6}
                        applyClass="OTPInput"
                        key={key}
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
                        {t("Didnt-receiverthe-code")}
                        <Button
                          className={
                            styles[
                              "Forgot_Password_Verification_resendCode_btn"
                            ]
                          }
                          disableBtn={seconds > 0 || minutes > 0}
                          text={t("Resend-code")}
                          type="button"
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
                    <Link to="/">{t("Back-to-sign-in")}</Link>
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
                draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Forgot_Password_Verification_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      {auth.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : Authreducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ForgotPasswordVerification;
