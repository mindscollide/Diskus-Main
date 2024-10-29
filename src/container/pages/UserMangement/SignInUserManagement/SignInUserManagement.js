import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  Notification,
  Loader,
} from "../../../../components/elements";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import styles from "./SignInUserMangement.module.css";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { useNavigate } from "react-router-dom";
import { validationEmail } from "../../../../commen/functions/validations";
import {
  cleareMessage,
  validationEmailAction,
} from "../../../../store/actions/Auth2_actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  paymentStatusApi,
  signUpFlowRoutes,
} from "../../../../store/actions/UserManagementActions";
import { localStorageManage } from "../../../../commen/functions/locallStorageManage";
import MobileAppPopUpModal from "../ModalsUserManagement/MobileAppPopUpModal/MobileAppPopUpModal";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const SignInUserManagement = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const emailRef = useRef();

  const {
    Authreducer,
    adminReducer,
    LanguageReducer,
    UserMangementReducer,
    UserManagementModals,
  } = useSelector((state) => state);
  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const getpayemntString = currentUrl.includes("Payment_action")
    ? currentUrl.includes("Payment_action")[1]
    : "";

  //States For Email Validation Integration
  const [email, setEmail] = useState("");
  const [errorBar, setErrorBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberEmail, setRemeberEmail] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  console.log(open.message, "messagemessage");

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
      showMessage(t("Please-enter-email"), "error", setOpen);
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
    localStorage.setItem("SignupFlowPageRoute", 1);
    dispatch(signUpFlowRoutes(1));
    navigate("/Signup");
  };

  //Handle Free Trial
  const handleClickFreeTrail = () => {
    localStorage.setItem("PackageID", 4);
    localStorage.setItem("TenureOfSuscriptionID", 2);
    localStorage.setItem("SignupFlowPageRoute", 2);
    dispatch(signUpFlowRoutes(2));
    navigate("/Signup", {
      state: {
        freeTrail: true,
      },
    });
  };

  useEffect(() => {
    console.log("onChangeAllowMicrosoftCalenderSync", code);
    if (code) {
      localStorage.setItem("Ms", code);
      console.log("onChangeAllowMicrosoftCalenderSync", code);
      window.close();
    } else if (getpayemntString !== "") {
      console.log("Payment_actionPayment_action");
      const paymentStringValue = currentUrl.split("Payment_action=")[1];
      let data = {
        EncryptedString: paymentStringValue,
      };
      dispatch(paymentStatusApi(navigate, t, data));
    } else {
      localStorageManage(
        emailRef,
        dispatch,
        setErrorMessage,
        setErrorBar,
        setRemeberEmail,
        setEmail
      );
    }
  }, []);

  useEffect(() => {
    if (adminReducer.DeleteOrganizationResponseMessage !== "") {
      console.log(
        adminReducer.DeleteOrganizationResponseMessage,
        "DeleteOrganizationResponseMessage"
      );
      showMessage(
        adminReducer.DeleteOrganizationResponseMessage,
        "error",
        setOpen
      );
      dispatch(cleareMessage());
    }
  }, [adminReducer.DeleteOrganizationResponseMessage, setOpen]);

  return (
    <>
      <Container fluid className={styles["auth_container"]}>
        {code ? (
          <></>
        ) : getpayemntString !== "" ? (
          <></>
        ) : (
          <>
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
                <span className={styles["EmailVerifyBox"]}>
                  <Col sm={12} lg={12} md={12}>
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
                          alt="diskus_logo"
                          width={200}
                        />
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
                          <span className={styles["Remember-Email-text"]}>
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
                        <span className={styles["havent-subscribed-text"]}>
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
                </span>
              </Col>
              <Col
                lg={8}
                md={8}
                sm={8}
                className="position-relative d-flex overflow-hidden"
              >
                <Col
                  md={8}
                  lg={8}
                  sm={12}
                  className={styles["Login_page_text"]}
                >
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
            <Notification open={open} setOpen={setOpen} />
            {Authreducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
          </>
        )}
      </Container>
      {getpayemntString && getpayemntString !== "" && UserMangementReducer && (
        <Loader />
      )}
      {UserManagementModals.mobileAppPopUp && <MobileAppPopUpModal />}
    </>
  );
};

export default SignInUserManagement;
