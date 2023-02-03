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
  const [isPasswordStrong, setPasswordStrong] = useState(false)
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
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      Create Password
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={verifyHandlePassword}>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="position-relative d-flex justify-content-center"
                    >
                      <TextField
                        applyClass="form-control2"
                        className="PasswordTextField"
                        type={showNewPasswordIcon ? "text" : "password"}
                        name="Password"
                        width="285px"
                        value={passwordDetails.Password || ""}
                        change={passwordChangeHandler}
                        placeholder="New Password"
                        inputIcon={showNewPasswordIcon ? <EyeSlash /> : <Eye />}
                        iconClassName="IconStyle"
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
                      className="position-relative d-flex justify-content-center "
                    >
                      <TextField
                        applyClass="form-control2"
                        className="PasswordTextField  f-0"
                        type={showConfirmPasswordIcon ? "text" : "password"}
                        name="ConfirmPassword"
                        value={passwordDetails.ConfirmPassword || ""}
                        change={passwordChangeHandler}
                        width="285px"
                        placeholder="Re-Enter Password"
                        inputIcon={
                          showConfirmPasswordIcon ? <EyeSlash /> : <Eye />
                        }
                        iconClassName="IconStyle"
                        labelClass="lightLabel"
                        autoComplete="false"
                        clickIcon={showConfirmPassowrd}
                      />
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col className='my-2'>
                      <PasswordChecklist rules={["match"]} value={passwordDetails.Password} valueAgain={passwordDetails.ConfirmPassword} />
                    </Col>
                  </Row> */}
                  <Row>
                    <Col sm={12} md={12} lg={12} className="mt-2 ">
                      <span className="d-flex flex-row mr-2">
                        <Checkbox classNameDiv="mx-1" />
                        Remember Password
                      </span>
                    </Col>
                  </Row>
                  <Row className="my-4">
                    <Col sm={12} md={12} lg={12}>
                      <p className="fw-normal m-0">Password must be</p>
                      <PasswordChecklist
                        rules={["minLength", "specialChar", "letter", "match"]}
                        minLength={8}
                        className={styles["passwordTextHandler"]}
                        value={passwordDetails.Password}
                        valueAgain={passwordDetails.ConfirmPassword}
                        onChange={(isValid) => { setPasswordStrong(isValid) }}
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
                        text="Sign Up"
                        disableBtn={passwordDetails.Password === "" ? true : passwordDetails.ConfirmPassword === "" ? true : !isPasswordStrong ? true : false}
                        className={styles["subscribNow_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-2">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-start"
                  >
                    {" "}
                    <Link className={styles["GoBackBtn"]} to="/">
                      Go Back
                    </Link>
                    {/* <p className="text-left text-decoration-underline">
                      Go Back
                    </p> */}
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
              <h1 className={styles["heading-1"]}>Simplify Management.</h1>
              <h1 className={styles["heading-2"]}>Collaborate.</h1>
              <h1 className={styles["heading-1"]}>Prioritize.</h1>
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
