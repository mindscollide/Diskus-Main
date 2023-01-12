import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Notification,
  Loader,
} from "./../../../components/elements";
import DiskusLogoforSignCard from "../../../assets/images/diskuslogo-forsigncard.svg";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Row, Col, Container, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  clearResponseMessage,
  signIn,
} from "../../../store/actions/Auth_Sign_In";
import {
  clearState,
  HideNotificationAuth,
} from "../../../store/actions/Auth_action";
import { useDispatch, useSelector } from "react-redux";
import ErrorBar from "../sign_up/errorbar/ErrorBar";
import "./Sign_in.css";
import "./../../../i18n.js";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const Login = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = state;
  const [signInErrorField, setSignInErrorField] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const [credentials, setCredentials] = useState({
    emailAddress: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    password: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    completed: false,
  });
  function validateEmail(emailAddress) {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(emailAddress).toLowerCase());
  }

  useEffect(() => {
    console.log("Clear Occur");
    dispatch(clearState());
  }, []);

  const changeHandler = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    switch (fieldName) {
      case "emailAddress":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;
      case "password":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;
    }
  };
  const userData = {
    Password: credentials.password.content,
    UserName: credentials.emailAddress.content,
  };
  const navigateToSign = () => {
    dispatch(clearResponseMessage());
    navigate("/SignUp");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      credentials.emailAddress.content === "" ||
      credentials.password.content === ""
    ) {
      setOpen({
        ...open,
        open: true,
        message: t("Please-Fill-All-Fields"),
      });
    } else if (
      credentials.emailAddress.content !== "" &&
      credentials.password.content !== ""
    ) {
      if (validateEmail(credentials.emailAddress.content)) {
        dispatch(signIn(userData, navigate));
      } else {
        setSignInErrorField(true);
      }
    }
  };
  const unhidePassword = () => {
    setShowPassword(!showpassword);
  };
  useEffect(() => {
    if (auth.ResponseMessage !== "") {
      // setSignInErrorField(true);
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      });
    }
    dispatch(HideNotificationAuth());
  }, [auth.ResponseMessage]);

  //For Localization
  const { t, i18n } = useTranslation();

  // Languages
  const languages = [
    { name: "English", code: "en" },
    // { name: "日本語", code: "ja" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
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
  // }, [currentLangObj, t]);

  console.log("currentLocale", currentLocale);

  let currentLanguage = localStorage.getItem("i18nextLng");

  useEffect(() => {
    document.body.className = "login-page" + " " + currentLocale;
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col lg={4} md={4} sm={12} className="positionRelative">
            {currentLanguage === "ar" ? (
              <Row className="language-dropdown-row">
                <Col lg={12} md={12} xs={12}>
                  <select
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
                  </select>
                </Col>
              </Row>
            ) : null}
            <Row>
              <Col
                lg={12}
                md={12}
                xs={12}
                className="body-inner d-flex justify-content-center align-items-center"
              >
                <Row>
                  <Col lg={12} md={12} xs={12} className="login-box border">
                    <Paper>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="d-flex justify-content-center my-3"
                        >
                          <Image src={DiskusLogoforSignCard} fluid />
                        </Col>
                      </Row>
                      <Form onSubmit={handleLogin}>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="login-box-heading color-primary fw-400"
                          >
                            {/* Sign In */}
                            {t("SignIn-heading")}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={12} md={12} xs={12}>
                            <TextField
                              formParentClass="signInInput"
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              label={t("EmailAddress")}
                              labelClass="lightLabel"
                              value={credentials.emailAddress.content}
                              change={changeHandler}
                              name="emailAddress"
                            />
                            {signInErrorField === true &&
                            credentials.emailAddress.content === "" ? (
                              <ErrorBar errorText={"This Field Is Empty"} />
                            ) : signInErrorField === true &&
                              !validateEmail(
                                credentials.emailAddress.content
                              ) ? (
                              <ErrorBar
                                errorText={"Please Enter Valid Email Address"}
                              />
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="position-relative"
                          >
                            <TextField
                              formParentClass="signInInput"
                              applyClass="form-control2"
                              className="PasswordTextField"
                              type={showpassword ? "text" : "password"}
                              label={t("Password")}
                              name="password"
                              inputIcon={showpassword ? <EyeSlash /> : <Eye />}
                              iconClassName="IconStyle"
                              value={credentials.password.content || ""}
                              labelClass="lightLabel"
                              change={changeHandler}
                              autoComplete="false"
                              clickIcon={unhidePassword}
                              // required
                            />
                            {signInErrorField === true &&
                            credentials.password.content === "" ? (
                              <ErrorBar errorText={"This Field Is Empty"} />
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className="w-100 text-center"
                          >
                            <Button
                              className="SignInButton"
                              text={t("SignIn-heading")}
                              // onClick={handleLogin}
                            />
                          </Col>
                        </Row>
                      </Form>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="forgot-ps-link text-center text-primary mt-2  cursor-pointer"
                          onClick={() => navigate("/forgotpassword")}
                        >
                          {t("ForgotPassword")}
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="create-account-link text-center "
                        >
                          {/* Don't have an account?{" "} */}
                          {t("donthaveaccount")}
                          <span
                            className="text-primary cursor-pointer create-account-link-signIn"
                            onClick={navigateToSign}
                          >
                            {/* Click Here */}
                            {t("clickhere")}
                          </span>
                        </Col>
                      </Row>
                    </Paper>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col lg={8} md={8} sm={12} className="sign-in-relative">
            {currentLanguage === "ar" ? null : (
              <Row className="language-dropdown-row">
                <Col lg={12} md={12} xs={12}>
                  <select
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
                  </select>
                </Col>
              </Row>
            )}

            <Row>
              <Col
                lg={12}
                md={12}
                xs={12}
                className="body-inner d-flex justify-content-center align-items-center"
              >
                <div className="LoginPageHeading">
                  {/* <h1>Simplify Management.</h1>
                  <h1>Collaborate.</h1>
                  <h1>Prioritize.</h1> */}
                  <h1>{t("SimplifyManagement")}</h1>
                  <h1>{t("Collaborate")}</h1>
                  <h1>{t("Prioritize")}</h1>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {auth.Loading ? <Loader /> : null}
    </>
  );
};

export default Login;
