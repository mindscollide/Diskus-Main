import React from "react";
import styles from "./ConfirmationModal.module.css";
import CustomModal from "../modal/Modal";
import { Row, Col } from "react-bootstrap";
import Button from "../../elements/button/Button";
import { useTranslation } from "react-i18next";

/**
 * @component ConfirmationModal
 * @description A generic confirmation dialog used throughout the Diskus platform to
 * warn users that closing a form will discard unsaved data. It renders inside the
 * shared `CustomModal` wrapper and exposes two actions: "Cancel" (stay on the form)
 * and "Close" (confirm dismissal and reset state). All visible strings are translated
 * via react-i18next.
 *
 * @param {boolean}  showModal      - Controls whether the modal is visible.
 * @param {Function} setShowModal   - State setter passed to the modal so it can close itself.
 * @param {Function} onHide         - Callback invoked when the modal backdrop is clicked or the ESC key is pressed.
 * @param {Function} closeBtnClick  - Callback invoked when the user confirms closing ("Close" button).
 * @param {Function} cancelBtnClick - Callback invoked when the user cancels and returns to the form ("Cancel" button).
 *
 * @example
 * <ConfirmationModal
 *   showModal={showConfirm}
 *   setShowModal={setShowConfirm}
 *   onHide={() => setShowConfirm(false)}
 *   closeBtnClick={handleClose}
 *   cancelBtnClick={() => setShowConfirm(false)}
 * />
 */
const ConfirmationModal = ({
  showModal,
  setShowModal,
  onHide,
  closeBtnClick,
  cancelBtnClick,
}) => {
  const { t } = useTranslation();

  return (
    <CustomModal
      modalFooterClassName={"d-block"}
      show={showModal}
      setShow={setShowModal}
      onHide={onHide}
      ModalBody={
        <>
          <Row>
            <Col className={styles["Confirmationmodal_body_text"]}>
              {t(
                "Are-you-sure-if-you-click-on-close-button-the-data-will-reset-and-modal-will-close"
              )}
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-center gap-3"
            >
              <Button
                text={t("Cancel")}
                onClick={cancelBtnClick}
                className={styles["cancel-Add-notes-Modal"]}
              />
              <Button
                text={t("Close")}
                onClick={closeBtnClick}
                className={styles["close-Add-notes-Modal"]}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ConfirmationModal;
