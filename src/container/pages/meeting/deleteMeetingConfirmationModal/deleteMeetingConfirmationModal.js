import React, { useState } from "react";
import { Button, Modal, TextField } from "../../../../components/elements";
import { useMeetingContext } from "../../../../context/MeetingContext";
import styles from "./deleteMeetingConfirmationModal.module.css";
import PasswordEyeIcon from "../../../../assets/images/newElements/password.svg";
import PasswordHideEyeIcon from "../../../../assets/images/newElements/password_hide.svg";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const DeleteMeetingConfirmationModal = () => {
  const { setDeleteMeetingConfirmationModal, deleteMeetingConfirmationModal } =
    useMeetingContext();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(
    "Please Enter Correct Password"
  );
  const [confirmPasswordBtnDisabled, setConfirmPasswordBtnDisabled] =
    useState(false);
  return (
    <>
      <Modal
        show={deleteMeetingConfirmationModal}
        setShow={setDeleteMeetingConfirmationModal}
        size={"md"}
        modalHeaderClassName={"d-none"}
        onHide={() => setDeleteMeetingConfirmationModal(false)}
        modalBodyClassName={styles["delete-meeting-modal"]}
        modalFooterClassName={styles["delete-meeting-modalfooter"]}
        ModalBody={
          <>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <h3 className={styles["delete-meeting-heading"]}>
                  {t("Delete-meeting")}?
                </h3>
              </Col>
              <Col sm={12} md={12} lg={12}>
                <span className={styles["delete-meeting-text"]}>
                  {t(
                    "Please-confirm-your-password-before-deleting-the-meeting"
                  )}
                </span>
              </Col>
              <Col sm={12} md={12} lg={12} className='mt-4'>
                <TextField
                  type={showPassword ? "password" : "text"}
                  label={"Password"}
                  value={passwordValue}
                  change={(e) => setPasswordValue(e.target.value)}
                  width={"100%"}
                  height={"31px"}
                  formParentClass={"passwordCheckField_parent"}
                  applyClass={"passwordCheckField"}
                  iconclassname={styles["iconclassname"]}
                  labelclass={styles["labelclass"]}
                  inputicon={
                    showPassword ? (
                      <img
                        src={PasswordEyeIcon}
                        width={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <img
                        src={PasswordHideEyeIcon}
                        width={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )
                  }
                />
                <p
                  className={
                    showError
                      ? ` ${styles["errorMessage-inLogin"]} `
                      : `${styles["errorMessage-inLogin_hidden"]}`
                  }>
                  {showErrorMessage}
                </p>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className='m-0 p-0'>
              <Col sm={12} md={12} lg={12} className='m-0 p-0'>
                <Button
                  text={t("Confirm-password")}
                  className={styles["ConfirmPasswordBtn"]}
                  textClass={
                    confirmPasswordBtnDisabled &&
                    styles["ConfirmPasswordBtnTextDisabled"]
                  }
                  disableBtn={confirmPasswordBtnDisabled}
                />
              </Col>
            </Row>
          </>
        }
      />
    </>
  );
};

export default DeleteMeetingConfirmationModal;
