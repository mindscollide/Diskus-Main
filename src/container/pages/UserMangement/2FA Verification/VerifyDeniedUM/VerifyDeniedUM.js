import React from "react";
import styles from "./VerifyDeniedUM.module.css";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "react-bootstrap";
import img1 from "../../../../../assets/images/newElements/Diskus_newLogo.svg";
import img9 from "../../../../../assets/images/9.png";
import DiskusAuthPageLogo from "../../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import logo from "../../../../../assets/images/signinlogo.svg";
import LanguageSelector from "../../../../../components/elements/languageSelector/Language-selector";
import { Button } from "../../../../../components/elements";
import { LoginFlowRoutes } from "../../../../../store/actions/UserManagementActions";
import { useDispatch } from "react-redux";
const VerifyDeniedUM = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleBacktoSignIn = () => {
    console.log("clicked");
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };

  return (
    <>
      <Container fluid className={styles["SigninDenied"]}>
        <Row className="position-relative">
          <Col className={styles["languageSelector"]}>
            <LanguageSelector />
          </Col>
        </Row>
        <Row>
          <Col
            lg={5}
            md={5}
            sm={12}
            className="d-flex justify-content-center align-items-center min-vh-100"
          >
            <span className={styles["loginbox_auth_paper_for_SignInDenied"]}>
              <Col
                sm={12}
                lg={12}
                md={12}
                className={styles["EmailVerifyBox_for_SignInDenied"]}
              >
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center "
                  >
                    <img
                      draggable="false"
                      src={img1}
                      width="220px"
                      height="69px"
                      alt="diskus_logo"
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center text-center "
                  >
                    <span className={styles["MainHeading_For_SigninDenied"]}>
                      {t("Your-sign-in-was-denied")}
                    </span>
                  </Col>
                </Row>

                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className="d-flex justify-content-center align-item-center mt-2"
                  >
                    <img
                      draggable="false"
                      width="116px"
                      height="120.92px"
                      src={logo}
                      className={styles["Image_logo_singin_denied"]}
                      alt=""
                    />
                  </Col>
                </Row>

                <Row className="mt-0 mb-2 d-flex justify-content-center">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    className="d-flex justify-content-center mt-4"
                  >
                    <Button
                      text={t("Back-to-sign-in").toUpperCase()}
                      className={
                        styles["Next_button_EmailVerify_For_SignInDenied"]
                      }
                      onClick={handleBacktoSignIn}
                    />
                  </Col>
                </Row>
              </Col>
            </span>
          </Col>

          <Col md={7} lg={7} sm={12} className="">
            <Row>
              <Col sm={12} md={6} lg={6} className="position-relative">
                <img
                  draggable="false"
                  src={img9}
                  alt="auth_icon"
                  className={styles["phone-image"]}
                  width="320px"
                  height="417px"
                />
              </Col>
              <Col sm={12} md={6} lg={6} className="position-relative vh-100">
                <img
                  draggable="false"
                  src={DiskusAuthPageLogo}
                  alt="auth_icon"
                  className={styles["denied_signIn_Auth_Icon"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VerifyDeniedUM;
