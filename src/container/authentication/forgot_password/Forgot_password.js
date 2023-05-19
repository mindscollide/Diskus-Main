import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
} from "./../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "./../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./ForgotPassword.module.css";
import DiskusAuthPageLogo from "./../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../assets/images/newElements/Language.svg";
import { validateEmail } from "../../../commen/functions/validations";
import {
  changePasswordRequest,
  cleareChangePasswordMessage,
} from "../../../store/actions/Auth_Forgot_Password";
import { useDispatch, useSelector } from "react-redux";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [messege, setMessege] = useState("");
  const dispatch = useDispatch();
  const languages = [
    { name: "English", code: "en" },
    { name: "Français", code: "fr" },
    { name: "العربية", code: "ar", dir: "rtl" },
  ];
  const currentLocale = Cookies.get("i18next") || "en";
  const [language, setLanguage] = useState(currentLocale);
  const currentLangObj = languages.find((lang) => lang.code === currentLocale);
  const state = useSelector((state) => state);
  const { auth } = state;
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const submitForm = async (e) => {
    e.preventDefault()
    if (email !== "") {
      if (validateEmail(email)) {
        setMessege("");
        await dispatch(changePasswordRequest(email, t, navigate));
      } else {
        setMessege(t("Please-enter-a-valid-email"));
      }
    } else {
      setOpen({
        ...open,
        open: true,
        message: t("Please-enter-email"),
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);
      setMessege("");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    if (value != "" && name === "forgotEmail") {
      setEmail(value);
    } else {
      setEmail("");
    }
  };

  const handleChangeLocale = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  useEffect(() => {
    if (auth.ResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareChangePasswordMessage());
    } else {
      dispatch(cleareChangePasswordMessage());

    }
  }, [auth.ResponseMessage]);
  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row>
          <Col className={styles["languageselect-box"]}>
            <select
              className={styles["Forgot_Password_select-language-signin"]}
              onChange={handleChangeLocale}
              value={language}
            >
              {languages.map(({ name, code }) => (
                <option
                  key={code}
                  value={code}
                  className={styles["Forgot_password_language_options"]}
                >
                  {name}
                </option>
              ))}
            </select>
            <img
              src={LanguageChangeIcon}
              className={styles["Forgot_password_languageIcon"]}
            />
          </Col>
        </Row>
        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper className={styles["Forgotpasswordloginbox_auth_paper"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["ForgotPassword_EmailVerifyBox"]}
              >
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
                <Row className="text-center mt-5">
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <span className={styles["ForgotPassword_heading1"]}>
                      {t("Forgot")}
                    </span>
                  </Col>
                  <Col sm={12} md={12} lg={12} className="m-0 p-0">
                    <span className={styles["ForgotPassword_heading1"]}>
                      {t("Password?")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={submitForm}>
                  <Row className="mt-5">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className={styles["forgotpassword_label"]}
                    >
                      {/*Email */}
                      {t("Email-address")}
                    </Col>
                  </Row>
                  <Row >
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center flex-column  "
                    >
                      <Form.Control
                        required
                        type="email"
                        className={styles["Forgot_Password_Email_Field"]}
                        onChange={handleChange}
                        value={email}
                        name="forgotEmail"
                        width="100%"
                        placeholder={t("Email")}
                        maxLength={160}
                        // autoComplete={"off"}
                        // autoComplete="on"

                      />
                      <p className={styles["ErrorMessege"]}>{messege}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <p
                      // className={
                      //   errorBar
                      //     ? ` ${styles["errorMessage-inLogin"]} `
                      //     : `${styles["errorMessage-inLogin_hidden"]}`
                      // }
                      >
                        {/* {errorMessage} */}
                      </p>
                    </Col>
                  </Row>

                  <Row className=" d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center  "
                    >
                      <Button
                        text={t("Next")}
                        onClick={submitForm}
                        className={
                          styles["Forgot_PasswordNext_button_EmailVerify"]
                        }
                      />
                    </Col>
                  </Row>
                </Form>
                <Row >
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["Forgot_passwordforogt_email_link"]}
                  >
                    <Link to="/">{t("Back-to-sign-in")}</Link>
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
                className={styles["Forgot_Password_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      {auth.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ForgotPassword;
