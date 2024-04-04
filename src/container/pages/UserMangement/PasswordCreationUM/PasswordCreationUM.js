import React, { useEffect, useRef, useState } from "react";
import styles from "./PasswordCreationUM.module.css";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Col, Container, Form, Row } from "react-bootstrap";
import {
  Button,
  Paper,
  Notification,
  Loader,
} from "../../../../components/elements";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import { useSelector } from "react-redux";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordChecklist from "react-password-checklist";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { showCreateAddtionalUsersModal } from "../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import CreateAddtionalUsersModal from "../ModalsUserManagement/CreateAdditionalusersModal/CreateAddtionalUsersModal";
import Cookies from "js-cookie";
import {
  cleareMessage,
  createPasswordAction,
  updatePasswordAction,
} from "../../../../store/actions/Auth2_actions";
import { LoginFlowRoutes } from "../../../../store/actions/UserManagementActions";

const PasswordCreationUM = ({ isFreetrail }) => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const passwordRef = useRef();

  const { UserManagementModals } = useSelector((state) => state);

  const [errorBar, setErrorBar] = useState(false);
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [remeberPassword, SetRememberPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setConfirmShowPasswordIcon] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    Password: "",
    ConfirmPassword: "",
  });
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  //Showing Password
  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  //Hiding Password
  const showConfirmPassowrd = () => {
    setConfirmShowPasswordIcon(!showConfirmPasswordIcon);
  };

  // Languages
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];

  const currentLocale = Cookies.get("i18next") || "en";

  let updateCheckPasswordFlag = localStorage.getItem("updatePasswordCheck");
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  //Encryption Password
  const encryptPassword = (password) => {
    let encryptedPassword = "";
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      encryptedPassword += String.fromCharCode(charCode + 1);
    }
    return encryptedPassword;
  };

  //Decryption Password
  const decryptPassword = (encryptedPassword) => {
    let password = "";
    for (let i = 0; i < encryptedPassword.length; i++) {
      const charCode = encryptedPassword.charCodeAt(i);
      password += String.fromCharCode(charCode - 1);
    }
    return password;
  };

  //OnChange Password handler
  const passwordChangeHandler = (e) => {
    setErrorBar(false);
    let value = e.target.value;
    let name = e.target.name;
    var valueCheck = value.replace(/\s+/g, "");
    if (valueCheck === "") {
      console.log("packageDetailpackageDetailpackageDetailpackageDetail");
      setPassword("");
      setPasswordDetails({
        ...passwordDetails,
        [name]: "",
      });
      setErrorBar(true);
    } else if (valueCheck !== "") {
      console.log("packageDetailpackageDetailpackageDetailpackageDetail");

      if (remeberPassword === true) {
        setPasswordDetails({
          ...passwordDetails,
          [name]: value,
        });
        // setPassword(value);
        let newPassword = encryptPassword(value);
        localStorage.setItem("rememberPasswordValue", newPassword);
      } else {
        setPasswordDetails({
          ...passwordDetails,
          [name]: value,
        });
        // setPassword(value);
        setErrorBar(false);
      }
    } else if (value === "") {
      console.log("packageDetailpackageDetailpackageDetailpackageDetail");

      setErrorBar(false);
    }
  };

  //Handler Password Verification
  const verifyHandlePassword = (e) => {
    e.preventDefault();
    if (
      passwordDetails.Password === "" &&
      passwordDetails.ConfirmPassword === "" &&
      passwordDetails.Password.length >= 8 &&
      passwordDetails.ConfirmPassword.length >= 8
    ) {
      setErrorBar(false);
      setOpen({
        ...open,
        open: true,
        message: "Please Enter Fields Value",
      });
    } else if (passwordDetails.Password !== passwordDetails.ConfirmPassword) {
      setErrorBar(true);
    } else {
      setErrorBar(false);
      // navigate("/")

      if (
        updateCheckPasswordFlag !== undefined &&
        updateCheckPasswordFlag !== null &&
        (updateCheckPasswordFlag === true || updateCheckPasswordFlag === "true")
      ) {
        dispatch(updatePasswordAction(passwordDetails.Password, navigate, t));
      } else {
        dispatch(
          createPasswordAction(
            passwordDetails.Password,
            navigate,
            t
            // currentStage
          )
        );
      }
    }
  };

  //RemeberPassword Checker
  const rememberPasswordCheck = () => {
    SetRememberPassword(!remeberPassword);
    if (!remeberPassword === true) {
      localStorage.setItem("remeberPassword", true);
      let newPassword = encryptPassword(passwordDetails.password);
      localStorage.setItem("rememberPasswordValue", newPassword);
    } else {
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
  };

  //Response Messeges
  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== undefined &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-verification") &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-enabled")
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
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-enabled")
    ) {
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
    } else if (
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.OrganizationCreateResponseMessage !== undefined &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-verification") &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-enabled")
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
      Authreducer.CreatePasswordResponseMessage !== undefined &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-enabled")
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
      Authreducer.GetSelectedPackageResponseMessage !== undefined &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-verification") &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-enabled")
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
    } else if (
      Authreducer.EmailValidationResponseMessage !== "" &&
      Authreducer.EmailValidationResponseMessage !== undefined &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-verification") &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-enabled")
    ) {
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
    } else if (
      Authreducer.passwordUpdateOnForgotPasswordMessege !== "" &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !== undefined &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !==
        t("2fa-verification") &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !== t("2fa-enabled")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.passwordUpdateOnForgotPasswordMessege,
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
    Authreducer.passwordUpdateOnForgotPasswordMessege,
  ]);

  //Remember Password
  useEffect(() => {
    let RememberPasswordLocal = JSON.parse(
      localStorage.getItem("remeberPassword")
    );
    console.log("createpasswordorganization", RememberPasswordLocal);
    console.log("createpasswordorganization", RememberPasswordLocal === true);
    if (RememberPasswordLocal === true) {
      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );
      console.log("createpasswordorganization", RememberPasswordLocalValue);

      SetRememberPassword(RememberPasswordLocal);
      let newPasswordDecript = decryptPassword(RememberPasswordLocalValue);
      setPasswordDetails({
        ...passwordDetails,
        // ["ConfirmPassword "]: newPasswordDecript,
        ["Password"]: newPasswordDecript,
      });
      // setPassword(newPasswordDecript);
    } else {
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
    passwordRef.current.focus();
  }, []);

  const handleSignupButton = () => {
    if (isFreetrail) {
      dispatch(showCreateAddtionalUsersModal(true));
    } else {
      // dispatch(createPasswordAction(passwordDetails.Password, navigate, t));
    }
  };

  const goBackButton = () => {
    localStorage.removeItem("signupCurrentPage");
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
    navigate("/");
  };

  return (
    <>
      <Container fluid>
        <Row className="position-relative">
          <Col className="languageSelector">
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center mx-auto min-vh-100"
          >
            <Paper className={styles["createpassword_auth_paper"]}>
              <Col sm={12} lg={12} md={12} className={styles["EmailVerifyBox"]}>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <img
                      draggable="false"
                      src={DiskusLogo}
                      width={220}
                      alt="diskus_logo"
                    />
                  </Col>
                </Row>
                <Row className="mt-4 mb-3">
                  <Col className="">
                    <span className={styles["signIn_heading"]}>
                      {t("Create-password")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={verifyHandlePassword}>
                  <Row className="mb-3">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="create-field-password position-relative d-flex justify-content-center"
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="Password"
                        ref={passwordRef}
                        value={passwordDetails.Password || ""}
                        // value={password || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("New-password")}
                        autoComplete="false"
                        iconClassName={styles["IconStyle"]}
                      />
                      <span
                        className={styles["passwordIcon"]}
                        onClick={showNewPassowrd}
                      >
                        {showNewPasswordIcon ? (
                          <img
                            draggable="false"
                            src={PasswordHideEyeIcon}
                            alt=""
                          />
                        ) : (
                          <img draggable="false" src={PasswordEyeIcon} alt="" />
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="create-field-password position-relative d-flex  justify-content-center "
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showConfirmPasswordIcon ? "text" : "password"}
                        name="ConfirmPassword"
                        value={passwordDetails.ConfirmPassword || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("Re-enter-password")}
                        iconClassName={styles["IconStyle"]}
                      />
                      <span
                        className={styles["passwordIcon"]}
                        onClick={showConfirmPassowrd}
                      >
                        {showConfirmPasswordIcon ? (
                          <img
                            draggable="false"
                            src={PasswordHideEyeIcon}
                            alt=""
                          />
                        ) : (
                          <img draggable="false" src={PasswordEyeIcon} alt="" />
                        )}
                      </span>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                      <Checkbox
                        classNameDiv=""
                        checked={remeberPassword}
                        onChange={rememberPasswordCheck}
                      />
                      <span
                        className={styles["Create_password_remember_check"]}
                      >
                        {t("Remember-password")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["PasswordCheckListstyle"]}
                    >
                      <p className={styles["paragraph_password_must_have"]}>
                        {t("Password-must-have")}
                      </p>
                      <PasswordChecklist
                        rules={["minLength", "specialChar", "letter", "match"]}
                        minLength={8}
                        className={styles["passwordTextHandler"]}
                        value={passwordDetails.Password}
                        valueAgain={passwordDetails.ConfirmPassword}
                        onChange={(isValid) => {
                          setPasswordStrong(isValid);
                        }}
                        // invalidColor="#ff0000"
                        // validColor="#6172D6"
                        iconSize={"14px"}
                        messages={{
                          minLength: t("Password-has-atleast-8-characters"),
                          specialChar: t("Password-has-special-characters"),
                          letter: t("Password-has-a-letter"),
                          match: t("Passwords-match"),
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center"
                    >
                      <Button
                        type="submit"
                        onClick={verifyHandlePassword}
                        text={
                          updateCheckPasswordFlag !== undefined &&
                          updateCheckPasswordFlag !== null &&
                          (updateCheckPasswordFlag === true ||
                            updateCheckPasswordFlag === "true")
                            ? t("Confirm")
                            : t("Sign-up")
                        }
                        disableBtn={
                          passwordDetails.Password === ""
                            ? true
                            : passwordDetails.ConfirmPassword === ""
                            ? true
                            : !isPasswordStrong
                            ? true
                            : false
                        }
                        className={styles["subscribNow_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["forogt_email_link"]}
                    >
                      <span
                        onClick={goBackButton}
                        className={styles["ForgotPassword"]}
                      >
                        {t("Go-back")}
                      </span>
                    </Col>
                  </Row>
                </Form>
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
      {UserManagementModals.createAdditionalModals && (
        <CreateAddtionalUsersModal />
      )}
    </>
  );
};

export default PasswordCreationUM;
