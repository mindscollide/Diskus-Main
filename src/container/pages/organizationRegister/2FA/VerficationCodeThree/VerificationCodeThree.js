import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "./VerificationCodeThree.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import img10 from "../../../../../assets/images/10.png";
import { useSelector, useDispatch } from 'react-redux'
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { resendTwoFacAction } from "../../../../../store/actions/TwoFactorsAuthenticate_actions";
import { useTranslation } from 'react-i18next'
const VerificationCodeThree = () => {
  const { Authreducer } = useSelector(state => state)
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [verifyOTP, setVerifyOTP] = useState(null)
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  console.log(location, "location")
  const [minutes, setMinutes] = useState(
    localStorage.getItem("minutes") ? localStorage.getItem("minutes") : 4
  );
  const [seconds, setSeconds] = useState(
    localStorage.getItem("seconds") ? localStorage.getItem("seconds") : 60
  );
  const [device, setDevice] = useState({
    DeviceName: "",
    UserDeviceID: 0,
    DeviceRegistrationToken: "",
  })
  const resendOtpHandleClick = () => {
    let userID = localStorage.getItem("userID");
    let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
    localStorage.removeItem("seconds");
    localStorage.removeItem("minutes");
    setVerifyOTP("");
    let Data = { UserID: JSON.parse(userID), Device: "Browser", DeviceID: "c", OrganizationID: JSON.parse(OrganizationID), isEmail: false, isSMS: false, isDevice: true, UserDevices: [] }
    dispatch(resendTwoFacAction(t, Data, navigate, setSeconds, setMinutes))
  }
  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      setDevice({
        DeviceName: location.state.currentDevice.DeviceName,
        UserDeviceID: location.state.currentDevice.UserDeviceID,
        DeviceRegistrationToken: location.state.currentDevice.DeviceRegistrationToken,
      })
    }
  }, [location.state])
  useEffect(() => {
    if (Authreducer.SendTwoFacOTPResponse !== null) {
      let OTPValue = Authreducer.SendTwoFacOTPResponse
      setVerifyOTP(OTPValue?.otpCode)
    }
  }, [Authreducer.SendTwoFacOTPResponse])
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
    <>
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
                    <img src={img1} alt="diskus_logo" />
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
                        2FA Verification
                      </h3>
                      <span className="SubHeadingVerificationCodeThree">
                        A Notification Has Been Sent To Your Device
                      </span>
                    </Col>
                  </Row>

                  <Row className="EmailBoxverifcationCodeThree">
                    <Col sm={12} md={12} lg={12} className="mt-2 d-flex justify-content-center">
                      <img width={"35px"} src={img10} alt="" />
                    </Col>
                    <Col sm={12} md={12} lg={12} className="mt-2 text-center">
                      <span className="device-title">{device.DeviceName}</span>
                    </Col>
                    <Col sm={12} md={12} lg={12} className="mt-1 text-center">
                      <span className="otp_value"> {verifyOTP}</span>
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
                        text="SEND AGAIN"
                        className="Next_button_EmailVerifyVerificationCodeThree"
                        onClick={resendOtpHandleClick}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Row className="mt-1">
                <Col sm={12} md={12} lg={12} className="forogt_email_link_verification_Code_Three">
                  <Link to="/">Go Back</Link>
                </Col>
              </Row>
            </Paper>
          </Col>
          <Col md={7} lg={7} sm={12} className="p-0">
            <div className="parent-class-images positionRelative">
              <div className="Auth_Icon1SendEmailVerificationCodeThree">
                <img src={img9} alt="auth_icon" width="250px" />
              </div>
              <div className="circle-imageVerifcationCodeThree">
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
      {Authreducer.Loading && Authreducer.SendTwoFacOTPResponse !== null ? <Loader /> : null}
    </>
  );
};

export default VerificationCodeThree;
