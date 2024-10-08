import React, { useEffect, useRef, useState } from "react";
import styles from "./PasswordVerification.module.css";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import { Col, Container, Form, Row } from "react-bootstrap";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import {
  Button,
  Checkbox,
  Paper,
  Notification,
  Loader,
} from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import {
  cleareMessage,
  enterPasswordvalidation,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { LoginFlowRoutes } from "../../../../store/actions/UserManagementActions";

const PasswordVerification = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const passwordRef = useRef();

  const { Authreducer, LanguageReducer } = useSelector((state) => state);

  //States for Password Verification Screen
  const [password, setPassword] = useState("");
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [remeberPassword, SetRememberPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  //Eye Icon Condition
  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  //Clear Messege UseEffect
  useEffect(() => {
    return () => {
      dispatch(cleareMessage());
    };
  }, []);

  //PasswordEncryption
  const encryptPassword = (password) => {
    let encryptedPassword = "";
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      encryptedPassword += String.fromCharCode(charCode + 1);
    }
    return encryptedPassword;
  };

  //PasswordDecryption
  const decryptPassword = (encryptedPassword) => {
    let password = "";
    for (let i = 0; i < encryptedPassword.length; i++) {
      const charCode = encryptedPassword.charCodeAt(i);
      password += String.fromCharCode(charCode - 1);
    }
    return password;
  };

  //onChange Password Text Field
  const passwordChangeHandler = (e) => {
    setErrorBar(false);
    let value = e.target.value;
    var valueCheck = value.replace(/\s+/g, "");
    if (valueCheck === "") {
      setPassword("");
      setErrorBar(true);
    } else if (valueCheck !== "") {
      if (remeberPassword === true) {
        setPassword(value);
        let newPassword = encryptPassword(value);
        localStorage.setItem("rememberPasswordValue", newPassword);
      } else {
        setPassword(value);
        setErrorBar(false);
      }
    } else if (value === "") {
      setErrorBar(false);
    }
  };

  //Remeber Password
  const rememberPasswordCheck = () => {
    SetRememberPassword(!remeberPassword);
    if (!remeberPassword === true) {
      localStorage.setItem("remeberPassword", true);
      let newPassword = encryptPassword(password);
      localStorage.setItem("rememberPasswordValue", newPassword);
    } else {
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
  };

  //Logging in Functionnality Validating password
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
    }
  };

  //Messeges UseEffect
  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage != "" &&
      Authreducer.VerifyOTPEmailResponseMessage != undefined
    ) {
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
    } else if (
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.OrganizationCreateResponseMessage != t("2fa-enabled") &&
      Authreducer.OrganizationCreateResponseMessage != undefined
    ) {
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
    } else if (
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.CreatePasswordResponseMessage != t("2fa-enabled") &&
      Authreducer.CreatePasswordResponseMessage != undefined &&
      Authreducer.CreatePasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
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
    } else if (
      Authreducer.GetSelectedPackageResponseMessage !== "" &&
      Authreducer.GetSelectedPackageResponseMessage != t("2fa-enabled") &&
      Authreducer.GetSelectedPackageResponseMessage != undefined
    ) {
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
    } else {
      dispatch(cleareMessage());
    }
  }, [
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);

  //Handle Goback functionality

  const handelForgotPassword = () => {
    dispatch(LoginFlowRoutes(10));
  };

  //Password Remeber
  useEffect(() => {
    let RememberPasswordLocal = JSON.parse(
      localStorage.getItem("remeberPassword")
    );
    if (RememberPasswordLocal === true) {
      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );
      SetRememberPassword(RememberPasswordLocal);
      let newPasswordDecript = decryptPassword(RememberPasswordLocalValue);
      setPassword(newPasswordDecript);
    } else {
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
    passwordRef.current.focus();
  }, []);

  // Handling GoBack Functionality
  const handleGoback = () => {
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row className="position-relative">
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
            <Paper className={styles["loginbox_auth"]}>
              <Col sm={12} lg={12} md={12} className={styles["EmailVerifyBox"]}>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <img draggable="false" src={DiskusLogo} alt="diskus_logo" />
                  </Col>
                </Row>
                <Row className="text-center mt-3 mb-4">
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      {t("Sign-in")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={loginHandler}>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="Enter-password-field position-relative d-flex justify-content-cente"
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="MyUniquePasswordField"
                        ref={passwordRef}
                        value={password || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("Password")}
                        iconclassname={styles["IconStyle"]}
                        labelclass="lightLabel"
                        autoComplete="off"
                        maxLength={200}
                      />
                      <span
                        className={styles["passwordIcon"]}
                        onClick={showNewPassowrd}
                      >
                        {showNewPasswordIcon ? (
                          <img
                            draggable="false"
                            alt=""
                            src={PasswordHideEyeIcon}
                          />
                        ) : (
                          <img draggable="false" alt="" src={PasswordEyeIcon} />
                        )}
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
                        onChange={rememberPasswordCheck}
                      />
                      <span className={styles["Remember-password"]}>
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
                        text={t("Sign-in")}
                        onClick={loginHandler}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-1">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["forogt_email_link"]}
                  >
                    <Link
                      onClick={handelForgotPassword}
                      className={styles["ForgotPassword"]}
                    >
                      {t("Forgot-password")}
                    </Link>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["forogt_email_link"]}
                  >
                    <Link
                      onClick={handleGoback}
                      className={styles["ForgotPassword"]}
                    >
                      {t("Go-back")}
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
                className={styles["Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default PasswordVerification;
