import React, { useState, useEffect, useRef } from "react";
import styles from "./AddDateModal.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import Caution from "./../../Images/Caution.png";
import Close from "./../../Images/Close.png";

const AddDateModal = ({
  addDateModal,
  setAddDateModal,
  sendReviewers,
  setSendReviewers,
}) => {
  const { t } = useTranslation();

  const closeModal = () => {
    setSendReviewers(true);
    setAddDateModal(false);
  };

  return (
    <Modal
      show={true}
      modalFooterClassName={"d-none"}
      size="sm"
      onHide={closeModal}
      modalHeaderClassName="justify-content-end no-padding-top"
      ModalTitle={
        <>
          <Row>
            <Col
              onClick={closeModal}
              lg={12}
              md={12}
              sm={12}
              className="cursor-pointer"
            >
              <img src={Close} alt="" />
            </Col>
          </Row>
        </>
      }
      modalBodyClassName={styles["modalBodyClass"]}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="text-center">
              <img src={Caution} alt="" />
              <p className={styles["add-deadline"]}>
                {t("Please-add-deadline")}
              </p>
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default AddDateModal;
