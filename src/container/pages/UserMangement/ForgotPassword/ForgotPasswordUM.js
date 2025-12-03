import React, { useEffect, useState } from "react";
import styles from "./ForgotPasswordUM.module.css";
import { Col, Container, Form, Row } from "react-bootstrap";
import DiskusLogo from "./../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "./../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";
import DiskusAuthPageLogo from "./../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import LanguageSelector from "./../../../../components/elements/languageSelector/Language-selector";
import { Button, Notification } from "./../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  changePasswordRequest,
  cleareChangePasswordMessage,
} from "../../../../store/actions/Auth_Forgot_Password";
import { validateEmail } from "../../../../commen/functions/validations";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoginFlowRoutes } from "../../../../store/actions/UserManagementActions";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const ForgotPasswordUM = () => {
  const navigate = useNavigate();
  const ResponseMessageAuthResetPassword = useSelector(
    (state) => state.auth.ResponseMessage
  );
  const { t } = useTranslation();

 

  //States for Forgot Password Screen
  const [email, setEmail] = useState("");
  const [messege, setMessege] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  //Form Submission of Forgot Password
  const submitForm = async (e) => {
    e.preventDefault();
    if (email !== "") {
      if (validateEmail(email)) {
        setMessege("");
        await dispatch(changePasswordRequest(email, t, navigate));
      } else {
        setMessege(t("Please-enter-a-valid-email"));
      }
    } else {
      showMessage(t("Please-enter-email"), "error", setOpen);
      setMessege("");
    }
  };

  //handle Go Back Function

  const handleGoBackFunction = () => {
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };

  //onChange for the Field
  const handleChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    if (value !== "" && name === "forgotEmail") {
      setEmail(value);
    } else {
      setEmail("");
    }
  };

  useEffect(() => {
    if (
      ResponseMessageAuthResetPassword !== "" &&
      ResponseMessageAuthResetPassword !== null &&
      ResponseMessageAuthResetPassword !== undefined
    ) {
      showMessage(ResponseMessageAuthResetPassword, "error", setOpen);

      setTimeout(() => {
        dispatch(cleareChangePasswordMessage());
      }, 4000);
    }
  }, [ResponseMessageAuthResetPassword]);

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
            className='d-flex justify-content-center align-items-center min-vh-100'>
            <span className={styles["Forgotpasswordloginbox_auth_paper"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["ForgotPassword_EmailVerifyBox"]}>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='d-flex justify-content-center'>
                    <img
                      draggable='false'
                      src={
                        localStorage.getItem("i18nextLng") === "ar"
                          ? DiskusLogoArabic
                          : DiskusLogo
                      }
                      width={220}
                      alt='diskus_logo'
                    />
                  </Col>
                </Row>
                <Row className='text-center mt-5'>
                  <Col sm={12} md={12} lg={12} className='m-0 p-0'>
                    <span className={styles["ForgotPassword_heading1"]}>
                      {t("Forgot")}
                    </span>
                  </Col>
                  <Col sm={12} md={12} lg={12} className='m-0 p-0'>
                    <span className={styles["ForgotPassword_heading1"]}>
                      {t("Password")}?
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={submitForm}>
                  <Row className='mt-5'>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className={styles["forgotpassword_label"]}>
                      {/*Email */}
                      {t("Email-address")}
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='d-flex justify-content-center flex-column  '>
                      <Form.Control
                        required
                        type='email'
                        className={styles["Forgot_Password_Email_Field"]}
                        onChange={handleChange}
                        value={email}
                        name='forgotEmail'
                        width='100%'
                        placeholder={t("Email")}
                        maxLength={160}
                      />
                      <p className={styles["ErrorMessege"]}>{messege}</p>
                    </Col>
                  </Row>

                  <Row className='mt-4'>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className='d-flex justify-content-center  '>
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
                <Row className='mt-3'>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["Forgot_passwordforogt_email_link"]}>
                    <Link onClick={handleGoBackFunction}>{t("Go-back")}</Link>
                  </Col>
                </Row>
              </Col>
            </span>
          </Col>
          <Col
            lg={8}
            md={8}
            sm={8}
            className='position-relative d-flex overflow-hidden'>
            <Col md={8} lg={8} sm={12} className={styles["Login_page_text"]}>
              <h1 className={styles["heading-1"]}>
                {t("Simplify-management")}
              </h1>
              <h1 className={styles["heading-2"]}>{t("Collaborate")}</h1>
              <h1 className={styles["heading-1"]}>{t("Prioritize")}</h1>
            </Col>
            <Col md={4} lg={4} sm={12} className='position-relative'>
              <img
                draggable='false'
                src={DiskusAuthPageLogo}
                alt='auth_icon'
                width='600px'
                className={styles["Forgot_Password_Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ForgotPasswordUM;
