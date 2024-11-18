import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  TextField,
  Checkbox,
  Notification,
  Loader,
  VerificationInputField,
} from "./../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import DiskusLogo from "./../../../assets/images/newElements/Diskus_newLogo.svg";
import { cleareMessage } from "../../../store/actions/Auth2_actions";
import styles from "./UpdatePasswordSuccessfully.module.css";
import DiskusAuthPageLogo from "./../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import LanguageChangeIcon from "../../../assets/images/newElements/Language.svg";
import { useDispatch, useSelector } from "react-redux";
import LanguageSelector from "../../../components/elements/languageSelector/Language-selector";

const UpdatePasswordSuccessfully = () => {
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const languages = [
  //   { name: "English", code: "en" },
  //   { name: "Français", code: "fr" },
  //   { name: "العربية", code: "ar", dir: "rtl" },
  // ];
  // const currentLocale = Cookies.get("i18next") || "en";
  // const [language, setLanguage] = useSta/te(currentLocale);
  // const currentLangObj = languages.find((lang) => lang.code === currentLocale);
  // const handleChangeLocale = (e) => {
  //   const lang = e.target.value;
  //   setLanguage(lang);
  //   localStorage.setItem("i18nextLng", lang);
  //   i18n.changeLanguage(lang);
  // };

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const handlechange = (e) => {
    e.preventDefault();
    navigate("/");
  };

  // useEffect(() => {
  //   document.body.dir = currentLangObj.dir || "ltr";
  // }, [currentLangObj, t]);

  useEffect(() => {
    if (
      Authreducer.passwordUpdateOnForgotPasswordMessege !== "" &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !==
        t("Password-updated-successfully")
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
    }
  }, [Authreducer.passwordUpdateOnForgotPasswordMessege]);

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        <Row>
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
            <Paper className={styles["Update_password_loginbox_auth_paper"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["ForgotPassword_Verification_EmailVerifyBox"]}
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center"
                  >
                    <img draggable="false" src={DiskusLogo} width={220} alt="diskus_logo" />
                  </Col>
                </Row>
                <Form>
                  <Row className="mt-5">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center"
                    >
                      <span className={styles["Update_Password_Heading"]}>
                        {t("Your-password")}
                      </span>
                    </Col>
                  </Row>
                  <Row className={styles["update_password_second_heading"]}>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center"
                    >
                      <span className={styles["Update_Password_Heading"]}>
                        {t("Has-been-updated")}
                      </span>
                    </Col>
                  </Row>

                  {/* for button */}
                  <Row className="mt-5 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center mt-1 "
                    >
                      <Button
                        text={t("Back-to-sign-in")}
                        className={
                          styles[
                            "Update_Password_successfull_Next_button_EmailVerify"
                          ]
                        }
                        onClick={handlechange}
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
              <img draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Update_password_successfully_Auth_Icon"]}
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

export default UpdatePasswordSuccessfully;
