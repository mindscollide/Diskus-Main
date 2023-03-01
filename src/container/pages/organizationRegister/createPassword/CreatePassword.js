import React, { useEffect, useState } from "react";
import styles from "./CreatePassword.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  Notification,
  Paper,
  Loader,
  TextField,
} from "../../../../components/elements";
import { Eye, EyeSlash, X, Check } from "react-bootstrap-icons";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import { Link, useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import {
  cleareMessage,
  createPasswordAction,
  updatePasswordAction,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../../assets/images/newElements/Language.svg";
const CreatePassword = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [errorBar, setErrorBar] = useState(false);
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [remeberPassword, setRememberPassword] = useState(false);
  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const { Authreducer } = useSelector((state) => state);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setConfirmShowPasswordIcon] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    Password: "",
    ConfirmPassword: "",
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };
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

  const [language, setLanguage] = useState(currentLocale);

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };
  let updateCheckPasswordFlag = localStorage.getItem("updatePasswordCheck");
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  console.log("currentLocale", currentLocale);

  let currentLanguage = localStorage.getItem("i18nextLng");
  const passwordChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPasswordDetails({
      ...passwordDetails,
      [name]: value,
    });
  };

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
        dispatch(createPasswordAction(passwordDetails.Password, navigate, t));
      }
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
    } else if (Authreducer.passwordUpdateOnForgotPasswordMessege !== "") {
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
              <option
                key={code}
                value={code}
                className={styles["language_options"]}
              >
                {name}
              </option>
            ))}
          </select>
          <img src={LanguageChangeIcon} className={styles["languageIcon"]} />
        </Col>
      </Row>
      <Container fluid>
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
                    <img src={DiskusLogo} width={220} alt="diskus_logo" />
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
                      className=" position-relative d-flex justify-content-center"
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="Password"
                        value={passwordDetails.Password || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("New-password")}
                        autoComplete="false"
                      />
                      <span
                        className={styles["passwordIcon"]}
                        onClick={showNewPassowrd}
                      >
                        {showNewPasswordIcon ? (
                          <img src={PasswordHideEyeIcon} />
                        ) : (
                          <img src={PasswordEyeIcon} />
                        )}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="position-relative d-flex  justify-content-center "
                    >
                      <Form.Control
                        className={styles["PasswordTextField"]}
                        type={showConfirmPasswordIcon ? "text" : "password"}
                        name="ConfirmPassword"
                        value={passwordDetails.ConfirmPassword || ""}
                        onChange={passwordChangeHandler}
                        placeholder={t("Re-enter-password")}
                      />
                      <span
                        className={styles["passwordIcon"]}
                        onClick={showConfirmPassowrd}
                      >
                        {showConfirmPasswordIcon ? (
                          <img src={PasswordHideEyeIcon} />
                        ) : (
                          <img src={PasswordEyeIcon} />
                        )}
                      </span>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                      <Checkbox
                        classNameDiv=""
                        checked={remeberPassword}
                        onChange={() => setRememberPassword(!remeberPassword)}
                      />
                      <span className="MontserratMedium-500 color-5a5a5a align-items-center d-flex  ">
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
                      <p className="MontserratSemiBold-600  m-0 color-5a5a5a">
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
                        text={
                          updateCheckPasswordFlag ? t("Confirm") : t("Sign-up")
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

export default CreatePassword;
