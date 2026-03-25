import React from "react";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./complianceStatusCompleteModal.module.css";

const ComplianceStatusCompleteExceptionModal = () => {
  const { t } = useTranslation();
  const {
    comlianceCompleteExceptionModal,
    setComlianceCompleteExceptionModal,
    complianceCompleteModalType,
    setComplianceCompleteModalType,
  } = useComplianceContext();

  const isChecklistModal = complianceCompleteModalType === "checklist";

  const handleCloseButton = () => {
    setComlianceCompleteExceptionModal(false);
    if (complianceCompleteModalType) {
      setComplianceCompleteModalType(null);
    }
  };

  return (
    <Modal
      show={comlianceCompleteExceptionModal}
      setShow={setComlianceCompleteExceptionModal}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"md"}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <div className={styles.ConfirmationText}>
                {isChecklistModal
                  ? t(
                      "Some-tasks-are-still-pending-Complete-them-before-making-the-checklist-Completed",
                    )
                  : t(
                      "This-Compliance-cannot-be-marked-as-Completed-because-some-tasks-are-still-not-completed",
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
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default ComplianceStatusCompleteExceptionModal;
