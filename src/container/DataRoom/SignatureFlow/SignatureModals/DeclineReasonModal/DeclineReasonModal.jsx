import React from "react";
import { Button, Modal, TextField } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import styles from "./DeclineResonModal.module.css";
const DeclineReasonModal = ({
  show,
  setShow,
  handleClickDecline,
  declineReasonMessage,
  setDeclineReasonMessage,
  declineErrorMessage,
  setDeclineErrorMessage,
}) => {
  const handleClose = () => {
    setShow(false);
    setDeclineReasonMessage("");
    setDeclineErrorMessage(false);
  };

  const handleChangeReasonInput = (event) => {
    const { value } = event.target;
    setDeclineReasonMessage(value);
  };
  return (
    <Modal
      size={"md"}
      show={show}
      onHide={handleClose}
      setShow={setShow}
      closeButton={true}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={styles["ReasonModalHeaderClass"]}
      ModalBody={
        <>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["DeclineModalHeading"]}
            >
              Decline to sign this document
            </Col>
          </Row>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["DeclineModalSubTitle"]}
            >
              Declining this document will clear anything you have entered and
              notify the sender
            </Col>
          </Row>
          <Row className="mt-3">
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["DeclineModalHeading2"]}
            >
              Reason for declining <span className={styles["Steric"]}>*</span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["DeclineModalSubLine"]}
            >
              This information will be shared only with the sender.
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <TextField
                as={"textarea"}
                applyClass={"DeclineReasonInput"}
                placeholder={"Reason"}
                labelClass={"d-none"}
                rows={6}
                value={declineReasonMessage}
                change={handleChangeReasonInput}
              />
            </Col>
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["declineErrorMessage"]}
            >
              {declineReasonMessage === "" && declineErrorMessage
                ? "Please provide a reason"
                : null}
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
              className="d-flex justify-content-end gap-3"
            >
              <Button
                text={"Cancel"}
                className={styles["CancelBtn"]}
                onClick={handleClose}
              />
              <Button
                text={"Decline"}
                className={styles["DeclineBtn"]}
                onClick={handleClickDecline}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default DeclineReasonModal;
