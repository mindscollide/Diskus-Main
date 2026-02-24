import React from "react";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./submitForApproval.module.css";

import alertIcon from "../../../../../assets/images/Alert Icon.png";

const StatusSubmitForApprovalModal = ({ view, handleProceedButtonView }) => {
  const { t } = useTranslation();
  const {
    submitForApprovalModal,
    setSubmitForApprovalModal,
    setComplianceDetailsState,
    tempSelectComplianceStatus,
  } = useComplianceContext();

  const handleCloseButton = () => {
    setSubmitForApprovalModal(false);
  };
  const handleProceedButton = () => {
    setSubmitForApprovalModal(false);
    setComplianceDetailsState((prev) => ({
      ...prev,
      status: tempSelectComplianceStatus,
    }));
  };
  return (
    <Modal
      show={submitForApprovalModal}
      setShow={setSubmitForApprovalModal}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"md"}
      ModalBody={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex justify-content-center align-items-start"
            >
              <img src={alertIcon} alt="AlertIcon" />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} md={12} sm={12} xs={12}>
              <div className={styles.ConfirmationText}>
                {t(
                  "Some-checklist-items-are-still-pending.-Do-you-want-to-continue-submitting-for-approval?",
                )}
              </div>
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex justify-content-center gap-2"
            >
              <Button
                text={t("Close")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleCloseButton}
              />
              <Button
                text={t("Proceed")}
                className={styles["CancelButton"]}
                onClick={view ? handleProceedButtonView : handleProceedButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default StatusSubmitForApprovalModal;
