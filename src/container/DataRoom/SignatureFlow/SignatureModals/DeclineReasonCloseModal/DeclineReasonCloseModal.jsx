import React from "react";
import { Button, Modal } from "../../../../../components/elements";
import { Row, Col } from "react-bootstrap";
import styles from "./DeclineReasonCloseModal.module.css";
import { useTranslation } from "react-i18next";
const DeclineReasonCloseModal = ({ show, setShow }) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setShow(false);
    window.close();
  };
  return (
    <Modal
      show={show}
      setShow={setShow}
      closeButton={true}
      size={"md"}
      onHide={handleClose}
      modalFooterClassName={"d-block"}
      className={styles["DeclineReasonCloseModal"]}
      ModalBody={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["declineReasonModal2"]}
            >
              {t("This-document-is-now-closed")}
            </Col>
          </Row>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["declineReasoSubLine"]}
            >
              {t("You-ill-receive-an-email-confirmation-shortly")}
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col sm={12} md={12} lg={12} className="d-flex justify-content-end">
              <Button
                text="Close"
                className={styles["declineReasonCancelBtn"]}
                onClick={() => window.close()}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default DeclineReasonCloseModal;
