import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
  VerificationInputField,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationCodeOne.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img2 from "../../../../../assets/images/7.png";
import img3 from "../../../../../assets/images/3.png";
// import img4 from "../../../../assets/images/4.png";
import { useTranslation } from "react-i18next";
import img5 from "../../../../../assets/images/5.png";
import img6 from "../../../../../assets/images/6.png";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  verificationTwoFacOtp,
  resendTwoFacAction,
} from "../../../../../store/actions/TwoFactorsAuthenticate_actions";

const VerificationCodeOne = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const { Authreducer } = useSelector((state) => state);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  let GobackSelection = localStorage.getItem("GobackSelection");
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  const handleChange = (e) => {
    setOtpCode(e.toUpperCase());
  };
  const handleSubmit = async (e) => {
    let userID = localStorage.getItem("userID");
    e.preventDefault();
    let Data = { UserID: JSON.parse(userID), Email: email, OTP: otpCode };
    await dispatch(verificationTwoFacOtp(t, Data, navigate));
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
      DeviceID: "c",
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
      setEmail(Authreducer.AuthenticateAFAResponse.emailAddress);
      setPhoneNumber(Authreducer.AuthenticateAFAResponse.mobileNumber);
    }
  }, [Authreducer.AuthenticateAFAResponse]);

  useEffect(() => {
    if (Authreducer.SendTwoFacOTPResponseMessage !== "") {
      setOpen({
        open: true,
        message: Authreducer.SendTwoFacOTPResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        Authreducer.SendTwoFacOTPResponseMessage = "";
      }, 2000);
    }
  }, [Authreducer.SendTwoFacOTPResponseMessage]);
  useEffect(() => {
    if (location.state !== null) {
      setValue(location.state.value);
    }
  }, [location.state]);

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

  return (
    <div>
      <Container fluid className="VerifyCodeOneOverflow">
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className="OTP_auth_paper">
              <Col sm={12} lg={12} md={12} className="EmailVerifyOTPbox">
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center mb-3"
                  >
                    <img
                      src={DiskusLogo}
                      alt="diskus_logo"
                      width="225px"
                      height="80px"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="mt-4">
                    <span className="TwoFa_heading ">2FA Verification</span>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p className="verify_heading_line1">
                      6 digit code has sent on to this
                    </p>
                    {value === 0 ? (
                      <p className="verify_heading_line2">
                        number: {phoneNumber}
                      </p>
                    ) : value === 1 ? (
                      <p className="verify_heading_line2">E-mail: {email}</p>
                    ) : (
                      <>
                        <p className="verify_heading_line2">
                          number: {phoneNumber}
                        </p>
                        <p className="verify_heading_line2">E-mail: {email}</p>
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col sm={12} md={12} lg={12}>
                    <VerificationInputField
                      label="Enter Code"
                      fields={6}
                      applyClass="OTPInput"
                      change={handleChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-left d-flex justify-content-between">
                    <Button
                      className="resendCode_btn"
                      disableBtn={seconds > 0 || minutes > 0}
                      text="Resend Code"
                      onClick={resendOtpHandleClick}
                    />
                    <span className="OTPCounter">
                      0{minutes}: {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {/* <Col>
                    <p
                      className={
                        errorBar
                          ? ` ${styles["errorMessage-OTP"]} `
                          : `${styles["errorMessage-OTP_hidden"]}`
                      }
                    >
                      {errorMessage}
                    </p>
                  </Col> */}
                </Row>
                <Row className=" mt-5 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text="Verify"
                      disableBtn={otpCode.length !== 6 ? true : false}
                      className="subscribNow_button_EmailVerify"
                      onClick={handleSubmit}
                    />
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="Go_back_link_VerifyCodeOne"
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
                      Go Back
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <div className="parent-class-images positionRelative">
              <div className="Auth_Icon1_VerifyCodeOne">
                <img src={img2} alt="auth_icon" width="380px" />
              </div>
              <div className="circle-image_VerifyCodeOne">
                <img
                  src={img3}
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
      <Notification open={open.open} setOpen={setOpen} message={open.message} />
    </div>
  );
};

export default VerificationCodeOne;
