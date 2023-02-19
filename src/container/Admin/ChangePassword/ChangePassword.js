import React, { useState, useEffect } from "react";
import styles from "./ChangePassword.module.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  Button,
  TextField,
  Loader,
  Modal,
  Notification,
} from "../../../components/elements";
import PasswordChecklist from "react-password-checklist";
import PasswordEyeIcon from "../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../assets/images/newElements/password_hide.svg";
import PasswordUpdatedIcon from "../../../assets/images/Password-Updated.png";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import {
  changePasswordFunc,
  cleareMessage,
} from "../../../store/actions/Auth2_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const ChangePassword = () => {
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
    await dispatch(changePasswordFunc(oldPassword, Password.newPassword, t));
  };
  const cancelHandler = () => {
    setmMdalFlag(false);
  };
  useEffect(() => {
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
      setOpen({
        ...open,
        open: true,
        message: Authreducer.ChangeUserPasswordResponseMessage,
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
  }, [Authreducer.ChangeUserPasswordResponseMessage]);

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
                className="label-changepassword MontserratMedium-500 color-5a5a5a"
              >
                {t("Old-password")}
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showOldPassword ? "text" : "password"}
                  name="Password"
                  // width="285px"
                  value={oldPassword || ""}
                  change={passwordChangeHandler}
                  placeholder={t("Old-password")}
                  inputIcon={
                    showOldPassword ? (
                      <img src={PasswordHideEyeIcon} />
                    ) : (
                      <img src={PasswordEyeIcon} />
                    )
                  }
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={handleshowOldPassword}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                sm={12}
                md={6}
                lg={6}
                className="label-changepassword MontserratMedium-500 color-5a5a5a"
              >
                {t("New-password")}
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                {" "}
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showNewPasswordIcon ? "text" : "password"}
                  name="newPassword"
                  // width="285px"
                  value={Password.newPassword || ""}
                  change={handleNewPasswordChange}
                  placeholder={t("New-password")}
                  inputIcon={
                    showNewPasswordIcon ? (
                      <img src={PasswordHideEyeIcon} />
                    ) : (
                      <img src={PasswordEyeIcon} />
                    )
                  }
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={showNewPassowrd}
                />
                <span
                  className="MontserratSemiBold-600 color-5a5a5a"
                  style={{ fontSize: "0.5rem" }}
                >
                  ({t("Max25Char")})
                </span>
              </Col>
            </Row>
            <Row className="my-2">
              <Col sm={12} md={6} lg={6}></Col>
              <Col sm={12} md={6} lg={6} className={styles["passwordCheckBox"]}>
                <p className={"password-must m-0 fw-bold"}>
                  {t("Password-must-be")}
                </p>
                <PasswordChecklist
                  rules={["minLength", "specialChar", "letter", "match"]}
                  messages={{
                    minLength: t("Password-has-atleast-8-characters"),
                    specialChar: t("Password-has-special-characters"),
                    letter: t("Password-has-a-letter"),
                    match: t("Passwords-match"),
                  }}
                  minLength={8}
                  className={styles["passwordTextHandler"]}
                  value={Password.newPassword}
                  valueAgain={Password.ConfirmPassword}
                  onChange={(isValid) => {
                    console.log(isValid, "isValid", setPasswordStrong(isValid));
                  }}
                  invalidColor="#ff0000"
                  validColor="#5F78D6"
                  iconSize={"14px"}
                />
              </Col>
            </Row>
            <Row className="my-2">
              <Col
                sm={12}
                md={6}
                lg={6}
                className="label-changepassword MontserratMedium-500 color-5a5a5a"
              >
                {t("Confirm-password")}
              </Col>
              <Col sm={12} md={6} lg={6} className="p-0 position-relative">
                {" "}
                <TextField
                  applyClass="form-control2"
                  className="PasswordTextField"
                  type={showConfirmPasswordIcon ? "text" : "password"}
                  name="ConfirmPassword"
                  // width="285px"
                  value={Password.ConfirmPassword || ""}
                  change={handleNewPasswordChange}
                  placeholder={t("Confirm-password")}
                  inputIcon={
                    showConfirmPasswordIcon ? (
                      <img src={PasswordHideEyeIcon} />
                    ) : (
                      <img src={PasswordEyeIcon} />
                    )
                  }
                  iconClassName="eye_icon"
                  labelClass="d-none"
                  autoComplete="false"
                  clickIcon={showConfirmPassowrd}
                />
              </Col>
            </Row>
            <Row className={styles["changePasswordButtons"]}>
              <Col sm={12} md={6} lg={6}>
                <Button
                  text={t("Revert")}
                  className={`${"MontserratSemiBold"} ${styles["Revert"]}`}
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
                  className={`${"MontserratSemiBold"} ${styles["Update"]}`}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Modal
        show={modalFlag}
        setShow={setmMdalFlag}
        // ButtonTitle={ModalTitle}
        modalBodyClassName={styles["modalUpdatemodal"]}
        modalFooterClassName="modal-footer-update"
        // modalHeaderClassName={
        //   isUpdateButton === true ? "d-none" : "modalUpdateted"
        // }
        centered
        size={"md"}
        ModalBody={
          <>
            {modalFlag ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} className="text-center">
                    <img src={PasswordUpdatedIcon} alt="" />
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
                  {/* <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                    <Button
                      onClick={cancelHandler}
                      className={styles["modalCancelBtn"]}
                      text={t("Cancel")}
                    /> 
                  </Col>*/}
                  <Col lg={12} md={12} sm={12} xs={12} className="text-center ">
                    <Button
                      className={styles["modalProceedBtn"]}
                      text={t("Ok-Title")}
                      onClick={cancelHandler}
                    />
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        }
      />
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {Authreducer.Loading ? <Loader /> : null}
    </>
  );
};

export default ChangePassword;
