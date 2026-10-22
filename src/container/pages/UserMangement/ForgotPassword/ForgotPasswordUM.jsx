import React, { useEffect, useRef, useState } from "react";
import styles from "./ForgotPasswordUM.module.css";
import { Col, Form, Row } from "react-bootstrap";
import DiskusLogo from "./../../../../assets/images/newElements/Diskus_newLogo.svg";
import DiskusLogoArabic from "./../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png";
import PSOLogo from "./../../../../assets/images/Logos/PSO_Logo.png";
import { PSO_LOGO } from "./../../../../commen/featureFlags";
import AuthLayout from "../../../../components/layout/AuthLayout/AuthLayout";
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
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";
import { cleareMessage } from "../../../../store/actions/Auth2_actions";
import { message } from "antd";

const ForgotPasswordUM = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();



  //States for Forgot Password Screen
  const [email, setEmail] = useState("");
  const [messege, setMessege] = useState("");
  const dispatch = useDispatch();
  const [show, SnackBar] = useSnackbar();





  //Form submit
  const submitForm = async (e) => {
    e.preventDefault();

    if (!email) {
      show(t("Please-enter-email"), "error");
      setMessege("");
      return;
    }

    if (!validateEmail(email)) {
      setMessege(t("Please-enter-a-valid-email"));
      return;
    }

    setMessege("");
    await dispatch(changePasswordRequest(email, t, navigate));
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

  return (
    <>
      <AuthLayout>
        <Col
          lg={4}
          md={4}
          sm={12}
          className="d-flex justify-content-center align-items-center min-vh-100"
        >
          <span className={styles["Forgotpasswordloginbox_auth_paper"]}>
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
                  <img
                    draggable="false"
                    src={
                      PSO_LOGO ? PSOLogo : localStorage.getItem("i18nextLng") === "ar"
                        ? DiskusLogoArabic
                        : DiskusLogo
                    }
                    width={PSO_LOGO ? 120: 200}
                    alt="diskus_logo"
                  />
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
                    {t("Password")}?
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
                <Row>
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
                    />
                    <p className={styles["ErrorMessege"]}>{messege}</p>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center  "
                  >
                    <Button
                      text={t("Next")}
                      type="submit"
                      className={
                        styles["Forgot_PasswordNext_button_EmailVerify"]
                      }
                    />
                  </Col>
                </Row>
              </Form>
              <Row className="mt-3">
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["Forgot_passwordforogt_email_link"]}
                >
                  <Link onClick={handleGoBackFunction}>{t("Go-back")}</Link>
                </Col>
              </Row>
            </Col>
          </span>
        </Col>
      </AuthLayout>
      {SnackBar}
    </>
  );
};

export default ForgotPasswordUM;
