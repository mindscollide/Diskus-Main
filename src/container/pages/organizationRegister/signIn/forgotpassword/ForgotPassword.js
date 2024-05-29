import React, { useEffect, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Paper,
  Notification,
  TextField,
  Checkbox,
  Button,
} from "../../../../../components/elements";
import DiskusLogo from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import { useNavigate } from "react-router-dom";

import ErrorBar from "../../../../authentication/sign_up/errorbar/ErrorBar";
import { validationEmail } from "../../../../../commen/functions/validations";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import Cookies from "js-cookie";
const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("There was something wrong");
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

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

  // translate Languages end
  useEffect(() => {
    document.body.dir = currentLangObj.dir || "ltr";
  }, [currentLangObj, t]);

  const emailChangeHandler = (e) => {
    if (email.trim() > 0 && validationEmail(email)) {
      setErrorBar(true);
    } else {
      setErrorBar(false);
      setEmail(e.target.value);
    }
  };

  const verifyOTPHandler = (e) => {
    e.preventDefault();
    if (email === "") {
      setOpen({
        ...open,
        open: true,
        message: "Please Enter Email",
      });
    } else if (validationEmail(email) === false) {
      setErrorBar(true);
    } else {
      setOpen({
        ...open,
        open: false,
        message: "",
      });
      setErrorBar(false);
      // navigate("/verifyEmailOTP");
      navigate("/VerifyOTPUserManagement");
    }
  };
  const goForEnterOTP = () => {
    navigate("/validateemailorganization");
  };
  return (
    <>
      <Container>
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <Paper>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["forgotPassowrdBox"]}
              >
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
                <Row className="my-3 text-center">
                  <Col>
                    <span className={styles["forgotPassowrd_heading"]}>
                      {t("Forgot-your-password")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={verifyOTPHandler}>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center"
                    >
                      <TextField
                        applyClass="form-control2"
                        change={emailChangeHandler}
                        value={email || ""}
                        width="315px"
                        placeholder="E-mail"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={12} lg={12} className="mt-2">
                      <span className="d-flex flex-row mr-2">
                        <Checkbox classNameDiv="mx-1" />
                        Remember Email
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p
                        className={
                          errorBar
                            ? ` ${styles["errorMessage"]} `
                            : `${styles["errorMessage_hidden"]}`
                        }
                      >
                        {errorMessage}
                      </p>
                    </Col>
                  </Row>
                  <Row className="mt-4 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center "
                    >
                      <Button
                        text="Next"
                        onClick={verifyOTPHandler}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <a>Forgot Email</a>
                  </Col>
                </Row>

                <Row className="d-flex justify-content-center mt-4">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="w-100 d-flex justify-content-center"
                  >
                    <Button
                      text="Back to Sign In"
                      onClick={goForEnterOTP}
                      className={styles["subscribNow_button_EmailVerify"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Paper>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ForgotPassword;
