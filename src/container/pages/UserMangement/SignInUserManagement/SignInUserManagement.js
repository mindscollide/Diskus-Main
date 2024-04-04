import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Paper,
  Checkbox,
  Notification,
  Loader,
} from "../../../../components/elements";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./SignInUserMangement.module.css";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import SignUpOrganizationUM from "../../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import { useNavigate } from "react-router-dom";
// import SignupProcessUserManagement from "../../SignUpProcessUserManagement/SignupProcessUserManagement";
import { validationEmail } from "../../../../commen/functions/validations";
import {
  cleareMessage,
  validationEmailAction,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signupCurrentPageStep } from "../../SignUpProcessUserManagement/SignupProcessUserManagement";
import { signUpFlowRoutes } from "../../../../store/actions/UserManagementActions";

const SignInUserManagement = ({ setCurrentStep, setSignupStep }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const emailRef = useRef();

  const { Authreducer, adminReducer, LanguageReducer } = useSelector(
    (state) => state
  );

  //States For Email Validation Integration
  const [email, setEmail] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberEmail, setRemeberEmail] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  //OnChange For Email
  const emailChangeHandler = (e) => {
    let value = e.target.value;
    let nValue = value.trim();
    if (nValue === "" && validationEmail(value)) {
      setErrorBar(true);
    } else {
      setErrorBar(false);
      let RememberEmailLocal = JSON.parse(
        localStorage.getItem("rememberEmail")
      );
      if (RememberEmailLocal === true) {
        setEmail(nValue);
        localStorage.setItem("rememberEmailValue", nValue);
      } else {
        setEmail(nValue);
      }
    }
  };

  //Form Submission Handler
  const loginHandler = (e) => {
    e.preventDefault();
    if (email === "") {
      setOpen({
        ...open,
        open: true,
        message: t("Please-enter-email"),
      });
    } else if (validationEmail(email) === false) {
      setErrorBar(true);
      setErrorMessage(t("Error-should-be-in-email-format"));
    } else {
      setErrorBar(false);
      dispatch(validationEmailAction(email, navigate, t));
    }
  };

  //Remeber Password Functionality
  const rememberChangeEmail = () => {
    setRemeberEmail(!rememberEmail);

    if (!rememberEmail === true) {
      localStorage.setItem("rememberEmail", true);
      localStorage.setItem("rememberEmailValue", email);
    } else {
      localStorage.setItem("rememberEmail", false);
      localStorage.setItem("rememberEmailValue", "");
    }
  };

  //Subscribe now
  const handleSubscribeNowButton = () => {
    localStorage.setItem("signupCurrentPage", 1);
    // dispatch(signUpFlowRoutes(1));
    navigate("/Signup");
  };

  //Handle Free Trial
  const handleClickFreeTrail = () => {
    localStorage.setItem("PackageID", 4);
    localStorage.setItem("TenureOfSuscriptionID", 2);
    localStorage.setItem("signupCurrentPage", 2);

    // setCurrentStep(9);
    navigate("/Signup", {
      state: {
        freeTrail: true,
      },
    });
  };

  useEffect(() => {
    emailRef.current.focus();
    let RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
    let RememberPasswordLocal = JSON.parse(
      localStorage.getItem("remeberPassword")
    );
    let reLang = localStorage.getItem("i18nextLng");

    let RSVP = localStorage.getItem("RSVP");
    let DataRoomEmailValue = localStorage.getItem("DataRoomEmail");
    let LoginFlowPageRoute = JSON.parse(
      localStorage.getItem("LoginFlowPageRoute")
    );

    if (RememberEmailLocal === true && RememberPasswordLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );

      localStorage.clear();
      try {
        if (Number(LoginFlowPageRoute) !== 1) {
          localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
        }
      } catch {}
      if (reLang != undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      if (RSVP) {
        localStorage.setItem("RSVP", RSVP);
      }
      if (DataRoomEmailValue) {
        localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
      setErrorMessage("");
      setErrorBar(false);
      setRemeberEmail(RememberEmailLocal);
      setEmail(RememberEmailLocalValue);
    } else if (RememberEmailLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");
      localStorage.clear();
      try {
        if (Number(LoginFlowPageRoute) !== 1) {
          localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
        }
      } catch {}
      if (reLang != undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      if (RSVP) {
        localStorage.setItem("RSVP", RSVP);
      }
      if (DataRoomEmailValue) {
        localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
      }
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
      setErrorMessage("");
      setErrorBar(false);
      setRemeberEmail(RememberEmailLocal);
      setEmail(RememberEmailLocalValue);
    } else if (RememberPasswordLocal === true) {
      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );
      localStorage.clear();
      try {
        if (Number(LoginFlowPageRoute) !== 1) {
          localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
        }
      } catch {}

      if (reLang != undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      if (RSVP) {
        localStorage.setItem("RSVP", RSVP);
      }
      if (DataRoomEmailValue) {
        localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
      setErrorMessage("");
      setErrorBar(false);
    } else {
      localStorage.clear();
      try {
        if (Number(LoginFlowPageRoute) !== 1) {
          localStorage.setItem("LoginFlowPageRoute", LoginFlowPageRoute);
        }
      } catch {}

      if (reLang != undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      if (RSVP) {
        localStorage.setItem("RSVP", RSVP);
      }
      if (DataRoomEmailValue) {
        localStorage.setItem("DataRoomEmail", DataRoomEmailValue);
      }
      localStorage.setItem("rememberEmail", false);
      localStorage.setItem("rememberEmailValue", "");
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
      setErrorMessage("");
      setErrorBar(false);
    }
  }, []);

  useEffect(() => {
    if (adminReducer.DeleteOrganizationResponseMessage !== "") {
      setOpen({
        open: true,
        message: adminReducer.DeleteOrganizationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
      }, 4000);
      dispatch(cleareMessage());
    }
  }, [adminReducer.DeleteOrganizationResponseMessage]);

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
      dispatch(cleareMessage());
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
      <Container fluid className={styles["auth_container"]}>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <section className={styles["freetrail_banner"]}>
              <span className={styles["freetrail_heading"]}>
                {t("Start-your-Free-Trial-now")}
              </span>
              <span
                className={styles["Free-Trial_btn"]}
                onClick={handleClickFreeTrail}
              >
                {t("Free-Trial")}
              </span>
            </section>
          </Col>
        </Row>
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col lg={4} md={4} sm={12} className={styles["SignInEmailBox"]}>
            <Paper className={styles["EmailVerifyBox"]}>
              <Col sm={12} lg={12} md={12}>
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
                <Row className="mt-4 mb-4 text-center">
                  <Col>
                    <span className={styles["signIn_heading"]}>
                      {t("Sign-in")}
                    </span>
                  </Col>
                </Row>
                <Form onSubmit={loginHandler}>
                  <Row className="">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex justify-content-center flex-column"
                    >
                      <Form.Control
                        required
                        className={styles["inputEmailField"]}
                        onChange={emailChangeHandler}
                        value={email || ""}
                        width="100%"
                        placeholder={t("Email")}
                        maxLength={160}
                        ref={emailRef}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="d-flex gap-2 align-items-center"
                    >
                      <Checkbox
                        checked={rememberEmail}
                        classNameDiv=""
                        onChange={rememberChangeEmail}
                        className={styles["RememberEmail"]}
                      />
                      <span className="Remember_checkbox_styles Arabicstyles_Subtotal_Not_include_taxes">
                        {t("Remeber-email")}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-4 mb-1 d-flex justify-content-center">
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-center  "
                    >
                      <Button
                        text={t("Next")}
                        onClick={loginHandler}
                        className={styles["Next_button_EmailVerify"]}
                      />
                    </Col>
                  </Row>
                </Form>
                <Row className="mt-3">
                  <Col sm={12} md={12} lg={12}>
                    {" "}
                    <span className={styles["signup-text-inloginpage"]}>
                      {t("Havent-subscribed-yet")}
                    </span>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center mt-1">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="w-100 d-flex justify-content-center"
                  >
                    <Button
                      text={t("Subscribe-now")}
                      onClick={handleSubscribeNowButton}
                      className={styles["subscribNow_button_EmailVerify"]}
                    />
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
                draggable="false"
                src={DiskusAuthPageLogo}
                alt="auth_icon"
                width="600px"
                className={styles["Auth_Icon"]}
              />
            </Col>
          </Col>
        </Row>
        <Notification
          setOpen={setOpen}
          open={open.open}
          message={open.message}
        />
        {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      </Container>
    </>
  );
};

export default SignInUserManagement;
