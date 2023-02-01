import React, { useState, useEffect } from "react";
import { Row, Col, Image, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import DiskusLogoforSignCard from "../../../assets/images/diskuslogo-forsigncard.svg";
import {
  Button,
  Paper,
  VerificationInputField,
  Loader,
  Notification,
} from "./../../../components/elements";
import { useNavigate } from "react-router-dom";
import "./../../../i18n.js";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  VerifyOTPSignUp,
  ResendOTP,
} from "../../../store/actions/Auth_Verify_Opt";
import { useDispatch } from "react-redux";
import "./SignUp_Verification.css";
const VerificationSignUp = () => {
  const [verificationData, setVerificationData] = useState({
    UserID: 0,
    Email: "",
    OTP: "",
  });

  // for verification error
  const [verificationError, setVerificationError] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const disptach = useDispatch();

  const state = useSelector((state) => state);
  const { auth } = state;

  console.log("auth", auth);
  const navigate = useNavigate();

  const VerificationHandler = (e) => {
    console.log("verificationData 1.1", e);
    setVerificationData({
      ...verificationData,
      OTP: e,
    });
  };

  const resendFunction = () => {
    console.log("Clicked Resend");
    disptach(ResendOTP(verificationData));
  };

  let currentUserID = localStorage.getItem("userID");
  let currentEmail = localStorage.getItem("Email");
  const verifyOTPSignUp = async () => {
    disptach(VerifyOTPSignUp(verificationData, navigate, setVerificationError));
  };

  useEffect(() => {
    console.log("auth", auth);

    let otpData = auth.ForgotPasswordData;
    console.log("auth otpData", otpData, otpData != []);
    if (
      otpData != undefined &&
      otpData != null &&
      otpData != NaN &&
      otpData != []
    ) {
      setVerificationData({
        ...verificationData,
        UserID: currentUserID,
        Email: JSON.parse(currentEmail),
      });
    }
  }, [auth.ForgotPasswordData]);

  useEffect(() => {
    if (auth.message) {
      setOpen({
        ...open,
        open: true,
        message: auth.message,
      });
    }
  }, [auth.message]);

  console.log("auth", auth);

  //For Localization
  const { t, i18n } = useTranslation();

  // Languages
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  //   // document.title = t("app_title");
  // }, [currentLangObj, t]);

  return (
    <>
      <Row className="m-0">
        <Col lg={2} md={2} sm={12}></Col>
        <Col lg={8} md={8} sm={12}>
          <Row>
            <Col
              lg={12}
              md={12}
              xs={12}
              className="body-inner d-flex justify-content-center align-items-center"
            >
              <Row>
                <Col
                  lg={12}
                  md={12}
                  xs={12}
                  className="verification-box border"
                >
                  <Paper className="paperpadding">
                    <Row>
                      <Col lg={12} md={12} xs={12} className="">
                        <Image src={DiskusLogoforSignCard} fluid />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        // className="login-box-heading color-primary fw-600"
                        className="login-box-heading signupVerification"
                      >
                        {/* Sign Up */}
                        {t("SignUp-Heading")}
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      {verificationError ? (
                        <>
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="text-center my-2"
                          >
                            <Form.Text className="text-center">
                              <div className="verificationinvalid_message">
                                {/* Incorrect Verfication Code. Try Again */}
                                {t("IncorrectVerficationCodeTryAgain")}
                              </div>
                            </Form.Text>
                          </Col>
                        </>
                      ) : null}
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        // className="login-box-heading color-primary fw-600"
                        className="sentVerification"
                      >
                        {/* We have sent you a verification code on your email. */}
                        {t("WeHaven'tSendVerificationCode")}
                      </Col>
                    </Row>
                    <Row className="my-1">
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-left flex-column align-items-left enterVerification"
                      >
                        <VerificationInputField
                          label={t("EnterVerificationCode")}
                          applyClass="fs-1"
                          change={VerificationHandler}
                          name="VerficationField"
                          value={verificationData.OTP}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex justify-content-left flex-column align-items-left">
                        <Form.Text>
                          {/* Didn't receive the code?{" "} */}
                          {t("Didn'tReceiveCode")}{" "}
                          <span
                            className="resend_message"
                            onClick={resendFunction}
                          >
                            {/* Resend Code */}
                            {t("ResendCode")}
                          </span>
                        </Form.Text>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={12} md={12} xs={12} className="verifyOTP_btn">
                        <Button
                          className="SignUnVerification"
                          // text="SIGN UP"
                          text={t("SignUp-Heading")}
                          onClick={verifyOTPSignUp}
                        />
                      </Col>
                    </Row>
                  </Paper>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={2} sm={12} className="text-end mt-3">
          {/* <select
            className="language-dropdown"
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option
                className="language-dropdown-value"
                key={code}
                value={code}
              >
                {name}
              </option>
            ))}
          </select> */}
        </Col>
      </Row>
      {auth.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default VerificationSignUp;
