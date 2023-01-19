import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Notification,
  Paper,
  Loader,
} from "./../../../components/elements";
import { useSelector } from "react-redux";
import "./../../../i18n.js";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import DiskusLogoforSignCard from "../../../assets/images/diskuslogo-forsigncard.svg";
import { Eye } from "react-bootstrap-icons";
import { Row, Col, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorBar from "./../sign_up/errorbar/ErrorBar";
import { signUp } from "./../../../store/actions/Auth_Sign_Up";
import "./Sign_up.css";
import { clearResponseMessage } from "../../../store/actions/Auth_Sign_In";
import { HideNotificationAuth } from "../../../store/actions/Auth_action";

const SignUp = () => {
  const state = useSelector((state) => state);
  const { auth } = state;

  //For Localization
  const { t, i18n } = useTranslation();

  console.log("auth", auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // for signup fields error
  const [signUpErrorField, setSignErrorUpField] = useState(false);

  const [credentials, setCredentials] = useState({
    name: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    organization: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    designation: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    email: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    countryCode: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
    phoneNumber: {
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
    confirmPassword: {
      content: "",
      isError: true,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
  });
  function validateEmail(email) {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  }
  const setTextFieldsHandler = (e) => {
    console.log("name: ", e.target.name, "value: ", e.target.value);

    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    switch (fieldName) {
      case "name":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      case "organization":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      case "designation":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      case "email":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      case "countryCode":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      case "phoneNumber":
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

      case "confirmPassword":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;

      default:
        return null;
    }
  };

  const signupData = async () => {
    setSignErrorUpField(false);

    if (
      credentials.name.content != "" &&
      credentials.organization.content != "" &&
      credentials.designation.content != "" &&
      credentials.email.content != "" &&
      credentials.countryCode.content != "" &&
      credentials.phoneNumber.content != "" &&
      credentials.password.content != "" &&
      credentials.confirmPassword.content != "" &&
      credentials.password.content === credentials.confirmPassword.content
    ) {
      console.log("valuecheckemail", credentials.email.content);
      setSignErrorUpField(false);
      if (validateEmail(credentials.email.content)) {
        console.log("valuecheckemailll");
        // setIsSuccessPage(false);
        setSignErrorUpField(false);
        setCredentials({ ...credentials });
        dispatch(signUp(credentials, navigate, t));
        // successPage();
      } else {
        console.log("valuecheckemail");
        setSignErrorUpField(false);
        setOpen({
          ...open,
          open: true,
          message: t("Please-Correct-your-email"),
        });
        console.log("valuecheckemail");
        setSignErrorUpField(true);
      }

      // optVerificationPage(true);
    } else if (
      credentials.password.content !== credentials.confirmPassword.content
    ) {
      setOpen({
        ...open,
        open: true,
        message: t("Please-Correct-Your-Confirm-Password"),
      });
      setSignErrorUpField(true);
    } else {
      setSignErrorUpField(true);
    }
  };

  console.log("credentials", credentials);

  const onboardValidationHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("onboardValidationHandler", name, value);
    if (name === "name" && value !== "") {
      var valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      console.log("valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("valueCheck name", valueCheck);
        setCredentials({
          ...credentials,
          name: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "name" && value === "") {
      setCredentials({
        ...credentials,
        name: {
          content: "",
        },
      });
    }
    if (name === "organization" && value !== "") {
      var valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      console.log("valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("valueCheck inorganization", valueCheck);
        setCredentials({
          ...credentials,
          organization: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "organization" && value === "") {
      setCredentials({
        ...credentials,
        organization: {
          content: "",
        },
      });
    }
    if (name === "designation" && value !== "") {
      var valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      console.log("valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("valueCheck indesignation", valueCheck);
        setCredentials({
          ...credentials,
          designation: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "designation" && value === "") {
      setCredentials({
        ...credentials,
        designation: {
          content: "",
        },
      });
    }
    if (name === "email" && value !== "") {
      console.log("onboardValidationHandler", value);

      function validateEmail(email) {
        const re =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(String(email).toLowerCase());
      }
      console.log("valueCheck inemail", validateEmail(value));
      if (validateEmail(value)) {
        console.log("valueCheck inemssail", value);
        setCredentials({
          ...credentials,
          email: {
            content: value,
          },
        });
      } else {
        console.log("valueCheck inemail", value);
      }
    } else if (name === "email" && value === "") {
      setCredentials({
        ...credentials,
        email: {
          content: "",
        },
      });
    }

    if (name === "countryCode" && value != "") {
      var valueCheck = value.replace(/[^\d]/g, "");
      console.log("countryCode valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("countryCode valueCheck", valueCheck);
        setCredentials({
          ...credentials,
          countryCode: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "countryCode" && value === "") {
      setCredentials({
        ...credentials,
        countryCode: {
          content: "",
        },
      });
    }

    if (name === "phoneNumber" && value != "") {
      var valueCheck = value.replace(/[^\d]/g, "");
      console.log("phoneNumber valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("phoneNumber valueCheck", valueCheck);
        setCredentials({
          ...credentials,
          phoneNumber: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "phoneNumber" && value === "") {
      setCredentials({
        ...credentials,
        phoneNumber: {
          content: "",
        },
      });
    }

    if (name === "password" && value != "") {
      var valueCheck = value.replace(
        /[a-zA-Z_0-9@\!#\$\^%&*()+=\-[]\\\';,\.\/\{\}\|\":<>\? ]/,
        ""
      );
      console.log("password valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("password valueCheck", valueCheck);
        setCredentials({
          ...credentials,
          password: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "password" && value === "") {
      setCredentials({
        ...credentials,
        password: {
          content: "",
        },
      });
    }

    if (name === "confirmPassword" && value != "") {
      var valueCheck = value.replace(
        /[a-zA-Z_0-9@\!#\$\^%&*()+=\-[]\\\';,\.\/\{\}\|\":<>\? ]/,
        ""
      );
      console.log("confirmPassword valueCheck", valueCheck);

      if (!valueCheck == "") {
        console.log("confirmPassword valueCheck", valueCheck);
        setCredentials({
          ...credentials,
          confirmPassword: {
            content: valueCheck,
          },
        });
      }
    } else if (name === "confirmPassword" && value === "") {
      setCredentials({
        ...credentials,
        confirmPassword: {
          content: "",
        },
      });
    }
  };

  const changeHandler = (e) => {
    setTextFieldsHandler(e);
    onboardValidationHandler(e);
  };
  const backtoSignIn = () => {
    dispatch(clearResponseMessage());
    navigate("/");
  };

  useEffect(() => {
    if (auth.ResponseMessage) {
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      });
    }
    dispatch(HideNotificationAuth());
  }, [auth.ResponseMessage]);

  // Languages
  // const languages = [
  //   { name: "English", code: "en" },
  //   { name: "Français", code: "fr" },
  // ];

  // const currentLocale = Cookies.get("i18next") || "en";

  // const [language, setLanguage] = useState(currentLocale);

  // const handleChangeLocale = (e) => {
  //   const lang = e.target.value;
  //   setLanguage(lang);
  //   i18n.changeLanguage(lang);
  // };

  // const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  //   // document.title = t("app_title");
  // }, [currentLangObj, t]);

  return (
    <>
      <Container>
        <>
          <Row>
            {/* Sign Up Input Fields */}
            <Col xs={2}></Col>
            <Col xs={8}>
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
                      className="SignUuppadding border"
                    >
                      <Paper className="paperpadding">
                        <Row>
                          <Col lg={12} md={12} xs={12} className="text-center">
                            <Image src={DiskusLogoforSignCard} fluid />
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            // className="login-box-heading color-primary fw-600"
                            className="login-box-heading signupHeading"
                          >
                            {/* Sign Up */}
                            {t("SignUp-Heading")}
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={6} md={6} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              label={
                                <>
                                  {t("Name")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              value={credentials.name.content}
                              change={onboardValidationHandler}
                              labelClass="labellight"
                              name="name"
                            />
                            {signUpErrorField === true &&
                            credentials.name.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                          <Col lg={3} md={3} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              label={
                                <>
                                  {t("Organization")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              change={onboardValidationHandler}
                              value={credentials.organization.content}
                              labelClass="labellight"
                              name="organization"
                            />
                            {signUpErrorField === true &&
                            credentials.organization.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                          <Col lg={3} md={3} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              label={
                                <>
                                  {t("Designation")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              change={onboardValidationHandler}
                              value={credentials.designation.content}
                              labelClass="labellight"
                              name="designation"
                            />
                            {signUpErrorField === true &&
                            credentials.designation.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={6} md={6} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              change={changeHandler}
                              value={credentials.email.content}
                              label={
                                <>
                                  {t("EmailAddress")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              labelClass="labellight"
                              name="email"
                            />
                            {signUpErrorField === true &&
                            credentials.email.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : signUpErrorField === true &&
                              !validateEmail(credentials.email.content) ? (
                              <ErrorBar
                                errorText={"Please Enter Valid Email Address"}
                              />
                            ) : null}
                          </Col>
                          <Col lg={2} md={2} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              value={credentials.countryCode.content}
                              change={onboardValidationHandler}
                              label={
                                <>
                                  {t("CountryCode")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              labelClass="labellight"
                              name="countryCode"
                            />
                            {signUpErrorField === true &&
                            credentials.countryCode.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                          <Col lg={4} md={4} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="text"
                              maxLength={11}
                              label={
                                <>
                                  {t("PhoneNumber")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              change={onboardValidationHandler}
                              value={credentials.phoneNumber.content}
                              labelClass="labellight"
                              name="phoneNumber"
                            />
                            {signUpErrorField === true &&
                            credentials.phoneNumber.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={6} md={6} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="password"
                              label={
                                <>
                                  {t("Password")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              change={onboardValidationHandler}
                              value={credentials.password.content}
                              labelClass="labellight"
                              name="password"
                            />
                            {signUpErrorField === true &&
                            credentials.password.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                          <Col lg={6} md={6} xs={12}>
                            <TextField
                              applyClass="form-control2"
                              iconClass
                              type="password"
                              change={onboardValidationHandler}
                              value={credentials.confirmPassword.content}
                              label={
                                <>
                                  {t("ConfirmPassword")}{" "}
                                  <span className="required_star">*</span>
                                </>
                              }
                              // label="Confirm Password"
                              labelClass="labellight"
                              name="confirmPassword"
                            />
                            {signUpErrorField === true &&
                            credentials.confirmPassword.content === "" ? (
                              <ErrorBar errorText={t("ThisFieldIsEmpty")} />
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-5">
                          <Col lg={3} md={3} xs={12} />
                          <Col
                            lg={3}
                            md={3}
                            xs={12}
                            className="SignInButton-col"
                          >
                            <Button
                              className="SignInButton"
                              text={t("BackBtn")}
                              onClick={backtoSignIn}
                              // onClick={() => navigate("/")}
                            />
                          </Col>

                          <Col lg={3} md={3} xs={12}>
                            <Button
                              className="SignInButton"
                              text={t("NextBtn")}
                              onClick={signupData}
                            />
                          </Col>
                          <Col lg={3} md={3} xs={12} />
                        </Row>
                      </Paper>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={2} className="text-end mt-3">
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
        </>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {auth.Loading ? <Loader /> : null}
    </>
  );
};

export default SignUp;
