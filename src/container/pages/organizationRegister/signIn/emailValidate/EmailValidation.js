import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "../../../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./EmailValidation.module.css";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import ErrorBar from "../../../../authentication/sign_up/errorbar/ErrorBar";
import { validationEmail } from "../../../../../commen/functions/validations";
import {
  cleareMessage,
  validationEmailAction,
} from "../../../../../store/actions/Auth2_actions";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { authReducer, Authreducer } from "../../../../../store/reducers";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from '../../../../../assets/images/newElements/Language.svg'

const EmailValidation = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { Authreducer } = useSelector((state) => state);
  const [email, setEmail] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberEmail, setRemeberEmail] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // Languages
  const languages = [
    { name: "English", code: "en" },
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

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  console.log("currentLocale", currentLocale);

  let currentLanguage = localStorage.getItem("i18nextLng");

  // useEffect(() => {
  //   document.body.className = "login-page" + " " + currentLocale;
  //   return () => {
  //     document.body.className = "";
  //   };
  // }, []);

  const emailChangeHandler = (e) => {
    if (email.trim() > 0 && validationEmail(email)) {
      setErrorBar(true);
    } else {
      setErrorBar(false);
      setEmail(e.target.value);
    }
  };

  const loginHandler = (e) => {
    e.preventDefault();
    if (email === "") {
      setOpen({
        ...open,
        open: true,
        message: t("Please-enter-email"),
      });
    } else if (validationEmail(email) === false) {
      setErrorBar(true);
      setErrorMessage(t("Error-should-be-in-email-format"));
    } else {
      setErrorBar(false);
      dispatch(validationEmailAction(email, navigate, t));
    }
  };

  // useEffect(() => {
  //   if (Authreducer.EmailValidationResponseMessage !== "") {
  //     setErrorMessage(Authreducer.EmailValidationResponseMessage);
  //     setErrorBar(true);
  //   } else {
  //     setErrorMessage("");
  //   }
  // }, [Authreducer.Loading]);

  useEffect(() => {
    localStorage.clear();
    setErrorMessage("");
    setErrorBar(false);
  }, []);

  const goForSignUp = () => {
    navigate("/packageselection");
  };

  const rememberChangeEmail = () => {
    setRemeberEmail(!rememberEmail);
  };

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
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EnterPasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
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
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);
  return (
    <>
      <Row>
        <Col className={styles["languageselect-box"]}>

          <select
            className={styles["select-language-signin"]}
            onChange={handleChangeLocale}
            value={language}
          >
            {languages.map(({ name, code }) => (
              <option key={code} value={code} className={styles["language_options"]}>
                {name}
              </option>
            ))}

          </select>
          <img src={LanguageChangeIcon} className={styles["languageIcon"]} />
        </Col>
      </Row>
      <Container fluid className={styles["auth_container"]}>

        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className={styles["EmailVerifyBox"]}>
              <Col sm={12} lg={12} md={12}  >
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
                <Row className="mt-3 mb-4 text-center">
                  <Col>
                    <span className={styles["signIn_heading"]}>{t("Sign-in")}</span>
                  </Col>
                </Row>
                <Form onSubmit={loginHandler}>
                  <Row className="">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center flex-column"
                    >
                      <Form.Control
                        required
                        className={styles["inputEmailField"]}
                        onChange={emailChangeHandler}
                        value={email || ""}
                        width="100%"
                        placeholder={t("Email")}
                        maxLength={160}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p
                        className={
                          errorBar
                            ? ` ${styles["errorMessage-inLogin"]} `
                            : `${styles["errorMessage-inLogin_hidden"]}`
                        }
                      >
                        {errorMessage}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={12} lg={12} className="d-flex gap-2 align-items-center" >
                      <Checkbox
                        checked={rememberEmail}
                        classNameDiv=""
                        onChange={rememberChangeEmail}
                        className={styles["RememberEmail"]}
                      />
                      <span className=" MontserratMedium-500 color-5a5a5a align-items-center d-flex flex-row mr-2">

                        {t("Remeber-email")}
                      </span>
                    </Col>
                  </Row>
                  <Row className=" mt-5 mb-1 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center  "
                    >
                      <Button
                        text={t("Next")}
                        onClick={loginHandler}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["forogt_email_link"]}
                  >
                    <Link to="/">{t("Forgot-email")}</Link>
                  </Col>
                </Row>
                <Row className="">
                  <Col sm={12} md={12} lg={12}>
                    {" "}
                    <span className={styles["signup-text-inloginpage"]}>
                      {t("Havent-subscribed-yet")}
                    </span>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="w-100 d-flex justify-content-center"
                  >
                    <Button
                      text={t("Subscribe-now")}
                      onClick={goForSignUp}
                      className={styles["subscribNow_button_EmailVerify"]}
                    />
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
              <h1 className={styles["heading-1"]}>{t("Simplify-management")}</h1>
              <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
              <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
            </Col>
            <Col md={4} lg={4} sm={12} className="position-relative">
              <img
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default EmailValidation;
