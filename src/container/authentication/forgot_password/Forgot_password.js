import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Notification,
  Loader,
} from "./../../../components/elements";
import "./Forgot_password.css";
import ForgotLogo from "../../../assets/images/logoforgot.svg";
import logo from "./../../../assets/images/diskus-logo.png";
import { Eye } from "react-bootstrap-icons";
import { Row, Col, Container, Image } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import changePasswordRequest from "../../../store/actions/Auth_Forgot_Password";
import ErrorBar from "../sign_up/errorbar/ErrorBar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import DiskusLogoforSignCard from "../../../assets/images/diskuslogo-forsigncard.svg";

const ForgotPassword = () => {
  const [checkForgot, setCheckerForgot] = useState(false);
  const [forgotErrorField, setForgotErrorField] = useState(false);
  const state = useSelector((state) => state);
  const location = useLocation();
  const { auth } = state;
  console.log("aulocationth", location);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const [credentials, setCredentials] = useState({
    forgetEmail: {
      content: "",
      isError: false,
      isSuccess: false,
      errorMessage: "",
      isFail: false,
    },
  });
  function validateEmail(emailAddress) {
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(emailAddress).toLowerCase());
  }

  console.log(credentials);
  const changeHandler = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    switch (fieldName) {
      case "forgetEmail":
        setCredentials({
          ...credentials,
          [fieldName]: { ...credentials[fieldName], content: fieldValue },
        });
        break;
    }
  };
  console.log("contentcontent", credentials.forgetEmail.content);
  const handleVerificationOTP = (e) => {
    console.log("Field is Empty", credentials.forgetEmail.content);

    if (credentials.forgetEmail.content === "") {
      console.log("Field is Empty");

      setOpen({
        ...open,
        open: true,
        message: t("This-field-is-empty"),
      });
      setForgotErrorField(true);
    } else if (credentials.forgetEmail.content != "") {
      console.log("Field is Empty", credentials.forgetEmail.content);

      if (validateEmail(credentials.forgetEmail.content)) {
        console.log("Field is Empty");

        dispatch(
          changePasswordRequest(credentials.forgetEmail.content, navigate)
        );
        setCredentials({
          ...credentials,
          forgetEmail: {
            content: "",
          },
        });
      } else {
        console.log("Field is Empty");
        setForgotErrorField(false);
      }
    }
  };

  useEffect(() => {
    if (auth.ForgotPasswordData.responseMessage === "Failed to identify user") {
      setOpen({
        ...open,
        open: true,
        message: auth.ForgotPasswordData.responseMessage,
      });
    }
  }, [auth.ForgotPasswordData]);
  useEffect(() => {
    let checker = localStorage.getItem("globalPassowrdChecker");
    let emailAddress = localStorage.getItem("Email");
    if (checker !== undefined && checker !== "") {
      if (checker) {
        setCheckerForgot(checker);
        setCredentials({
          forgetEmail: {
            content: JSON.parse(emailAddress),
          },
        });
      }
    }
  }, []);

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

  useEffect(() => {
    if (auth.Loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [auth.Loading]);

  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center">
          <Col xs={8}>
            <Row>
              <Col
                lg={12}
                md={12}
                xs={12}
                className="body-inner d-flex justify-content-center align-items-center"
              >
                <Row>
                  <Col lg={12} md={12} xs={12} className="forgot-box">
                    <Paper className="px-3 py-2">
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <Image src={ForgotLogo} fluid />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="login-box-heading color-primary fw-500 my-2  d-flex justify-content-center"
                        >
                          {/* Forgot
                          <br />
                          Password? */}
                          {t("Forgot-password")}
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          lg={11}
                          md={11}
                          sm={11}
                          xs={11}
                          className="margin-left-20"
                        >
                          <TextField
                            disable={checkForgot}
                            applyClass="form-control2"
                            iconClass
                            type="text"
                            name="forgetEmail"
                            label={t("Email-address")}
                            labelClass="lightLabel"
                            value={credentials.forgetEmail.content || ""}
                            change={changeHandler}
                          />
                          {forgotErrorField === true &&
                          credentials.forgetEmail.content === "" ? (
                            <ErrorBar errorText={t("This-field-is-empty")} />
                          ) : forgotErrorField === true &&
                            !validateEmail(credentials.forgetEmail.content) ? (
                            <ErrorBar
                              errorText={t("Please-enter-valid-email-address")}
                            />
                          ) : null}
                        </Col>
                        <Col lg={1} md={1} sm={1} xs={1} />
                      </Row>

                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          xs={12}
                          className="forgot_passwordnextBtn"
                        >
                          <Button
                            className="SignInForgot"
                            text={t("Next")}
                            onClick={handleVerificationOTP}
                          />
                        </Col>
                      </Row>
                      {!checkForgot && (
                        <Row className="mt-0 mb-5 py-3 ">
                          <Col
                            lg={12}
                            md={12}
                            xs={12}
                            className=" text-center mt-2  mb-5 cursor-pointer text-primary underline "
                            onClick={() => navigate("/")}
                          >
                            {/* Back to Sign In */}
                            {t("Back-to-signin")}
                          </Col>
                        </Row>
                      )}
                    </Paper>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {/* <Col xs={2} className="text-end mt-3">
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
          </Col> */}
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {auth.Loading ? <Loader /> : null}
    </>
  );
};

export default ForgotPassword;
