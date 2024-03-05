import React, { useRef, useState } from "react";
import styles from "./PasswordCreationUM.module.css";
import LanguageSelector from "../../../../components/elements/languageSelector/Language-selector";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Button, Checkbox, Paper } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import DiskusLogo from "../../../../assets/images/newElements/Diskus_newLogo.svg";
import { useSelector } from "react-redux";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordChecklist from "react-password-checklist";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import DiskusAuthPageLogo from "../../../../assets/images/newElements/Diskus_newRoundIcon.svg";
import { Link } from "react-router-dom";
import { showCreateAddtionalUsersModal } from "../../../../store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import CreateAddtionalUsersModal from "../ModalsUserManagement/CreateAdditionalusersModal/CreateAddtionalUsersModal";
const PasswordCreationUM = () => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const passwordRef = useRef();

  const { UserManagementModals } = useSelector((state) => state);

  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const { Authreducer, LanguageReducer } = useSelector((state) => state);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setConfirmShowPasswordIcon] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    Password: "",
    ConfirmPassword: "",
  });
  const [password, setPassword] = useState("");

  const handleSignupButton = () => {
    dispatch(showCreateAddtionalUsersModal(true));
  };

  return (
    <Container fluid>
      <Row className="position-relative">
        <Col className="languageSelector">
          <LanguageSelector />
        </Col>
      </Row>
      <Row>
        <Col
          lg={4}
          md={4}
          sm={12}
          className="d-flex justify-content-center align-items-center mx-auto min-vh-100"
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
                  <img
                    draggable="false"
                    src={DiskusLogo}
                    width={220}
                    alt="diskus_logo"
                  />
                </Col>
              </Row>
              <Row className="mt-4 mb-3">
                <Col className="">
                  <span className={styles["signIn_heading"]}>
                    {t("Create-password")}
                  </span>
                </Col>
              </Row>
              <Form>
                <Row className="mb-3">
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="create-field-password position-relative d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["PasswordTextField"]}
                      type={showNewPasswordIcon ? "text" : "password"}
                      name="Password"
                      ref={passwordRef}
                      value={passwordDetails.Password || ""}
                      //   onChange={passwordChangeHandler}
                      placeholder={t("New-password")}
                      autoComplete="false"
                      iconClassName={styles["IconStyle"]}
                    />
                    <span
                      className={styles["passwordIcon"]}
                      //   onClick={showNewPassowrd}
                    >
                      {showNewPasswordIcon ? (
                        <img
                          draggable="false"
                          alt=""
                          src={PasswordHideEyeIcon}
                        />
                      ) : (
                        <img draggable="false" alt="" src={PasswordEyeIcon} />
                      )}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    lg={12}
                    md={12}
                    xs={12}
                    className="create-field-password position-relative d-flex  justify-content-center "
                  >
                    <Form.Control
                      className={styles["PasswordTextField"]}
                      type={showConfirmPasswordIcon ? "text" : "password"}
                      name="ConfirmPassword"
                      value={passwordDetails.ConfirmPassword || ""}
                      //   onChange={passwordChangeHandler}
                      placeholder={t("Re-enter-password")}
                      iconClassName={styles["IconStyle"]}
                    />
                    <span
                      className={styles["passwordIcon"]}
                      //   onClick={showConfirmPassowrd}
                    >
                      {showConfirmPasswordIcon ? (
                        <img
                          draggable="false"
                          alt=""
                          src={PasswordHideEyeIcon}
                        />
                      ) : (
                        <img draggable="false" alt="" src={PasswordEyeIcon} />
                      )}
                    </span>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={12} md={12} lg={12} className="d-flex gap-2">
                    <Checkbox
                      classNameDiv=""
                      //   checked={remeberPassword}
                      //   onChange={rememberPasswordCheck}
                    />
                    <span className={styles["Create_password_remember_check"]}>
                      {t("Remember-password")}
                    </span>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["PasswordCheckListstyle"]}
                  >
                    <p className={styles["paragraph_password_must_have"]}>
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
                      // invalidColor="#ff0000"
                      // validColor="#6172D6"
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
                    className="d-flex justify-content-center"
                  >
                    <Button
                      text={t("Sign-up")}
                      className={styles["subscribNow_button_EmailVerify"]}
                      onClick={handleSignupButton}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col className="d-flex justify-content-center ">
                    <Link
                      to="/"
                      className={styles["goBackPackageSelectionBtn"]}
                    >
                      {t("Go-back")}
                    </Link>
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
              draggable="false"
              src={DiskusAuthPageLogo}
              alt="auth_icon"
              width="600px"
              className={styles["Auth_Icon"]}
            />
          </Col>
        </Col>
      </Row>
      {UserManagementModals.createAdditionalModals && (
        <CreateAddtionalUsersModal />
      )}
    </Container>
  );
};

export default PasswordCreationUM;
