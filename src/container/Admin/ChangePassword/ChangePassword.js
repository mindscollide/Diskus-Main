import React, { useState, useEffect } from "react";
import styles from "./ChangePassword.module.css";
import { Container, Row, Col } from "react-bootstrap";
import "./ChangePassword.css"
import {
  Button,
  TextField,
  Modal,
  Notification,
} from "../../../components/elements";
import PasswordChecklist from "react-password-checklist";
import PasswordEyeIcon from "../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../assets/images/newElements/password_hide.svg";
import PasswordUpdatedIcon from "../../../assets/images/Password-Updated.png";
import {
  changePasswordFunc,
  cleareMessage,
} from "../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../components/elements/snack_bar/utill";
const ChangePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { Authreducer } = useSelector((state) => state);
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPasssword] = useState(false);
  const [showNewPasswordIcon, setShowNewPasswordIcon] = useState(false);
  const [showConfirmPasswordIcon, setConfirmShowPasswordIcon] = useState(false);
  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const [modalFlag, setmMdalFlag] = useState(false);
  const [Password, setPassword] = useState({
    newPassword: "",
    ConfirmPassword: "",
  });

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const dispatch = useDispatch();

  const passwordChangeHandler = (e) => {
    setOldPassword(e.target.value.trimStart());
  };

  const handleNewPasswordChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPassword({
      ...Password,
      [name]: value.trimStart(),
    });
  };

  const handleshowOldPassword = () => {
    setShowOldPasssword(!showOldPassword);
  };

  const showNewPassowrd = () => {
    setShowNewPasswordIcon(!showNewPasswordIcon);
  };

  const showConfirmPassowrd = () => {
    setConfirmShowPasswordIcon(!showConfirmPasswordIcon);
  };

  const handleConformationUpdate = async () => {
    await dispatch(
      changePasswordFunc(navigate, oldPassword, Password.newPassword, t)
    );
  };

  const cancelHandler = () => {
    setmMdalFlag(false);
  };

  useEffect(() => {
    if (
      Authreducer.ChangeUserPasswordResponseMessage != t("Change-password") &&
      Authreducer.ChangeUserPasswordResponseMessage !=
        t("Your-password-has-been-updated") &&
      Authreducer.ChangeUserPasswordResponseMessage !=
        t("Your-password-has-been-changed-successfully") &&
      Authreducer.ChangeUserPasswordResponseMessage !=
        t("Password-updated-successfully") &&
      Authreducer.ChangeUserPasswordResponseMessage != ""
    ) {
      showMessage(
        Authreducer.ChangeUserPasswordResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
    if (
      Authreducer.ChangeUserPasswordResponseMessage.toLowerCase().includes(
        t("Password-updated-successfully").toLowerCase()
      )
    ) {
      setOldPassword("");
      setShowOldPasssword(false);
      setShowNewPasswordIcon(false);
      setConfirmShowPasswordIcon(false);
      setmMdalFlag(true);
      setPassword({ ...Password, newPassword: "", ConfirmPassword: "" });
    }
  }, [Authreducer.ChangeUserPasswordResponseMessage]);

  const handlerevert = () => {
    setShowOldPasssword(false);
    setOldPassword("");
    setShowNewPasswordIcon(false);
    setConfirmShowPasswordIcon(false);
    setPasswordStrong(false);
    setmMdalFlag(false);
    setPassword({ ...Password, newPassword: "", ConfirmPassword: "" });
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={6} lg={6} className="py-3">
            <Row>
              <Col sm={12} md={12} lg={12} className="mb-5 p-0">
                <h4 className={styles["changePasswordTitle"]}>
                  {t("Change-password")}
                </h4>
              </Col>
            </Row>
            <Row>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="label-changepassword MontserratMedium-500 color-5a5a5a mt-2"
              >
                {t("Old-password")}
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="password-change-branch p-0 position-relative"
              >
                <TextField
                  applyClass="form-control3"
                  className="PasswordTextField"
                  type={showOldPassword ? "text" : "password"}
                  name="Password"
                  value={oldPassword || ""}
                  change={passwordChangeHandler}
                  maxLength={25}
                  placeholder={t("Old-password")}
                  inputicon={
                    showOldPassword ? (
                      <img draggable="false" src={PasswordHideEyeIcon} alt="" />
                    ) : (
                      <img draggable="false" src={PasswordEyeIcon} alt="" />
                    )
                  }
                  iconclassname="eye_icon"
                  labelclass="d-none"
                  autoComplete="false"
                  clickIcon={handleshowOldPassword}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                sm={12}
                md={6}
                lg={6}
                className="label-changepassword MontserratMedium-500 color-5a5a5a mt-2"
              >
                {t("New-password")}
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="password-change-branch p-0 position-relative"
              >
                {" "}
                <TextField
                  applyClass="form-control3"
                  className="PasswordTextField"
                  type={showNewPasswordIcon ? "text" : "password"}
                  name="newPassword"
                  value={Password.newPassword || ""}
                  change={handleNewPasswordChange}
                  maxLength={25}
                  placeholder={t("New-password")}
                  inputicon={
                    showNewPasswordIcon ? (
                      <img draggable="false" src={PasswordHideEyeIcon} alt="" />
                    ) : (
                      <img draggable="false" src={PasswordEyeIcon} alt="" />
                    )
                  }
                  iconclassname="eye_icon"
                  labelclass="d-none"
                  autoComplete="false"
                  clickIcon={showNewPassowrd}
                />
                <span className="color-5a5a5a" style={{ fontSize: "0.5rem" }}>
                  ({t("Maximum-password-length-is-25-characters")})
                </span>
              </Col>
            </Row>

            <Row className="my-3">
              <Col
                sm={12}
                md={6}
                lg={6}
                className="label-changepassword MontserratMedium-500 color-5a5a5a mt-2"
              >
                {t("Confirm-password")}
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="password-change-branch p-0 position-relative"
              >
                {" "}
                <TextField
                  applyClass="form-control3"
                  className="PasswordTextField"
                  type={showConfirmPasswordIcon ? "text" : "password"}
                  name="ConfirmPassword"
                  value={Password.ConfirmPassword || ""}
                  change={handleNewPasswordChange}
                  maxLength={25}
                  placeholder={t("Confirm-password")}
                  inputicon={
                    showConfirmPasswordIcon ? (
                      <img draggable="false" src={PasswordHideEyeIcon} alt="" />
                    ) : (
                      <img draggable="false" src={PasswordEyeIcon} alt="" />
                    )
                  }
                  iconclassname="eye_icon"
                  labelclass="d-none"
                  autoComplete="false"
                  clickIcon={showConfirmPassowrd}
                />
              </Col>
            </Row>

            <Row className="my-2">
              <Col sm={12} md={6} lg={6}></Col>
              <Col sm={12} md={6} lg={6} className={styles["passwordCheckBox"]}>
                <span className={"password-must"}>
                  {t("Please-ensure")}
                </span>
                <PasswordChecklist
                  rules={["minLength", "specialChar", "letter", "match"]}
                  messages={{
                    minLength: t("Password-has-atleast-8-characters"),
                    specialChar: t("Password-has-special-characters"),
                    letter: t("Password-has-a-letter"),
                    match: t("Passwords-match"),
                  }}
                  itemClassName={"error_styles_changePassword"}
                  minLength={8}
                  className={"borderRadius-4 "}
                  value={Password.newPassword}
                  valueAgain={Password.ConfirmPassword}
                  onChange={(isValid) => {
                    console.log(isValid, "isValid", setPasswordStrong(isValid));
                  }}
                  invalidColor="#ff0000"
                  validColor="#6172D6"
                  iconSize={"11px"}
                />
              </Col>
            </Row>

            <Row className={styles["changePasswordButtons"]}>
              <Col sm={12} md={6} lg={6}>
                <Button
                  text={t("Revert")}
                  onClick={handlerevert}
                  className={styles["Revert"]}
                />
              </Col>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-end p-0"
              >
                <Button
                  disableBtn={
                    oldPassword === ""
                      ? true
                      : Password.newPassword === ""
                      ? true
                      : Password.ConfirmPassword === ""
                      ? true
                      : !isPasswordStrong
                      ? true
                      : false
                  }
                  text={t("Update")}
                  onClick={handleConformationUpdate}
                  className={styles["Update"]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Modal
        show={modalFlag}
        setShow={setmMdalFlag}
        modalHeaderClassName={styles["modalHeaderUpdatePassword"]}
        modalBodyClassName={styles["modalUpdatemodal"]}
        modalFooterClassName="modal-footer-update"
        centered
        size={"md"}
        ModalBody={
          <>
            {modalFlag ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} className="text-center">
                    <img draggable="false" src={PasswordUpdatedIcon} alt="" />
                    <p className={styles["modalUpdateText"]}>
                      {t("Your-password-has-been-changed-successfully")}
                    </p>
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
        ModalFooter={
          <>
            {modalFlag ? (
              <>
                <Row className={styles["modalUpdateted-2"]}>
                  <Col lg={12} md={12} sm={12} xs={12} className="text-center ">
                    <Button
                      className={styles["modalProceedBtn"]}
                      text={t("Ok")}
                      onClick={cancelHandler}
                    />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
      />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ChangePassword;
