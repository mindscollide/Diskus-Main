import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  Notification,
  Paper,
  TextField,
  Loader,
} from "../../../../../components/elements";
import styles from "./EnterPassword.module.css";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { EyeSlash, Eye } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import PasswordEyeIcon from "../../../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../../../assets/images/newElements/password_hide.svg";
import {
  cleareMessage,
  enterPasswordvalidation,
} from "../../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import LanguageChangeIcon from '../../../../../assets/images/newElements/Language.svg'

const EnterPassword = () => {
  const { t, i18n } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [remeberPassword, SetRememberPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const showNewPassowrd = () => {
    console.log(showNewPasswordIcon, "showNewPassowrd");
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  // translate Languages start
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

  // translate Languages end

  const passwordChangeHandler = (e) => {
    console.log(e)
    setErrorBar(false);
    let value = e.target.value;
    var valueCheck = value.replace(/\s+/g, "");
    if (valueCheck === "") {
      setPassword("");
      setErrorBar(true);
    } else if (valueCheck !== "") {
      setPassword(value);
      setErrorBar(false);
    } else if (value === "") {
      setErrorBar(false);
    }
  };
  const loginHandler = (e) => {
    e.preventDefault();
    if (password === "") {
      setOpen({
        ...open,
        open: true,
        message: "Enter Password",
      });
    } else {
      setErrorBar(false);
      dispatch(enterPasswordvalidation(password, navigate, t));
      // navigate("/packageselection");
    }
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
    }
    //  else if (Authreducer.EmailValidationResponseMessage !== "") {
    //   setOpen({
    //     ...open,
    //     open: true,
    //     message: Authreducer.EmailValidationResponseMessage,
    //   });
    //   setTimeout(() => {
    //     setOpen({
    //       ...open,
    //       open: false,
    //       message: "",
    //     });
    //   }, 3000);

    //   dispatch(cleareMessage());
    // }
    else {
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
            <Paper className={styles["loginbox_auth"]}>
              <Col sm={12} lg={12} md={12} className={styles["EmailVerifyBox"]}>
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
                <Row className="text-center mt-3 mb-4">
                  <Col>
                    <span className={styles["signIn_heading"]}>{t("Sign-in")}</span>
                  </Col>
                </Row>
                <Form onSubmit={loginHandler}>
                  <Row >
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="position-relative d-flex justify-content-cente"
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="Password"
                        value={password || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("Password")}
                        inputIcon={
                          showNewPasswordIcon ? (
                            <img src={PasswordHideEyeIcon} />
                          ) : (
                            <img src={PasswordEyeIcon} />
                          )
                        }
                        iconClassName={styles["IconStyle"]}
                        labelClass="lightLabel"
                        autoComplete="false"
                        maxLength={200}
                      // clickIcon={showNewPassowrd}
                      />
                      <span className={styles["passwordIcon"]} onClick={showNewPassowrd}>
                        {showNewPasswordIcon ? <img src={PasswordHideEyeIcon} /> : <img src={PasswordEyeIcon} />}

                      </span>
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
                    <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                      <Checkbox
                        classNameDiv=""
                        checked={remeberPassword}
                        onChange={() => SetRememberPassword(!remeberPassword)}
                      />
                      <span className="MontserratMedium-500 color-5a5a5a align-items-center d-flex flex-row mr-2">
                        {t("Remember-password")}
                      </span>
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
                        text="Sign In"
                        onClick={loginHandler}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row >
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["forogt_email_link"]}
                  >
                    <Link to="/forgotpasssowrd" className={styles["ForgotPassword"]}>
                      {t("Forgot-password")}
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className="position-relative d-flex  overflow-hidden"
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

export default EnterPassword;
