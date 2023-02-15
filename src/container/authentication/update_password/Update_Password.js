import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Loader,
} from "./../../../components/elements";
import logo from "./../../../assets/images/diskuslogo-forsigncard.svg";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Row, Col, Container, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorBar from "./../sign_up/errorbar/ErrorBar";
import { useSelector, useDispatch } from "react-redux";
import changePasswordFunc from "../../../store/actions/Auth_Changes_Password";
import "./update_password.css";
import "./../../../i18n.js";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const UpdatePassword = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [newShowPassword, setNewShowPassword] = useState(false);
  const [showconfirmpassword, setShowConfirmpassword] = useState(false);

  //password strength meter
  const [meter, setMeter] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { auth } = state;
  console.log("changePasswordFunc", auth);
  const [isEqualPassword, setEqualPassword] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    UserID: 0,
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  useEffect(() => {
    let Email = localStorage.getItem("Email");
    let UserID = localStorage.getItem("userID");
    console.log("NewPasswordData 122", UserID, Email);

    if (
      Email != undefined &&
      Email != null &&
      Email != NaN &&
      UserID != undefined &&
      UserID != null &&
      UserID != NaN
    ) {
      setNewPasswordData({
        ...newPasswordData,
        ["UserID"]: parseInt(UserID),
        ["Email"]: Email,
        ["Password"]: "",
        ["ConfirmPassword"]: "",
      });
    }
  }, []);
  console.log("NewPasswordData 122", newPasswordData);

  const showPassword = () => {
    setShowPassword(!showpassword);
  };
  const shownewConfirmPassowrd = () => {
    setNewShowPassword(!newShowPassword);
  };
  //regex for uppercase
  const atLeastOneUppercase = /[A-Z]/g;
  //regex for lowercase
  const atLeastOneLowercase = /[a-z]/g;
  //regex for Numeric
  const atLeastOneNumeric = /[0-9]/g;
  //regex for specialChar
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g;

  // characters within the square brackets
  const eightCharsOrMore = /.{8,}/g;

  const passwordTracker = {
    upperCase: newPasswordData.Password.match(atLeastOneUppercase),
    lowerCase: newPasswordData.Password.match(atLeastOneLowercase),
    numericData: newPasswordData.Password.match(atLeastOneNumeric),
    specialCharacter: newPasswordData.Password.match(atLeastOneSpecialChar),
    eightCharsOrGreater: newPasswordData.Password.match(eightCharsOrMore),
  };

  const passwordStrength = Object.values(passwordTracker).filter(
    (value) => value
  ).length;

  useEffect(() => {
    console.log(
      "changePasswordFunc Password",
      newPasswordData.Password === newPasswordData.ConfirmPassword
    );

    if (newPasswordData.Password === newPasswordData.ConfirmPassword) {
      console.log("changePasswordFunc", isEqualPassword);

      setEqualPassword(true);
    } else {
      setEqualPassword(false);
    }
  }, [newPasswordData]);
  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("changePasswordFunc", isEqualPassword);

    if (isEqualPassword) {
      console.log("changePasswordFunc", newPasswordData);

      dispatch(changePasswordFunc(newPasswordData, navigate));
    }
  };

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
      <Container>
        <Row>
          <Col lg={2} md={2} sm={12}></Col>
          <Col lg={8} md={8} sm={12}>
            <Row>
              <Col
                lg={12}
                md={12}
                xs={12}
                className="body-inner d-flex justify-content-center align-items-center updatepassword_"
              >
                <Row>
                  <Col lg={12} md={12} xs={12} className="login-box border">
                    <Form onSubmit={handleConfirm}>
                      <Paper className="newPasswordPaper">
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="d-flex justify-content-center mb-3"
                          >
                            <Image src={logo} fluid />
                          </Col>
                        </Row>

                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="login-box-heading color-primary fw-600 my-2"
                          >
                            {/* New Password */}
                            {t("New-password")}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="position-relative"
                          >
                            <TextField
                              focus={() => setMeter(true)}
                              applyClass="form-control2"
                              className="PasswordTextField mb-2"
                              type={showpassword ? "text" : "password"}
                              label={t("New-password")}
                              name="newpassword"
                              inputIcon={showpassword ? <EyeSlash /> : <Eye />}
                              iconClassName="IconStyle"
                              value={newPasswordData.Password || ""}
                              labelClass="lightLabel"
                              change={(e) =>
                                setNewPasswordData({
                                  ...newPasswordData,
                                  ["Password"]: e.target.value,
                                })
                              }
                              autoComplete="false"
                              clickIcon={showPassword}
                            />{" "}
                            <div>
                              <div className="password-strength-meter">
                                <div
                                  className={
                                    meter && newPasswordData.Password.length > 0
                                      ? "password-strength-meter_message_visible"
                                      : "password-strength-meter_message_hidden"
                                  }
                                >
                                  {passwordStrength < 5 &&
                                    "Must Contain Upper & Lower case Special Char, Number & 8 or more"}
                                  {!passwordTracker.upperCase}
                                  {!passwordTracker.lowerCase}
                                  {!passwordTracker.numericData}
                                  {!passwordTracker.specialCharacter}
                                  {!passwordTracker.eightCharsOrGreater}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="position-relative"
                          >
                            <TextField
                              applyClass="form-control2"
                              className="PasswordTextField mt-2"
                              type={newShowPassword ? "text" : "password"}
                              label={t("Confirm-new-password")}
                              inputIcon={
                                newShowPassword ? <EyeSlash /> : <Eye />
                              }
                              name="newconfirmpassword"
                              iconClassName="IconStyle"
                              value={newPasswordData.ConfirmPassword || ""}
                              labelClass="lightLabel"
                              // change={(e) => setConfirmPassowrd(e.target.value)}
                              change={(e) =>
                                setNewPasswordData({
                                  ...newPasswordData,
                                  ["ConfirmPassword"]: e.target.value,
                                })
                              }
                              autoComplete="false"
                              clickIcon={shownewConfirmPassowrd}
                            />
                            <ErrorBar
                              className={
                                isEqualPassword === false &&
                                newPasswordData.ConfirmPassword === ""
                                  ? "errorbar_visiblity_hidden"
                                  : isEqualPassword === false &&
                                    newPasswordData.ConfirmPassword !== ""
                                  ? "errorbar_visiblity_visible"
                                  : "errorbar_visiblity_hidden"
                              }
                              errorText={"Password does not match"}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="confirm_button_updatePassword"
                          >
                            <Button
                              className="updatePasswordBtn mb-5"
                              text="Confirm"
                              //  onClick={handleConfirm}
                            />
                          </Col>
                        </Row>
                      </Paper>
                    </Form>
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
      </Container>
      {auth.Loading ? <Loader /> : null}
    </>
  );
};

export default UpdatePassword;
