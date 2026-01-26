import React from "react";
import { Button, Modal } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import styles from "./submitForApproval.module.css";

const StatusSubmitForApprovalModal = () => {
  const { t } = useTranslation();
  const { submitForApprovalModal, setSubmitForApprovalModal } =
    useComplianceContext();

  const handleCloseButton = () => {
    setSubmitForApprovalModal(false);
  };
  const handleProceedButton = () => {};
  return (
    <Modal
      show={submitForApprovalModal}
      setShow={setSubmitForApprovalModal}
      modalFooterClassName={"d-block border-0"}
      modalHeaderClassName={"d-block border-0"}
      size={"sm"}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              Image
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              Some checklist items are still pending. Do you want to continue
              submitting for approval
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
                text={t("Yes")}
                className={styles["CancelButton"]}
                onClick={handleCloseButton}
              />
              <Button
                text={t("No")}
                className={styles["ProceedButtonStyles"]}
                onClick={handleProceedButton}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default StatusSubmitForApprovalModal;
