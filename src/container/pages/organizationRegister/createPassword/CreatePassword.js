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
} from "../../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CreatePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [errorBar, setErrorBar] = useState(false);
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [remeberPassowrd, setRememberPassword] = useState(false);
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
      dispatch(createPasswordAction(passwordDetails.Password, navigate, t));
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
      <Container fluid>
        <Row>
          <Col
            lg={4}
            md={4}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
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
                    <img src={DiskusLogo} alt="diskus_logo" />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col className="p-0">
                    <span className={styles["signIn_heading"]}>
                      {t("Create-password")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={verifyHandlePassword}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=" p-0 position-relative d-flex justify-content-center"
                    >
                      <TextField
                        applyClass="form-control2"
                        className="PasswordTextField"
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="Password"
                        width="310px"
                        value={passwordDetails.Password || ""}
                        change={passwordChangeHandler}
                        placeholder="New Password"
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
                        clickIcon={showNewPassowrd}
                      // onKeyUp={passwordValidation}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="position-relative d-flex p-0 justify-content-center "
                    >
                      <TextField
                        applyClass="form-control2"
                        className="PasswordTextField  f-0"
                        type={showConfirmPasswordIcon ? "text" : "password"}
                        name="ConfirmPassword"
                        value={passwordDetails.ConfirmPassword || ""}
                        change={passwordChangeHandler}
                        width="310px"
                        placeholder="Re-Enter Password"
                        inputIcon={
                          showConfirmPasswordIcon ? (
                            <img src={PasswordHideEyeIcon} className="me-2" />
                          ) : (
                            <img src={PasswordEyeIcon} className="me-3" />
                          )
                        }
                        iconClassName={styles["IconStyle"]}
                        labelClass="lightLabel"
                        autoComplete="false"
                        clickIcon={showConfirmPassowrd}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12} lg={12} className="mt-2  p-0">
                      <span className="RememberEmail MontserratMedium-500 color-5a5a5a align-items-center d-flex flex-row mr-2">

                        ({t("Max-25-char")})
                      </span>
                    </Col>
                  </Row>
                  <Row className="my-4">
                    <Col sm={12} md={12} lg={12} className={styles["PasswordCheckListstyle"]}>
                      <p className="MontserratSemiBold-600 color-5a5a5a m-0">
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
                        invalidColor="#ff0000"
                        validColor="#5F78D6"
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
                      className="d-flex justify-content-center p-0"
                    >
                      <Button
                        type="submit"
                        text="Sign Up"
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

export default CreatePassword;
