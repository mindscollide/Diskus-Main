import React from "react";
import styles from "./ConfirmationModal.module.css";
import CustomModal from "../modal/Modal";
import { Row, Col } from "react-bootstrap";
import Button from "../../elements/button/Button";
import { useTranslation } from "react-i18next";

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
